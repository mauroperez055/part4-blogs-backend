const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

//obtengo todos los blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

//obtengo un blog por id
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

//creo un nuevo blog
blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if(!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

//elimino un blog por id
blogsRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

  if (!deletedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  response.status(204).end();
});

//actualizo un blog por id
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end(); // Si el blog no existe
  }

  // Actualizamos los campos
  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;