async function createUser() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;

    const response = await fetch('/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    });

    if (response.ok) {
        alert('Usuario creado exitosamente');
    } else {
        alert('Error al crear el usuario');
    }
}

async function createPost() {
    const userName = document.getElementById('post-user-name').value;
    const content = document.getElementById('post-content').value;

    const response = await fetch('/create-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, content })
    });

    if (response.ok) {
        alert('Publicación creada exitosamente');
        loadPosts();
    } else {
        alert('Error al crear la publicación');
    }
}

async function loadPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();

    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `<strong>${post.user}</strong><p>${post.content}</p><small>${post.date}</small>`;
        postsList.appendChild(postElement);
    });
}

// Cargar publicaciones al cargar la página
window.onload = loadPosts;
