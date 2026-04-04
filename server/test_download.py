# test_download.py
import requests

# 1. The filename we uploaded earlier
target_filename = "secret_plans.txt"
url = f'http://127.0.0.1:5000/download/{target_filename}'

# 2. The Dev Token
headers = {'Authorization': 'Bearer dev-token-123'}

print(f"Requesting {target_filename}...")
response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("\n--- SUCCESS! File Decrypted ---")
    print("Content received from server:")
    print("--------------------------------")
    print(response.text)  # This should be READABLE text!
    print("--------------------------------")
else:
    print("Error:", response.json())