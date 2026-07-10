const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dart: "#00B4AB",
    Vue: "#41b883",
    Scala: "#c22d40",
    Elixir: "#6e4a7e",
    Lua: "#000080",
};
const DEFAULT_ACCENT = "#7ee787";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class GitGaze {
    constructor() {
        this.input = document.getElementById("searchInput");
        this.runBtn = document.getElementById("searchBtn");
        this.output = document.getElementById("output");
        this.root = document.documentElement;
        this.lastRequestId = 0;
        this.addEvents();
    }

    addEvents() {
        this.runBtn.addEventListener("click", () => this.handleSearch());
        this.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.handleSearch();
        });
    }

    handleSearch() {
        const username = this.input.value.trim();

        if (!username) {
            this.renderError("Enter a username first — try “octocat”.");
            return;
        }

        this.getProfile(username);
    }


    escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    safeUrl(url) {
        try {
            const parsed = new URL(url, window.location.href);
            if (parsed.protocol === "http:" || parsed.protocol === "https:") {
                return parsed.href;
            }
        } catch (_) { /* fall through */ }
        return null;
    }

    clearOutput() {
        this.output.innerHTML = "";
    }

    setAccent(hex) {
        this.root.style.setProperty("--accent", hex);
        this.root.style.setProperty("--accent-dim", hex + "24");
        this.root.style.setProperty("--accent-glow", hex + "59");
    }

    renderTyping(username) {
        this.clearOutput();
        const line = document.createElement("div");
        line.className = "line";
        line.innerHTML = `<span class="arrow">&gt;</span><span class="typed"></span><span class="cursor"></span>`;
        this.output.appendChild(line);

        const typed = line.querySelector(".typed");
        const text = `fetching profile for ${username}...`;

        if (REDUCED_MOTION) {
            typed.textContent = text;
            return;
        }

        let i = 0;
        const step = () => {
            typed.textContent = text.slice(0, i);
            i++;
            if (i <= text.length) requestAnimationFrame(() => setTimeout(step, 16));
        };
        step();
    }

    renderError(message) {
        this.clearOutput();
        const el = document.createElement("div");
        el.className = "msg msg-error";
        el.textContent = message;
        this.output.appendChild(el);
    }

    renderWarning(message) {
        this.clearOutput();
        const el = document.createElement("div");
        el.className = "msg msg-warning";
        el.textContent = message;
        this.output.appendChild(el);
    }

    renderSkeleton() {
        const wrap = document.createElement("div");
        wrap.className = "skeleton";
        wrap.innerHTML = `
      <div class="sk-avatar"></div>
      <div class="sk-row" style="width:40%"></div>
      <div class="sk-row" style="width:70%"></div>
      <div class="sk-row" style="width:55%"></div>
    `;
        this.output.appendChild(wrap);
    }

    animateCount(el, target) {
        if (REDUCED_MOTION || target === 0) {
            el.textContent = target.toLocaleString();
            return;
        }
        const duration = 600;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }


    async getProfile(username) {
        const requestId = ++this.lastRequestId;
        this.runBtn.disabled = true;
        this.renderTyping(username);
        this.renderSkeleton();

        try {
            const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

            if (requestId !== this.lastRequestId) return;

            if (!res.ok) {
                if (res.status === 403) {
                    this.renderWarning("Rate limit hit. The public GitHub API allows 60 requests/hour — try again shortly.");
                } else if (res.status === 404) {
                    this.renderError(`No account found for “${username}”.`);
                } else {
                    this.renderError(`GitHub API returned an error (${res.status}). Try again later.`);
                }
                return;
            }

            const data = await res.json();
            if (requestId !== this.lastRequestId) return;


            let repos = [];
            try {
                const repoRes = await fetch(
                    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
                );
                if (repoRes.ok) repos = await repoRes.json();
            } catch (_) { /* non-fatal */ }

            if (requestId !== this.lastRequestId) return;

            this.renderProfile(data, repos);
        } catch (error) {
            if (requestId !== this.lastRequestId) return;
            console.error(error);
            this.renderError("Network error — check your connection and try again.");
        } finally {
            if (requestId === this.lastRequestId) this.runBtn.disabled = false;
        }
    }

    topLanguage(repos) {
        const counts = {};
        for (const repo of repos) {
            if (!repo.language) continue;
            counts[repo.language] = (counts[repo.language] || 0) + 1;
        }
        let best = null;
        let bestCount = 0;
        for (const [lang, count] of Object.entries(counts)) {
            if (count > bestCount) {
                best = lang;
                bestCount = count;
            }
        }
        return best;
    }

    renderProfile(data, repos) {
        const lang = this.topLanguage(repos);
        const accent = (lang && LANGUAGE_COLORS[lang]) || DEFAULT_ACCENT;
        this.setAccent(accent);

        const topRepos = [...repos]
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);

        this.clearOutput();

        const card = document.createElement("div");
        card.className = "card";

        const safeBlog = data.blog ? this.safeUrl(data.blog) : null;
        const safeProfile = this.safeUrl(data.html_url) || `https://github.com/${encodeURIComponent(data.login)}`;

        card.innerHTML = `
      <div class="card-top">
        <img class="avatar" src="${this.escapeHtml(data.avatar_url)}" alt="${this.escapeHtml(data.login)}'s avatar" width="64" height="64" loading="lazy" />
        <div class="identity">
          <p class="name">${this.escapeHtml(data.name || data.login)}</p>
          <p class="login">@${this.escapeHtml(data.login)}${lang ? ` &middot; mostly ${this.escapeHtml(lang)}` : ""}</p>
          ${data.bio ? `<p class="bio">${this.escapeHtml(data.bio)}</p>` : ""}
        </div>
      </div>

      <div class="meta">
        <span>${this.iconPin()} ${this.escapeHtml(data.location || "Unknown")}</span>
        <span>${this.iconBuilding()} ${this.escapeHtml(data.company || "Not specified")}</span>
        <span>${this.iconCalendar()} joined ${new Date(data.created_at).getFullYear()}</span>
      </div>

      <div class="stats">
        ${this.statBlock("followers", data.followers)}
        ${this.statBlock("following", data.following)}
        ${this.statBlock("repos", data.public_repos)}
        ${this.statBlock("gists", data.public_gists)}
      </div>

      ${topRepos.length ? `
        <div class="repos">
          <div class="repos-head">top repositories</div>
          ${topRepos.map((r) => this.repoRow(r)).join("")}
        </div>
      ` : ""}

      <div class="actions">
        ${safeBlog ? `<a class="action" href="${safeBlog}" target="_blank" rel="noopener noreferrer">visit website</a>` : ""}
        <a class="action action-primary" href="${safeProfile}" target="_blank" rel="noopener noreferrer">view on github</a>
      </div>
    `;

        this.output.appendChild(card);

        card.querySelectorAll(".stat-num").forEach((el) => {
            const target = Number(el.dataset.target || 0);
            this.animateCount(el, target);
        });
    }

    statBlock(label, value) {
        const safeValue = Number.isFinite(value) ? value : 0;
        return `
      <div class="stat">
        <div class="stat-num" data-target="${safeValue}">0</div>
        <div class="stat-label">${label}</div>
      </div>
    `;
    }

    repoRow(repo) {
        const color = (repo.language && LANGUAGE_COLORS[repo.language]) || "#4a525d";
        const url = this.safeUrl(repo.html_url) || "#";
        return `
      <div class="repo-row">
        <span class="repo-lang-dot" style="background:${color}"></span>
        <a class="repo-name" href="${url}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(repo.name)}</a>
        <span class="repo-stars">${this.iconStar()} ${repo.stargazers_count.toLocaleString()}</span>
      </div>
    `;
    }


    iconPin() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
    }
    iconBuilding() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>`;
    }
    iconCalendar() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`;
    }
    iconStar() {
        return `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
    }
}

new GitGaze();