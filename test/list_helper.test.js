const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 24)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    assert.deepStrictEqual(result, expected)
  })

  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'Michael Chan', likes: 7 },
    { author: 'Edsger W. Dijkstra', likes: 5 },
    { author: 'Edsger W. Dijkstra', likes: 12 },
    { author: 'Robert C. Martin', likes: 10 },
    { author: 'Robert C. Martin', likes: 0 },
    { author: 'Robert C. Martin', likes: 2 }
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})