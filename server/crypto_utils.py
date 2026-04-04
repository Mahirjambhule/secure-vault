# crypto_utils.py
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# AES-256 requires a 32-byte key (256 bits)
KEY_SIZE = 32

def generate_key():
    """Generates a random 32-byte session key."""
    return get_random_bytes(KEY_SIZE)

def encrypt_data(data_bytes, key):
    """
    Encrypts data using AES-GCM.
    Returns: (nonce, ciphertext, tag)
    - Nonce: A random start value (like a salt) required for decryption.
    - Ciphertext: The encrypted data.
    - Tag: A security stamp to verify the data wasn't tampered with.
    """
    cipher = AES.new(key, AES.MODE_GCM) # Initialize cipher
    ciphertext, tag = cipher.encrypt_and_digest(data_bytes) # Encrypt
    
    return cipher.nonce, ciphertext, tag

def decrypt_data(nonce, ciphertext, tag, key):
    """
    Decrypts data using AES-GCM.
    Returns the original data if successful, or raises an error if tampered.
    """
    try:
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        data = cipher.decrypt_and_verify(ciphertext, tag)
        return data
    except ValueError:
        return None # Decryption failed (Wrong key or corrupted file)