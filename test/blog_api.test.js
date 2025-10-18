const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const mongoose = require('mongoose');

// Datos iniciales de ejemplo
const initialBlogs = [
  { title: 'Primer blog', author: 'Mauro', url: 'http://ejemplo1.com', likes: 5 },
  { title: 'Segundo blog', author: 'Perez', url: 'http://ejemplo2.com', likes: 10 }
]

// Limpia la base de datos antes de cada test
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

// Test para verificar que todos los blogs se devuelven como JSON y la cantidad es correcta
test('all blogs are returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, initialBlogs.length);
})

// Test para verificar que existe el campo id y no existe _id
test('the blogs have an id field', async () => {
  const response = await api.get('/api/blogs');

  const blogs = response.body;
  blogs.forEach(blog => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  })
})

after(async () => {
  await mongoose.connection.close();
})