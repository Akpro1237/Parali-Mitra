# 🚀 ParaliMitra Deployment Guide

This guide explains how to access and deploy your website so farmers and admins can use it from any phone or computer.

---

## 📱 Method 1: Instant Phone Access (Available Right Now!)

Your web server is already running and configured to accept connections from any device on your local Wi-Fi or hotspot.

1. Connect your mobile phone to the **same Wi-Fi or hotspot** as this computer.
2. Open your phone's browser (Chrome, Safari, etc.) and type:
   * **Farmer Website**: `http://172.16.69.15:5000/`
   * **Response Registry**: `http://172.16.69.15:5001/`
3. The website will open immediately with full mobile responsiveness and touch-friendly controls!

---

## ☁️ Method 2: Free Public Cloud Deployment (Render.com / Railway)

To get a permanent public domain (e.g. `https://parali-mitra.onrender.com`) accessible from anywhere across India:

### Option A: Render.com (100% Free)
1. Go to [https://render.com](https://render.com) and create a free account.
2. Click **New +** > **Web Service**.
3. Choose **Deploy existing image** or upload your repository to GitHub and link it.
4. Render will automatically detect the included `Dockerfile` and `render.yaml`.
5. Click **Create Web Service**. Within 2 minutes, you will receive a free public HTTPS URL (`https://your-app.onrender.com`)!

---

## 🖥️ Method 3: Pre-Compiled Production Release (`publish/`)

A production-ready release has already been pre-compiled into:
`C:\Users\iamsu\.gemini\antigravity\scratch\parali-mitra\publish\`

This folder contains the compiled binaries, static web assets, and runtime configurations. You can copy this folder to any Windows Server, AWS EC2, or Azure VM and run:
```cmd
parali-mitra.exe --urls "http://0.0.0.0:80"
```
