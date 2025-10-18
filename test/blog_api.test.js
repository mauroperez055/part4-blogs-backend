const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const mongoose = require("mongoose");

// Datos iniciales de ejemplo
const initialBlogs = [
  {
    title: "Primer blog",
    author: "Mauro Perez",
    url: "http://ejemplo1.com",
    likes: 5,
  },
  {
    title: "Segundo blog",
    author: "Melisa Lucero",
    url: "http://ejemplo2.com",
    likes: 10,
  },
];

describe("Blog API tests", () => {
  // Limpia la base de datos antes de cada test
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });
  
  // Test para verificar que todos los blogs se devuelven como JSON y la cantidad es correcta
  test("all blogs are returned as JSON", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
  
  // Test para verificar que existe el campo id y no existe _id
  test("the blogs have an id field", async () => {
    const response = await api.get("/api/blogs");
  
    const blogs = response.body;
    blogs.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });
  
  // Test para crear un nuevo blog y verificar que se agrega correctamente
  test("blog can be created", async () => {
    const newBlog = {
      title: "Tercer blog",
      author: "Corazon de Melon",
      url: "http://ejemplo3.com",
      likes: 15,
    };
  
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  
    const titles = blogsAtEnd.map((b) => b.title);
    assert.ok(titles.includes("Tercer blog"));
  });
  
  // Test para verificar que el campo likes por defecto es 0 si no se proporciona
  test("field likes defaults to 0 if missing", async () => {
    const newBlog = {
      title: "Blog sin likes",
      author: "Apu Indio",
      url: "http://ejemplo4.com",
    };
  
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  
    assert.strictEqual(response.body.likes, 0);
  });
  
  // Test para verificar que si faltan title y url, responde con 400 Bad Request
  test("if title and url are missing, respond with 400 Bad Request", async () => {
    const newBlog = {
      author: "Anonimo",
      likes: 7,
    };
  
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  // Test para eliminar un blog por id
  test('deleting a blog by id', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0]; 

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

    const titles = blogsAtEnd.map(b => b.title);;
    assert.ok(!titles.includes(blogToDelete.title));
  });

  // Test para verificar que likes se actualizo correctamente
  test('updating likes of a blog works', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      likes: blogToUpdate.likes + 1
    };

    const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

    // Verificamos que likes haya cambiado
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

    // Verificamos que el resto del blog no cambió
    assert.strictEqual(response.body.title, blogToUpdate.title);
    assert.strictEqual(response.body.author, blogToUpdate.author);
    assert.strictEqual(response.body.url, blogToUpdate.url);
  })
})

// Cuando se finalizan todos los tests, cerramos la conexión a la base de datos
after(async () => {
  await mongoose.connection.close();
});
