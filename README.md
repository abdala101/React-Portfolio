# Abdala Farah - Professional Portfolio 🚀

A high-performance, accessible, and AI-powered portfolio website built with modern web technologies. This project showcases a **Hybrid AI Architecture** that leverages Google's Gemini API for real-time content generation (polishing contact messages and generating technical insights for projects).

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73C92?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

## ✨ Key Features

-   **🤖 Hybrid AI Integration:**
    -   **Local Development:** Direct client-side calls for rapid prototyping.
    -   **Production:** Secure Serverless Function (`/api/generate`) via Vercel Edge Network to protect API keys.
    -   **Features:** "Auto-Polish" for contact form messages and "Technical Deep Dive" generation for project cards.
-   **⚡ High Performance:** Built on Vite for instant HMR and optimized bundling.
-   **📱 Responsive & Accessible:** Mobile-first design with semantic HTML (`<main>`, `<article>`, `<header>`) and ARIA labels.
-   **🖼️ Dynamic Open Graph:** Serverless image generation (`@vercel/og`) creates unique social media preview cards on the fly.
-   **🎨 Glassmorphism UI:** Custom Tailwind CSS configuration for modern frosted-glass effects.

## 🛠️ Architecture

### AI Service Layer
The application uses a smart `AIService` that detects the environment:
1.  **Localhost:** Uses `import.meta.env.VITE_GEMINI_API_KEY` to call Google Gemini directly.
2.  **Production:** Proxies requests through a Node.js serverless function (`api/generate.js`) which holds the `GEMINI_API_KEY` securely on the server.

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/abdala101/React-Portfolio.git](https://github.com/abdala101/React-Portfolio.git)
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Required for Local AI Testing
    VITE_GEMINI_API_KEY=your_google_gemini_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is optimized for **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add the Environment Variable in Vercel Dashboard:
    -   Key: `GEMINI_API_KEY` (Note: No `VITE_` prefix for server variables)
    -   Value: `your_google_gemini_key_here`

## 📂 Project Structure

```text
├── api/                # Serverless Functions (Backend)
│   ├── generate.js     # Secure AI Proxy (Hides API Key)
│   └── og.jsx          # Dynamic Social Image Generator
├── public/             # Static Assets
│   └── Abdala_Farah_Resume.pdf
├── src/
│   └── App.jsx         # Core Application (UI Components & Client Logic)
├── .env                # Local Environment Variables (Git Ignored)
└── README.md           # Documentation