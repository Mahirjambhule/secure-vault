# test_crypto.py
from crypto_utils import generate_key, encrypt_data, decrypt_data

# 1. Simulate a User Session
print("--- 1. Generating Session Key ---")
session_key = generate_key()
print(f"Session Key (Hex): {session_key.hex()}")

# 2. Simulate File Upload (Encryption)
original_message = b"This is a top secret project file!"
print(f"\nOriginal Message: {original_message}")

print("--- 2. Encrypting Data ---")
nonce, ciphertext, tag = encrypt_data(original_message, session_key)

print(f"Encrypted (Garbage): {ciphertext}")
print(f"Nonce (Needed for decrypt): {nonce.hex()}")
print(f"Tag (Integrity check): {tag.hex()}")

# 3. Simulate File Download (Decryption)
print("\n--- 3. Decrypting Data ---")
decrypted_message = decrypt_data(nonce, ciphertext, tag, session_key)

if decrypted_message:
    print(f"Success! Decrypted Message: {decrypted_message}")
else:
    print("Failed! Integrity check failed or wrong key.")

# 4. Zero Trust Test (Simulate a Hack)
print("\n--- 4. Zero Trust Tamper Test ---")
fake_key = generate_key() # Hacker tries a different key
result = decrypt_data(nonce, ciphertext, tag, fake_key)
if result is None:
    print("Security Alert: Decryption failed as expected with wrong key!")