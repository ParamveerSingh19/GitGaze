# GitGaze 🔎

A terminal-styled, theme-aware GitHub profile lookup tool built using HTML, CSS, and vanilla JavaScript. GitGaze lets you search any GitHub username and instantly see a clean, animated profile card with stats, top repositories, and quick links — all wrapped in a fast, techy interface.

---

## 🚀 Features

- 🔍 **Instant Profile Lookup:** Search any GitHub username and fetch live data from the public GitHub API.
- 🖥️ **Terminal-Styled UI:** A window-style search bar with colored status dots and a typewriter-style loading animation.
- 🎨 **Dynamic Accent Color:** The interface accent color automatically shifts based on the user's most-used programming language.
- 📊 **Profile Stats:** Followers, following, public repos, and gists, shown with animated count-up numbers.
- 📦 **Top Repositories:** Displays the top 5 non-forked repos sorted by stars, each tagged with its language color.
- 🔗 **Quick Actions:** One-click buttons to visit the user's website or GitHub profile.
- ⚡ **Optimized Requests:** Profile and repository data are fetched in parallel, with request cancellation and a 10-second timeout to prevent stuck or stale loads.
- 🚫 **Duplicate Request Guard:** Prevents overlapping searches from rapid clicks or repeated Enter presses.
- ⚠️ **Graceful Error Handling:** Clear messages for invalid usernames, rate limits, network errors, and timeouts.
- 🌌 **Animated Background:** A subtle, techy animated star and grid background with reduced-motion support.
- 📱 **Fully Responsive Design:** Optimized for both mobile and desktop.

---

## 🌐 Live Demo

Experience GitGaze in action! Visit the deployed project here:
➡️ **[https://gitgaze.netlify.app/](https://gitgaze.netlify.app/)**

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- [GitHub REST API](https://docs.github.com/en/rest) (for profile and repo data)
- [Google Fonts](https://fonts.google.com) — JetBrains Mono & Inter

---

## 📂 How to Use

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ParamveerSingh19/gitgaze.git
    ```

2. **Navigate into the project folder**:

    ```bash
    cd gitgaze
    ```

3. **Open `index.html` in your browser** to launch the application.

> **Note:** GitGaze uses the public, unauthenticated GitHub API, which is limited to 60 requests per hour per IP address.

---

## 👨‍💻 Author

Made by [Paramveer Singh](https://github.com/ParamveerSingh19)

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
