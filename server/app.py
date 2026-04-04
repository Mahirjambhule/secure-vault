from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import (JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request)
import random
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from functools import wraps
import crypto_utils
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
import requests
import io
import re
import datetime
import random
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import certifi
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "MAHIR_JAMBHULE_SECURE_VAULT_2026_LONG_KEY")
jwt = JWTManager(app)

CORS(app, resources={r"/*": {"origins": "*"}})

# --- RATE LIMITER CONFIG ---
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Custom JSON response when a user hits the rate limit
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error=f"Security Lock: Too many requests. {e.description}"), 429

# --- SECURITY CONFIG ---
# In a real app, this goes in a .env file!
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", "super-secret-zero-trust-key-2026")

# --- CLOUDINARY CONFIG ---
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)

# --- MONGODB CONNECTION ---
MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client['secure_file_store'] 
    files_collection = db['files']   
    users_collection = db['users']
    print("--- System Online: Connected to MongoDB & Cloudinary ---")
except Exception as e:
    print(f"--- Error Connecting to MongoDB: {e} ---")


@app.route('/api/request-reset', methods=['POST'])
def request_reset():
    data = request.json
    email = data.get('email')
    
    # 1. Check if user exists
    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found", "message": "No account associated with this email"}), 404

    # 2. Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # 3. Save OTP to DB with a timestamp (so it expires in 5 mins)
    db.users.update_one(
        {"email": email},
        {"$set": {"otp": otp, "otp_expiry": datetime.now(timezone.utc) + timedelta(minutes=5)}}
    )

    # 4. Send the Email (Reuse your existing email function)
    try:
        # Assuming your function is named send_otp_email or similar:
        send_otp_email(email, otp) 
        return jsonify({"message": "Reset code sent to your email!"}), 200
    except Exception as e:
        return jsonify({"error": "Email failed", "message": str(e)}), 500
    

# --- JWT MIDDLEWARE ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if 'Authorization' header is present
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Manually verify using the manager's logic or the library
            verify_jwt_in_request() 
            request.user_uid = get_jwt_identity()
        except Exception as e:
            print(f"Token Error: {str(e)}") # This will show in your terminal
            return jsonify({'message': 'Token is invalid or expired!'}), 401
            
        return f(*args, **kwargs)
    return decorated

# --- OTP EMAIL SENDER FUNCTION ---
def send_otp_email(receiver_email, otp_code):
    # Gmail credentials
    sender_email = "mahirjambhule92@gmail.com"
    sender_password = "lmvl dqwy egri czem"
    
    try:
        # Create the email message
        msg = MIMEText(f"Your SecureVault Zero-Trust verification code is: {otp_code}\n\nThis code will expire in 5 minutes.")
        msg['Subject'] = 'SecureVault Login Verification'
        msg['From'] = f"SecureVault <{sender_email}>"
        msg['To'] = receiver_email

        # Connect to Gmail's server and send
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        
        print(f"✅ Success: Real email OTP sent to {receiver_email}")
        
    except Exception as e:
        print(f"❌ Email failed to send: {e}")


# --- AUTHENTICATION ROUTES ---
def is_strong_password(password):
    # Criteria: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    if len(password) < 8:
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    otp_received = data.get('otp')
    new_password = data.get('new_password')

    # 1. Find user and their stored OTP
    user = db.users.find_one({"email": email})
    if not user or user.get('otp') != otp_received:
        return jsonify({"error": "Invalid OTP"}), 400

    # 2. Check Password Strength
    if not is_strong_password(new_password):
        return jsonify({
            "error": "Weak Password", 
            "message": "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
        }), 400

    # 3. Hash and Update Password
    hashed_pw = generate_password_hash(new_password)
    db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed_pw}, "$unset": {"otp": ""}}
    )

    return jsonify({"message": "Password updated successfully!"}), 200
# --- Update in Registration Route ---
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # 1. Extract data from the request
    email = data.get('email')
    password = data.get('password')

    # 2. Basic Validation
    if not email or not password:
        return jsonify({"error": "Missing Data", "message": "Email and password are required"}), 400

    # 3. Check Password Strength
    if not is_strong_password(password):
        return jsonify({
            "error": "Weak Password",
            "message": "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
        }), 400

    # 4. Check if user already exists
    if db.users.find_one({"email": email}):
        return jsonify({"error": "Conflict", "message": "User already exists"}), 409

    # 5. Hash the password and prepare the user object
    hashed_password = generate_password_hash(password)
    
    new_user = {
        "username": email.split('@')[0], # Automatically creates a username from email
        "email": email,
        "password": hashed_password,
        "plan": "Basic",
        "max_storage": 52428800, # 50MB in bytes
        "current_storage": 0,
        "created_at": datetime.now(timezone.utc)
    }

    # 6. Save to Database
    db.users.insert_one(new_user)
    
    return jsonify({"message": "User registered successfully"}), 201

# --- AUTHENTICATION ROUTES ---

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = users_collection.find_one({'email': email})

    # Step 1: Verify Password
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Step 2: Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Save OTP and expiry (5 minutes) to the database for this user
    # Simple and clean
    expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
    users_collection.update_one(
        {'_id': user['_id']}, 
        {'$set': {'otp': otp, 'otp_expiry': expiry}}
    )

    # Step 3: Send the Email (and print to console)
    send_otp_email(email, otp)

    expires = timedelta(minutes=30)
    
    # Create the token with the expiration time
    access_token = create_access_token(identity=str(user['_id']), expires_delta=expires)
    # Tell the frontend that we need the OTP now, don't send the JWT yet!
    return jsonify({
        'message': 'Password verified. OTP sent to email.',
        'requires_otp': True,
        'email': email
    }), 200

@app.route('/verify-otp', methods=['POST'])
@limiter.limit("5 per minute")
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    user_otp = data.get('otp')

    user = users_collection.find_one({'email': email})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Check if OTP exists and matches
    if 'otp' not in user or user['otp'] != user_otp:
        return jsonify({'error': 'Invalid OTP'}), 401
        
    # Check if OTP is expired
    # Note: Ensure both times are timezone-aware or naive. Assuming UTC here.
    current_time = datetime.now(timezone.utc)
    # Handle both naive and aware datetimes from MongoDB
    expiry_time = user['otp_expiry']
    if expiry_time.tzinfo is None:
        expiry_time = expiry_time.replace(tzinfo=timezone.utc)

    if current_time > expiry_time:
        return jsonify({'error': 'OTP has expired. Please log in again.'}), 401

    # Success! Clear the OTP from the database
    users_collection.update_one({'_id': user['_id']}, {'$unset': {'otp': "", 'otp_expiry': ""}})

    # Generate the final JWT Token
    # Use the function we imported earlier
    expires = timedelta(minutes=30)
    token = create_access_token(identity=str(user['_id']), expires_delta=expires)

    return jsonify({
        'message': 'Login fully verified!',
        'token': token,
        'email': user['email']
    }), 200


@app.route('/quota', methods=['GET'])
@token_required
def get_quota():
    MAX_QUOTA = 50 * 1024 * 1024 # 50 MB
    
    # 1. Calculate total size using aggregation
    pipeline = [
        {'$match': {'user_id': request.user_uid}},
        {'$group': {'_id': None, 'total_size': {'$sum': '$file_size'}}}
    ]
    result = list(files_collection.aggregate(pipeline))
    used_space = result[0]['total_size'] if result else 0
    
    # 2. Calculate total file count
    file_count = files_collection.count_documents({'user_id': request.user_uid})
    
    return jsonify({
        'used': used_space,
        'max': MAX_QUOTA,
        'percentage': min((used_space / MAX_QUOTA) * 100, 100),
        'file_count': file_count
    }), 200

@app.route('/upload', methods=['POST'])
@token_required
def upload_file():
    # 1. Initial File Checks
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # 2. Get File Data and Size
    original_data = file.read()
    file_size = len(original_data)

    # 3. ADVANCED QUOTA CHECK (Aggregation)
    # This calculates the sum of all 'file_size' fields in MongoDB for this user
    pipeline = [
        {'$match': {'user_id': request.user_uid}},
        {'$group': {'_id': None, 'total_size': {'$sum': '$file_size'}}}
    ]
    result = list(files_collection.aggregate(pipeline))
    used_space = result[0]['total_size'] if result else 0

    # Define Max Quota (50MB)
    MAX_QUOTA = 50 * 1024 * 1024 

    if used_space + file_size > MAX_QUOTA:
        return jsonify({
            'error': 'Storage quota exceeded!',
            'message': 'You have used your 50MB free tier. Please upgrade to Pro for more space.'
        }), 403

    # 4. Encryption Process (AES-256 GCM)
    try:
        session_key = crypto_utils.generate_key()
        nonce, ciphertext, tag = crypto_utils.encrypt_data(original_data, session_key)
    except Exception as e:
        return jsonify({'error': f'Encryption Failed: {str(e)}'}), 500

    # 5. Cloudinary Upload
    try:
        # We upload the 'ciphertext' (encrypted data), not the original file
        response = cloudinary.uploader.upload(
            ciphertext, 
            resource_type="raw", 
            public_id=f"encrypted/{request.user_uid}/{file.filename}.enc"
        )
        cloud_url = response['secure_url']
    except Exception as e:
        return jsonify({'error': f'Cloud Upload Failed: {str(e)}'}), 500

    # 6. Save Metadata & Keys to MongoDB
    metadata = {
        'filename': file.filename,
        'cloud_url': cloud_url,
        'user_id': request.user_uid,
        'file_size': file_size,
        'timestamp': datetime.now(),
        'encryption_details': {
            'key': session_key.hex(),
            'nonce': nonce.hex(),
            'tag': tag.hex()
        }
    }
    
    files_collection.insert_one(metadata)
    
    return jsonify({
        'message': 'File Encrypted & Saved Successfully!', 
        'cloud_url': cloud_url,
        'used_space_bytes': used_space + file_size
    })

@app.route('/files', methods=['GET'])
@token_required
def get_files():
    try:
        user_files = files_collection.find({'user_id': request.user_uid})
        file_list = []
        for f in user_files:
            ts = f.get('timestamp', 'Unknown')
            if hasattr(ts, 'strftime'):
                ts = ts.strftime("%Y-%m-%d %H:%M:%S")
            file_list.append({'filename': f['filename'], 'timestamp': ts})
            
        return jsonify({'files': file_list}), 200
    except Exception as e:
        return jsonify({'error': 'Could not fetch files'}), 500

@app.route('/download/<filename>', methods=['GET'])
@token_required
def download_file(filename):
    file_doc = files_collection.find_one({'filename': filename, 'user_id': request.user_uid})
    if not file_doc:
        return jsonify({'error': 'File not found'}), 404

    enc_details = file_doc['encryption_details']
    key = bytes.fromhex(enc_details['key'])
    nonce = bytes.fromhex(enc_details['nonce'])
    tag = bytes.fromhex(enc_details['tag'])
    cloud_url = file_doc['cloud_url']

    response = requests.get(cloud_url)
    encrypted_data = response.content

    try:
        decrypted_data = crypto_utils.decrypt_data(nonce, encrypted_data, tag, key)
        if decrypted_data is None:
            raise ValueError("Integrity Check Failed")
    except Exception as e:
        return jsonify({'error': 'Decryption failed!'}), 400

    return send_file(io.BytesIO(decrypted_data), as_attachment=True, download_name=filename, mimetype='application/octet-stream')

@app.route('/delete/<filename>', methods=['DELETE'])
@token_required
def delete_file(filename):
    try:

        file_doc = files_collection.find_one({'filename': filename, 'user_id': request.user_uid})
        if not file_doc:
            return jsonify({'error': 'File not found or unauthorized'}), 404

        public_id = f"encrypted/{request.user_uid}/{filename}.enc"
        cloudinary.uploader.destroy(public_id, resource_type="raw")

        files_collection.delete_one({'_id': file_doc['_id']})

        return jsonify({'message': 'File securely destroyed from all servers'}), 200

    except Exception as e:
        print(f"Destruction Error: {e}")
        return jsonify({'error': 'Failed to completely delete the file'}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)