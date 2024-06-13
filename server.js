const express = require('express');
const neo4j = require('neo4j-driver');

const app = express();
const port = 3000;

// Conectar a Neo4j
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345'));
const session = driver.session();

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Ruta para crear un usuario
app.post('/create-user', async (req, res) => {
    const { name, email } = req.body;
    try {
        await session.run('CREATE (u:User {name: $name, email: $email}) RETURN u', { name, email });
        res.status(200).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

// Ruta para crear una publicación
app.post('/create-post', async (req, res) => {
    const { userName, content } = req.body;
    const date = new Date().toISOString().split('T')[0];
    try {
        await session.run(
            'MATCH (u:User {name: $userName}) CREATE (u)-[:POSTED]->(p:Post {content: $content, date: $date}) RETURN u, p',
            { userName, content, date }
        );
        res.status(200).send('Post created successfully');
    } catch (error) {
        res.status(500).send('Error creating post');
    }
});

// Ruta para obtener publicaciones
app.get('/posts', async (req, res) => {
    try {
        const result = await session.run('MATCH (u:User)-[:POSTED]->(p:Post) RETURN u.name AS user, p.content AS content, p.date AS date');
        const posts = result.records.map(record => ({
            user: record.get('user'),
            content: record.get('content'),
            date: record.get('date')
        }));
        res.json(posts);
    } catch (error) {
        res.status(500).send('Error fetching posts');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

