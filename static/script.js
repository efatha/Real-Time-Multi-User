// Fetch posts
function loadPosts() {
    fetch("/posts")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("posts");
        container.innerHTML = "";
        data.forEach(post => {
            container.innerHTML += `
                <div>
                    <b>${post.username}</b>: 
                    <h4>${post.title}</h4>
                    <p>${post.content}</p>
                    <hr>
                </div>
            `;
        });
    });
}
// Add post
function addPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    fetch("/add_post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
    .then(() => {
        loadPosts(); // refresh posts
    });
}
// Auto-refresh every 2 seconds (like chat)
setInterval(loadPosts, 2000);
// Initial load
loadPosts();