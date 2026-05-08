// Fetch posts
function loadPosts() {
    fetch("/posts")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("posts");
        if (container) {
            const wasNearBottom = isNearBottom(container);
            container.innerHTML = "";
            if (!data.length) {
                container.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <p class="mb-2">No posts yet.</p>
                        <p class="small">Publish the first message to see the feed update live.</p>
                    </div>
                `;
                updateScrollButton(container);
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
            if (autoScrollEnabled || wasNearBottom) {
                scrollToBottom(container);
            }
            updateScrollButton(container);
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

const postsContainer = document.getElementById("posts");
const scrollButton = document.getElementById("scrollDownButton");
let autoScrollEnabled = true;
let scrollDownTimer = null;
const SCROLL_THRESHOLD = 80;

function scrollToBottom(container) {
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

function isNearBottom(container) {
    if (!container) return true;
    const distanceFromBottom = container.scrollHeight - container.clientHeight - container.scrollTop;
    return distanceFromBottom <= SCROLL_THRESHOLD;
}

function updateScrollButton(container) {
    if (!scrollButton || !container) return;
    if (isNearBottom(container)) {
        scrollButton.classList.remove('show');
    } else {
        scrollButton.classList.add('show');
    }
}

if (postsContainer) {
    postsContainer.addEventListener("mouseenter", () => {
        autoScrollEnabled = false;
        if (scrollDownTimer) {
            clearTimeout(scrollDownTimer);
            scrollDownTimer = null;
        }
    });

    postsContainer.addEventListener("mouseleave", () => {
        if (scrollDownTimer) {
            clearTimeout(scrollDownTimer);
        }
        scrollDownTimer = setTimeout(() => {
            if (!isNearBottom(postsContainer)) {
                scrollToBottom(postsContainer);
            }
            autoScrollEnabled = true;
            updateScrollButton(postsContainer);
        }, 5000);
    });

    postsContainer.addEventListener("scroll", () => {
        const distanceFromBottom = postsContainer.scrollHeight - postsContainer.clientHeight - postsContainer.scrollTop;
        autoScrollEnabled = distanceFromBottom <= SCROLL_THRESHOLD;
        updateScrollButton(postsContainer);
    });
}

if (scrollButton) {
    scrollButton.addEventListener('click', () => {
        if (!postsContainer) return;
        scrollToBottom(postsContainer);
        autoScrollEnabled = true;
        updateScrollButton(postsContainer);
    });
}

// Auto-refresh every 2 seconds (like chat) - only if posts element exists
if (postsContainer) {
    setInterval(loadPosts, 2000);
    loadPosts();
}