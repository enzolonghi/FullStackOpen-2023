const Blog = require('../models/blog')
const User = require('../models/user')
var _ = require('lodash')
 
const listWithManyBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]
const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
]
const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
const totalLikes = (blogs) => {
    return blogs.length === 1
    ? blogs[0].likes
    : blogs.reduce((n, blog) => n + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    const getMaxLikesBlog = (blogs) => {
        const listOfLikes = blogs.map(blog => {return blog.likes})
        const maxLikes = Math.max(...listOfLikes)
        const blogWithMostLikes = blogs.find(blog => blog.likes === maxLikes)
        return {
            title: blogWithMostLikes.title,
            author: blogWithMostLikes.author,
            likes: blogWithMostLikes.likes
        }
    }
    if (blogs.length === 0) {
        return 0
    } else {
        return getMaxLikesBlog(blogs)
    }
}
const mostBlogs = (blogs) => {
  const authors = _.map(blogs, 'author')
  var result = authors.reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {})
  result = Object.entries(result)
  const maxBlogs = _.max(Object.values(result))
  return {
    author: maxBlogs[0],
    blogs: maxBlogs[1]
  }
}
module.exports = {
    listWithManyBlogs,
    listWithOneBlog,
    blogsInDb,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    usersInDb
}
