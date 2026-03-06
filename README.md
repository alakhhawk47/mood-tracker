# EmoGraph – Mood Tracking Platform

EmoGraph is a modern web-based mood tracking platform that helps users log, visualize, and analyze their emotional patterns over time. The goal of EmoGraph is to promote self-awareness and mental well-being by providing insights into daily mood trends.

## 🌐 Live Demo

👉 https://mood-tracker-phi-tawny.vercel.app/

## ✨ Features

* 🔐 **Google Authentication** – Secure login using Firebase Authentication
* 📊 **Mood Tracking Dashboard** – Log daily moods and maintain a personal mood history
* 📈 **Trend Insights** – View mood trends to better understand emotional patterns
* 🗑 **Delete & Manage Entries** – Select and remove mood entries easily
* 📱 **Responsive UI** – Optimized for desktop and mobile devices
* ⚡ **Fast Performance** – Built with modern tools for quick load times

## 🛠 Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS

**Backend / Services**

* Firebase Authentication
* Firebase Firestore / Database

**Charts & Visualization**

* Recharts

**Deployment**

* Vercel

## 📂 Project Structure

```
mood-tracker
│
├── public
├── src
│   ├── assets
│   ├── pages
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── Tracker.jsx
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── vercel.json
```

## 🚀 Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/alakhhawk47/mood-tracker.git
```

### 2️⃣ Navigate to the project directory

```
cd mood-tracker
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Run the development server

```
npm run dev
```

The app will run locally at:

```
http://localhost:5173
```

## 🔐 Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📸 Screenshots

*(You can add screenshots of the login page and dashboard here)*

## 🎯 Future Improvements

* AI-based mood insights and recommendations
* Weekly and monthly mood analytics
* Mood streak tracking
* Export mood reports

## 👨‍💻 Author

**Alakh Raj Singh**

* GitHub: https://github.com/alakhhawk47
* Project: EmoGraph – Mood Tracking Platform

## ⭐ Contributing

Contributions, suggestions, and feedback are welcome!
Feel free to open an issue or submit a pull request.

---

If you like this project, consider giving it a ⭐ on GitHub!
