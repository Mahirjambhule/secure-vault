# --- 1. Core Flask & System ---
import os
import io
import re
import random
import certifi
from datetime import datetime, timedelta, timezone
from functools import wraps
from dotenv import load_dotenv
from flask_cors import cross_origin

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# --- 2. Database & Security ---
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

# --- 3. JWT Authentication ---
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, 
    get_jwt_identity, verify_jwt_in_request
)

# --- 4. Rate Limiting ---
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# --- 5. External Services ---
import requests
import cloudinary
import cloudinary.uploader
import resend

import crypto_utils 

load_dotenv()

load_dotenv()
app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "MAHIR_JAMBHULE_SECURE_VAULT_2026_LONG_KEY")
jwt = JWTManager(app)

# --- CORS CONFIGURATION ---
CORS(app, resources={r"/*": {
    "origins": [
    "https://secure-vault-psi-eight.vercel.app",
    "https://secure-vault-psi-eight.vercel.app/",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
],
    "methods": ["GET", "POST", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "expose_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

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
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", "super-secret-zero-trust-key-2026")

# --- CLOUDINARY CONFIG ---
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)

resend.api_key = os.getenv("RESEND_API_KEY")

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


# 1. THE EMAIL SENDER (Using new Brevo Key)
def send_secure_email(receiver_email, otp, title="Verification Code"):
    """
    Universal Email Sender for SecureVault
    title: Can be 'Security Code', 'Reset OTP', or 'Account Verification'
    """
    BREVO_API_KEY = os.getenv("BREVO_API_KEY")
    url = "https://api.brevo.com/v3/smtp/email"
    
    payload = {
        "sender": {"name": "SecureVault Support", "email": "mahirjambhule92@gmail.com"},
        "to": [{"email": receiver_email}],
        "subject": f"🔐 {title}: {otp}",
        "htmlContent": f"""
            <div style="background-color: #f8fafc; padding: 40px; font-family: sans-serif;">
                <div style="max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <div style="background-color: #1e293b; padding: 25px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 2px; font-weight: 800;">SECUREVAULT</h2>
                    </div>
                    
                    <div style="padding: 35px; text-align: center;">
                        <h3 style="color: #1e293b; margin-top: 0;">{title}</h3>
                        <p style="color: #64748b; font-size: 15px; margin-bottom: 25px;">Please use the following code to verify your identity. This code is strictly confidential.</p>
                        
                        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px 10px; border: 2px dashed #cbd5e1; margin-bottom: 25px; text-align: center;">
                            <span style="font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 8px; font-family: monospace; display: block; white-space: nowrap; width: 100%;">
                                {otp}
                            </span>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                            Valid for <b>10 minutes</b>.<br/>
                            If you did not request this, please secure your account immediately.
                        </p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <span style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">End-to-End Encrypted Verification</span>
                    </div>
                </div>
            </div>
        """
    }
    
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.status_code
    except Exception as e:
        print(f"Email Error: {str(e)}")
        return 500

# 2. THE "FORGOT" FUNCTION (Sends the email)
@app.route('/forgot-password', methods=['POST', 'OPTIONS'])
@cross_origin()
def handle_forgot_request():
    if request.method == 'OPTIONS': return jsonify({'status': 'ok'}), 200
    
    data = request.get_json()
    email = data.get('email')
    
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    otp = str(random.randint(100000, 999999))
    users_collection.update_one({"email": email}, {"$set": {"otp": otp}})
    
    if send_secure_email(email, otp, title="Password Reset") in [200, 201]:
        return jsonify({"message": "Security code sent!"}), 200
    return jsonify({"error": "Email service failed"}), 500

# 3. THE "RESET" FUNCTION (Updates the DB)
@app.route('/api/reset-password', methods=['POST', 'OPTIONS'])
@cross_origin()
def reset_password():
    if request.method == 'OPTIONS': return jsonify({'status': 'ok'}), 200

    data = request.get_json()
    email, otp_received, new_password = data.get('email'), data.get('otp'), data.get('new_password')

    # Re-use your registration strength check!
    if not is_strong_password(new_password):
        return jsonify({
            "error": "Weak Password",
            "message": "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
        }), 400

    user = users_collection.find_one({"email": email})
    if not user or str(user.get('otp')) != str(otp_received):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    # Success: Hash and save
    hashed_pw = generate_password_hash(new_password)
    users_collection.update_one(
        {"email": email}, 
        {"$set": {"password": hashed_pw}, "$unset": {"otp": ""}}
    )
    return jsonify({"message": "Password updated successfully!"}), 200
    

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
            verify_jwt_in_request() 
            request.user_uid = get_jwt_identity()
        except Exception as e:
            print(f"Token Error: {str(e)}")
            return jsonify({'message': 'Token is invalid or expired!'}), 401
            
        return f(*args, **kwargs)
    return decorated

# --- OTP EMAIL SENDER FUNCTION ---
def send_otp_email(receiver_email, otp):
    try:
        r = resend.Emails.send({
            "from": "SecureVault <onboarding@resend.dev>",
            "to": receiver_email,
            "subject": "Your Security Code",
            "html": f"""
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>SecureVault Verification</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #2563eb; letter-spacing: 5px;">{otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            """
        })
        print(f"--- Email Sent via Resend: {r['id']} ---")
        return True
    except Exception as e:
        print(f"--- Resend Error: {e} ---")
        return False

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
    expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    users_collection.update_one(
        {'_id': user['_id']}, 
        {'$set': {'otp': otp, 'otp_expiry': expiry}}
    )

    # Step 3: Send the Stylized Email (Using your new function)
    # This will now use the Dark Header and Blue Code box!
    send_secure_email(email, otp, title="Login Verification")

    # NOTICE: We removed create_access_token from here. 
    # We only return a "success" message so the frontend shows the OTP input.
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

    # OTP Validation
    if 'otp' not in user or user['otp'] != user_otp:
        return jsonify({'error': 'Invalid OTP'}), 401
        
    current_time = datetime.now(timezone.utc)
    expiry_time = user['otp_expiry']
    if expiry_time.tzinfo is None:
        expiry_time = expiry_time.replace(tzinfo=timezone.utc)

    if current_time > expiry_time:
        return jsonify({'error': 'OTP has expired. Please log in again.'}), 401

    # Success! Clear OTP data
    users_collection.update_one({'_id': user['_id']}, {'$unset': {'otp': "", 'otp_expiry': ""}})

    # --- THE FINAL TOKEN ---
    # Now that they have the OTP, we give them the key to the vault
    expires = timedelta(minutes=30)
    token = create_access_token(identity=str(user['email']), expires_delta=expires)

    return jsonify({
        'message': 'Login fully verified!',
        'token': token,
        'email': user['email']
    }), 200


@app.route('/quota', methods=['GET'])
@jwt_required()
def get_quota():
    # Initialize variables to 0 to prevent "UnboundLocalError"
    used_bytes = 0
    file_count = 0
    MAX_BYTES = 52428800 
    
    try:
        identity = get_jwt_identity()
        
        # 1. Flexible filter (Matches ID or Email)
        user_filter = {
            "$or": [
                {"owner": identity},
                {"user_email": identity},
                {"user_id": identity}
            ]
        }

        # 2. Get Count
        file_count = files_collection.count_documents(user_filter)

        # 3. Get Size
        pipeline = [
            {'$match': user_filter},
            {'$group': {
                '_id': None,
                'total_size': {
                    '$sum': { 
                        '$convert': { 
                            'input': '$file_size', 
                            'to': 'double', 
                            'onError': 0, 
                            'onNull': 0 
                        } 
                    }
                }
            }}
        ]
        
        result = list(files_collection.aggregate(pipeline))
        if result and 'total_size' in result[0]:
            used_bytes = int(result[0]['total_size'])

        print(f"--- QUOTA CHECK --- ID: {identity} | Files: {file_count} | Size: {used_bytes}")

        return jsonify({
            'used_bytes': used_bytes,
            'max_bytes': MAX_BYTES,
            'file_count': file_count,
            'status': 'success'
        }), 200

    except Exception as e:
        print(f"QUOTA ERROR: {str(e)}")
        # Return hardcoded 0s so the frontend doesn't see "undefined"
        return jsonify({
            'used_bytes': 0, 
            'max_bytes': 52428800, 
            'file_count': 0,
            'status': 'error'
        }), 200
@app.route('/upload', methods=['POST'])
@jwt_required() # Using standard JWT instead of custom decorator for reliability
def upload_file():
    user_email = get_jwt_identity()

    # 1. Initial File Checks
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # 2. Get File Data and Size
    original_data = file.read()
    file_size = len(original_data)

    # 3. Quota Check (50MB Limit)
    pipeline = [
        {'$match': {'owner': user_email}},
        {'$group': {'_id': None, 'total_size': {'$sum': '$file_size'}}}
    ]
    result = list(files_collection.aggregate(pipeline))
    used_space = result[0]['total_size'] if result else 0
    MAX_QUOTA = 50 * 1024 * 1024 

    if used_space + file_size > MAX_QUOTA:
        return jsonify({'error': 'Storage quota exceeded!'}), 403

    # 4. Encryption Process (AES-256 GCM)
    try:
        session_key = crypto_utils.generate_key()
        nonce, ciphertext, tag = crypto_utils.encrypt_data(original_data, session_key)
    except Exception as e:
        return jsonify({'error': f'Encryption Failed: {str(e)}'}), 500

    # 5. Cloudinary Upload (Saving Ciphertext)
    try:
        # We upload the 'ciphertext' as a raw binary blob
        response = cloudinary.uploader.upload(
            ciphertext, 
            resource_type="raw", 
            # We set a structured path in Cloudinary
            public_id=f"vault/{user_email}/{file.filename}.enc"
        )
        
        cloud_url = response['secure_url']
        # CRITICAL: This is the ID needed for deletion
        actual_public_id = response['public_id'] 

    except Exception as e:
        return jsonify({'error': f'Cloud Upload Failed: {str(e)}'}), 500

    # 6. Save Metadata & Keys to MongoDB
    metadata = {
        'filename': file.filename,
        'cloud_url': cloud_url,
        'public_id': actual_public_id,  
        'owner': user_email,            
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
        'cloud_url': cloud_url
    }), 200

@app.route('/files', methods=['GET'])
@jwt_required() 
def get_files():
    user_email = get_jwt_identity() 
    user_files = files_collection.find({'owner': user_email})
    
    file_list = []
    for f in user_files:
        ts = f.get('timestamp', 'Unknown')
        if hasattr(ts, 'strftime'):
            ts = ts.strftime("%Y-%m-%d %H:%M:%S")
        
        file_list.append({
            '_id': str(f['_id']),
            'filename': f['filename'], 
            'timestamp': ts
        })
    return jsonify({'files': file_list}), 200
    
    
@app.route('/download/<filename>', methods=['GET'])
@jwt_required()
def download_file(filename):
    try:
        user_email = get_jwt_identity()
        
        # 1. Find the file in MongoDB
        file_data = files_collection.find_one({
            'filename': filename, 
            'owner': user_email
        })

        if not file_data:
            return jsonify({'error': 'File not found'}), 404

        # 2. Get the encrypted file from Cloudinary
        cloud_url = file_data['cloud_url']
        cloud_response = requests.get(cloud_url) 
        
        if cloud_response.status_code != 200:
            return jsonify({'error': 'Could not fetch from cloud'}), 500

        encrypted_data = cloud_response.content

        # 3. Decrypt the data
        details = file_data['encryption_details']
        key = bytes.fromhex(details['key'])
        nonce = bytes.fromhex(details['nonce'])
        tag = bytes.fromhex(details['tag'])

        decrypted_data = crypto_utils.decrypt_data(nonce, encrypted_data, tag, key)

        # 4. Send back to user
        return send_file(
            io.BytesIO(decrypted_data),
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        print(f"Download Error: {str(e)}")
        return jsonify({'error': 'Decryption failed'}), 500

@app.route('/delete/<file_id>', methods=['DELETE'])
@jwt_required() 
def delete_file(file_id):
    user_email = get_jwt_identity() # Gets the email from the JWT
    
    print(f"--- Attempting Delete for ID: {file_id} by User: {user_email} ---")

    try:
        # 1. Convert string ID to MongoDB ObjectId
        obj_id = ObjectId(file_id)
        
        # 2. Find the file. Match 'owner' because that's what /upload saves
        file_data = files_collection.find_one({
            "_id": obj_id, 
            "owner": user_email
        })
        
        if not file_data:
            print("--- File Not Found in DB ---")
            return jsonify({"error": "File not found"}), 404

        # 3. Purge from Cloudinary
        public_id = file_data.get('public_id')
        if public_id:
            cloudinary.uploader.destroy(public_id, resource_type="raw")

        # 4. Purge from MongoDB
        files_collection.delete_one({"_id": obj_id})
        
        return jsonify({"message": "File deleted successfully"}), 200

    except Exception as e:
        print(f"--- SERVER ERROR: {str(e)} ---")
        return jsonify({"error": "Internal Server Error"}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)