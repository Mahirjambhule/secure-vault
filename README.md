https://secure-vault-psi-eight.vercel.app/

# SecureVault — Zero-Knowledge Cloud Storage Ecosystem

SecureVault is a high-security cloud storage platform built on a **Zero-Trust Architecture**. Unlike traditional cloud services, SecureVault moves the security perimeter to the client-side, ensuring that sensitive files are encrypted locally before transmission. This ensures that even the storage provider (Cloudinary) and the database (MongoDB) remain "blind" to the user's data content.

## 🚀 Key Features

- **Client-Side AES-256-GCM Encryption:** Data is transformed into unreadable ciphertext within the browser's RAM using the Web Crypto API.
- **Zero-Knowledge Protocol:** Encryption keys are derived locally and never sent to the backend, ensuring total data sovereignty.
- **Multi-Factor Authentication (MFA):** Secondary identity verification via an out-of-band SMTP relay powered by **Brevo API**.
- **PBKDF2 Key Derivation:** Strengthens user passphrases through salted iterations, protecting against offline brute-force attacks.
- **Hybrid MERN-Flask Architecture:** Combines the flexibility of React with the robust security modules of Python/Flask.
- **Decoupled Storage Model:** Separates encrypted binary blobs in **Cloudinary** from metadata pointers in **MongoDB Atlas**.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios, Web Crypto API
- **Backend:** Python, Flask, Flask-Bcrypt, JWT
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary (BLOB Vault)
- **MFA:** Brevo API

## 🏗️ Architecture Overview

The system operates on three distinct layers:
1. **Client Layer:** Handles local file processing, AES-256 encryption, and key derivation via PBKDF2.
2. **Logic Layer (Flask):** Orchestrates authentication handshakes, MFA verification, and secure routing.
3. **Data Layer:** Maintains a strict separation between metadata (MongoDB) and encrypted blobs (Cloudinary).

