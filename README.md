🛡️ NeuroLock

A Next-Gen Secure Bank Locker Operation System

NeuroLock is a multi-layered, biometric-driven security system for bank locker operations. It integrates face recognition (liveness + authentication), OTP verification, and PIN entry into a 3-layer protection model. Built with modern web and AI technologies, NeuroLock ensures maximum security, scalability, and user trust.

🚀 Features

Three-Layer Security System

Face Authentication – Detects and verifies the user with Mediapipe BlazeFace (liveness) and DeepFace (identity authentication).

OTP Verification – Secure OTP sent to registered mobile/email.

PIN Entry – Final layer of security before locker access.

Biometric Liveness Detection – Prevents spoofing with photos or videos.

Fast, Real-time Recognition with FastAPI + BlazeFace + DeepFace.

Modern UI/UX – Developed using React + Vite for speed and seamless user experience.

Scalable Architecture – Easy to extend for multiple branches, users, and locker types.

Bank-Grade Security – Secure token handling, JWT authentication, encrypted data flow.

🏗️ Tech Stack

Frontend:
React + Vite ⚡
TailwindCSS (optional, for styling)
Axios (API communication)

Backend:
FastAPI (Python)
Mediapipe BlazeFace (Face detection + liveness check)
DeepFace (Face recognition & authentication)
PyJWT (Token management)
MySQL (user + locker data storage)

Other Tools:
Docker (deployment)

Nginx (reverse proxy)

🏛️ System Workflow
1. User uploads or captures face image  
2. AI model validates identity  
3. OTP sent to registered contact  
4. Upon verification, JWT token is issued  
5. User accesses secure locker operations 
