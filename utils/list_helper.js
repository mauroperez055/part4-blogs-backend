const _ = require('lodash'); 

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const authorsWithCount = _.map(grouped, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))

  return _.maxBy(authorsWithCount, 'blogs')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};