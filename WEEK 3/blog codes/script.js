// Default admin credentials
const ADMIN = { username: "admin", password: "1234" };

// Fetch all posts from localStorage
function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

// Save posts to localStorage
function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// CREATE post
function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const published = document.getElementById("post-published").checked;

  if (!title || !content) {
    alert("Please enter title and content!");
    return;
  }

  const posts = getPosts();
  const newPost = {
    id: Date.now(),
    title,
    content,
    published,
    createdAt: new Date().toLocaleString(),
  };
  posts.push(newPost);
  savePosts(posts);

  alert("Post created successfully!");
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("post-published").checked = false;

  displayAdminPosts();
  displayPublishedPosts();
}

// READ (Public view)
function displayPublishedPosts() {
  const posts = getPosts().filter(post => post.published);
  const container = document.getElementById("blog-container");
  container.innerHTML = "";

  if (posts.length === 0) {
    container.innerHTML = "<p>No published posts yet.</p>";
    return;
  }

  posts.forEach(post => {
    container.innerHTML += `
      <div class="post">
        <div class="post-title">${post.title}</div>
        <p>${post.content.substring(0, 100)}...</p>
        <a href="post.html?id=${post.id}">Read More</a>
      </div>
    `;
  });
}

// READ (Single post page)
function displaySinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get("id"));
  const post = getPosts().find(p => p.id === postId);

  const container = document.getElementById("single-post");
  if (!post) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${post.title}</h2>
    <p><em>Created at: ${post.createdAt}</em></p>
    <p>${post.content}</p>
  `;
}

// READ (Admin dashboard list)
function displayAdminPosts() {
  const posts = getPosts();
  const container = document.getElementById("admin-posts");
  if (!container) return;

  container.innerHTML = posts
    .map(
      post => `
      <div class="post">
        <div class="post-title">${post.title} ${post.published ? "(Published)" : "(Draft)"}</div>
        <p>${post.content.substring(0, 50)}...</p>
        <button onclick="togglePublish(${post.id})">
          ${post.published ? "Unpublish" : "Publish"}
        </button>
        <button onclick="deletePost(${post.id})">Delete</button>
      </div>
    `
    )
    .join("");
}

// UPDATE (Toggle publish)
function togglePublish(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  post.published = !post.published;
  savePosts(posts);
  displayAdminPosts();
  displayPublishedPosts();
}

// DELETE post
function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id);
  savePosts(posts);
  displayAdminPosts();
  displayPublishedPosts();
}

// ADMIN LOGIN
function adminLogin() {
  const username = document.getElementById("admin-username").value;
  const password = document.getElementById("admin-password").value;
  const errorMsg = document.getElementById("login-error");

  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem("isAdminLoggedIn", "true");
    window.location.reload();
  } else {
    errorMsg.textContent = "Invalid credentials!";
  }
}

function checkLogin() {
  const loggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  if (loggedIn) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  }
}
