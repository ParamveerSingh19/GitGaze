# GitGaze 🔎

A sleek GitHub profile explorer built with **HTML, CSS, and Vanilla JavaScript**. GitGaze lets you search any GitHub username and instantly view a beautifully designed profile card with profile details, repository insights, and developer-friendly visuals powered by the GitHub REST API.

---

## ✨ Features

- 🔍 **Instant GitHub Profile Search** using the GitHub REST API.
- 🎨 **Modern Developer UI** featuring glassmorphism, animated gradients, and Git-inspired aesthetics.
- ⚡ **Parallel API Requests** to fetch profile and repository data simultaneously for faster loading.
- 🛑 **Request Cancellation & Timeout** using `AbortController` with a 10-second timeout.
- 🚫 **Duplicate Search Protection** prevents multiple requests while one is already running.
- ⌨️ **Typing Animation** with skeleton loaders for a polished loading experience.
- 📊 **Animated Statistics** for Followers, Following, Repositories, and Gists.
- 📦 **Top 5 Repositories** sorted by star count while excluding forked repositories.
- 🌈 **Dynamic Accent Theme** based on the user's most-used programming language.
- 🎯 **Repository Language Indicators** with unique language colors.
- 🔗 **Quick Actions** to open the GitHub profile or personal website.
- ⚠️ **Graceful Error Handling** for invalid usernames, rate limits, network failures, and request timeouts.
- ✨ **Smooth Animations** with automatic reduced-motion support.
- 📱 **Fully Responsive** across desktop, tablet, and mobile devices.
- ♿ **Accessible Design** with keyboard navigation, ARIA labels, and semantic HTML.

---

## 🌐 Live Demo

🚀 **Try GitGaze**

👉 [https://gitgaze.netlify.app/](https://gitgaze.netlify.app/)

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- GitHub REST API
- Google Fonts (Manrope & Martian Mono)

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/ParamveerSingh19/gitgaze.git
```

### Navigate to the project

```bash
cd gitgaze
```

### Run the project

Simply open **index.html** in your browser.

---

## 📌 How It Works

1. Enter a GitHub username.
2. GitGaze fetches profile and repository data in parallel.
3. The application displays:
   - 👤 Profile information
   - 📊 Followers, Following, Public Repositories & Gists
   - ⭐ Top 5 starred repositories
   - 💻 Most-used programming language
   - 📍 Location, Company & Join Year
   - 🔗 GitHub profile and personal website

---

## ⚠️ GitHub API Rate Limit

GitGaze uses GitHub's public unauthenticated REST API.

> **Rate Limit:** 60 requests per hour per IP address.

If the limit is exceeded, GitGaze displays a friendly error message and you can try again after the limit resets.

---

## 📁 Project Structure

```text
GitGaze
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 👨‍💻 Author

Made by [Paramveer Singh](https://github.com/ParamveerSingh19)

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
