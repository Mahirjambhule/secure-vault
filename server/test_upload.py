# test_upload.py
import requests

# 1. Create a dummy secret file
with open("secret_plans.txt", "w") as f:
    f.write("CONFIDENTIAL: The Zero Trust project is a success!")

# 2. Define the target (Localhost)
url = 'http://127.0.0.1:5000/upload'

# 3. Attach the file
files = {'file': open('secret_plans.txt', 'rb')}

# 4. Add the "Dev Token" (Bypasses login for testing)
headers = {'Authorization': 'Bearer dev-token-123'}

print("Sending file to Secure Cloud...")
try:
    response = requests.post(url, files=files, headers=headers)
    print("\n--- SERVER RESPONSE ---")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")