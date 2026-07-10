class GetGithubProfileFinder {
    constructor() {
        this.searchBtn = document.getElementById("searchBtn");
        this.searchInput = document.getElementById("searchInput");
        this.Skeleton = document.getElementById("Skeleton");
        this.profileContainer = document.getElementById("profileContainer");
        this.addEvents();
    }

    addEvents() {
        this.searchBtn.addEventListener("click", () => this.handleSearch());

        // Allow pressing Enter to trigger search
        this.searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        let userNameValue = this.searchInput.value.trim();

        if (userNameValue.length === 0) {
            alert("Please enter valid username!");
            return;
        }

        this.getProfile(userNameValue);
        this.searchInput.value = "";
    }

    async getProfile(userNameValue) {
        try {
            // Prevent duplicate/overlapping requests while one is in flight
            this.searchBtn.disabled = true;
            this.Skeleton.style.display = "block";
            this.profileContainer.innerHTML = "";

            let res = await fetch(`https://api.github.com/users/${userNameValue}`);

            if (!res.ok) {
                this.Skeleton.style.display = "none";

                // Give a clearer message when it's a rate-limit issue vs a real 404
                if (res.status === 403) {
                    this.profileContainer.innerHTML = `
                    <div class="bg-red-500/20 border border-red-500 p-4 rounded-lg text-center mt-5">
                    <p>Rate limit exceeded. Please try again later.</p>
                    </div>
                    `;
                } else {
                    this.profileContainer.innerHTML = `
                    <div class="bg-red-500/20 border border-red-500 p-4 rounded-lg text-center mt-5">
                    <p>User not found!</p>
                    </div>
                    `;
                }
                return;
            }

            let data = await res.json();
            this.Skeleton.style.display = "none";
            this.profileContainer.innerHTML = `
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-center mt-5 p-5">
          <img src="${data.avatar_url}" class="w-24 h-24 rounded-full mx-auto border-4 border-blue-500"/>
          <h2 class="text-xl font-semibold mt-4">
          ${data.name || data.login}</h2>

          <p class="text-gray-300 text-sm mt-1">
          ${data.bio || "No bio available!"}</p>

          <div class="text-sm text-gray-400 mt-3 flex justify-center gap-5">
          <p>
          <i class="fa-solid fa-location-dot"></i>
          ${data.location || "Unknown"}</p>

          <p>
          <i class="fa-solid fa-building"></i>
          ${data.company || "Not specified"}</p>

          <p>
          <i class="fa-solid fa-calendar"></i>
          joined ${new Date(data.created_at).getFullYear()}</p>
          </div>

          <div class="flex justify-between mt-6 text-sm">

          <div>
          <p class="font-bold text-lg">
          ${data.followers}
          </p>
          <p class="text-gray-500">
          Followers
          </p>
          </div>

          <div>
          <p class="font-bold text-lg">
          ${data.following}
          </p>
          <p class="text-gray-500">
          Following
          </p>
          </div>
          <div>
          <p class="font-bold text-lg">
          ${data.public_repos}
          </p>
          <p class="text-gray-500">
          Repos
          </p>
          </div>
           <div>
          <p class="font-bold text-lg">
          ${data.public_gists}
          </p>
          <p class="text-gray-500">
          Gists
          </p>
          </div>
          </div>
${data.blog ? `
    <a href="${data.blog}" target="_blank" class="block mt-6 bg-purple-500 py-2 rounded-lg hover:bg-purple-600 transition">
    Visit Website
    </a>
    ` : ""
                }

                <a href="${data.html_url}" target="_blank" class="block mt-6 bg-green-500 py-2 rounded-lg hover:bg-green-600 transition">
View GitHub Profile
    </a>
          </div>
          `;
        } catch (error) {
            console.log(error);

            this.Skeleton.style.display = "none";
            this.profileContainer.innerHTML = `
           <div class="bg-red-500/20 border border-red-400 p-5 rounded-xl text-center mt-5">
<p>
Something went wrong! Please try again later.
</p>
           </div>
           `;
        } finally {
            this.searchBtn.disabled = false;
        }
    }
}

// Initialized the class
new GetGithubProfileFinder();