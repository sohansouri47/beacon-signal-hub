# 🔔 Beacon – Frontend Microservice

A React + TailwindCSS frontend for emergency communication, designed to work with the Beacon ecosystem. This is a simple microservice with a login, signup and chat interface pages.
Supports both text and voice communication.



## ✨ Features

* **AI-powered chat interface** for emergency communication
* **Voice Chat** with Websockets
* **Secure authentication** with Descope SDK
* **Auto-logout** when session expires (via Descope)



## 🛠 Tech Stack

* React 18 + TypeScript
* Vite
* TailwindCSS
* Descope React SDK
* shadcn/ui components
* WebSockets for voice



## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Descope account (Project ID)

### Setup

```bash
# Clone repo and switch to development branch
git clone https://github.com/sohansouri47/Beacon.git
cd Beacon/frontend
git checkout development

# Install dependencies
npm install

# Copy env file
cp .env.example .env
```

Update `.env` with your config:

```env
VITE_DESCOPE_PROJECT_ID=your-descope-project-id
VITE_APP_BASE_URL=http://localhost:8080
VITE_NODE_ENV=development
VITE_WEBSOCKET_URL=ws://localhost:5001/voice 
VITE_BACKEND_URL=http://localhost:5001
```

Run development server:

```bash
npm run dev
```



## 🔒 Security

* Authentication + auto-logout via Descope
* Voice + emergency data transmitted securely to backend
* Ensure backend CORS settings allow frontend domain


