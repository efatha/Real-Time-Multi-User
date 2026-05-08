// Fetch posts
function loadPosts() {
    fetch("/posts")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("posts");
        if (container) {
            container.innerHTML = "";
            if (!data.length) {
                container.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <p class="mb-2">No posts yet.</p>
                        <p class="small">Publish the first message to see the feed update live.</p>
                    </div>
                `;
                return;
            }
            data.forEach(post => {
                container.innerHTML += `
                    <div class="message-bubble">
                        <div class="meta">${post.username}</div>
                        <h5 class="fw-semibold text-white mb-2">${post.title}</h5>
                        <p class="mb-0 text-muted">${post.content}</p>
                    </div>
                `;
            });
            container.scrollTop = container.scrollHeight;
        }
    })
    .catch(error => {
        console.error("Unable to load posts:", error);
    });
}

// Add post
function addPost(event) {
    event.preventDefault();
    const titleEl = document.getElementById("title");
    const contentEl = document.getElementById("content");
    const title = titleEl.value.trim();
    const content = contentEl.value.trim();

    if (!title || !content) {
        return;
    }

    fetch("/add_post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
    .then(() => {
        titleEl.value = "";
        contentEl.value = "";
        loadPosts();
    })
    .catch(error => {
        console.error("Unable to send post:", error);
    });
}

// Auto-refresh every 2 seconds (like chat) - only if posts element exists
if (document.getElementById("posts")) {
    setInterval(loadPosts, 2000);
    loadPosts();
}