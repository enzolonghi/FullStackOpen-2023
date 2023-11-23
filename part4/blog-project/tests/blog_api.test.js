const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
 
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithManyBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})
describe('when there is innitialy some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
  })
  
  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.listWithManyBlogs.length)
  })
  
  test('the id property is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of new blogs', () => {
  var token = null
  var user = null
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    user = new User({ username: 'root', passwordHash })
    await user.save()
    //Log in the user
    await api
    .post('/api/login')
    .send({username: user.username, password: 'sekret'})
    .then(response => {
      token = response.body.token
    })
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'Enzo Longhi',
      url: 'http://example.com',
      likes: 10,
      user: user.id
    }
  
    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
    
    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
      'test blog'
    )
  })
  test('blog without likes default zero', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'Enzo Longhi',
      url: 'http://example.com',
      user: user.id
    }
  
    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
    const lastBlogAdded = blogsAtEnd.find(b => b.title === newBlog.title)
    expect(lastBlogAdded.likes).toBe(0)
  })
  test('blog without title returns status 400', async () => {
    const newBlog = {
      author: 'Enzo Longhi',
      url: 'http://example.com'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  test('blog without url returns status 400', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'Enzo Longhi',
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of new blogs', () => {
  var token = null
  var user = null
  var newBlog = null
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    user = new User({ username: 'root', passwordHash })
    await user.save()
    //Log in the user and get the token
    await api
    .post('/api/login')
    .send({username: user.username, password: 'sekret'})
    .then(response => {
      token = response.body.token
    })
    //Once th euser is logged in assign to it a blog
    newBlog = {
      title: 'test blog',
      author: 'Enzo Longhi',
      url: 'http://example.com',
      likes: 10,
      user: user.id
    }
    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .then(response => newBlog = response.body)
  })
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = newBlog

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `Bearer ${token}` })
    .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  
    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('update a new blog', () => {
  test('update a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    const newBlog = {
      title: 'test blog',
      author: 'Enzo Longhi',
      url: 'http://example.com',
      likes: 10,
      id: blogToUpdate.id
    }
  
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(201)
  
    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate).toContainEqual(newBlog)
  
  })
})

describe('favourite blog', () => {
    test('of empty list is zero', () => {
        expect(helper.favouriteBlog([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(helper.favouriteBlog(helper.listWithOneBlog)).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
          })
    })
    test('when list has more than one blog equals the most liked blog', () => {
        expect(helper.favouriteBlog(helper.listWithManyBlogs)).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
          })
    })
})

describe('total likes', () => {
    
    test('of empty list is zero', () => {
        expect(helper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(helper.totalLikes(helper.listWithOneBlog)).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        expect(helper.totalLikes(helper.listWithManyBlogs)).toBe(36)
    })
})

describe('most post author', () => {
  test('with many blogs authors', () => {
    expect(helper.mostBlogs(helper.listWithManyBlogs)).toEqual({author: "Robert C. Martin", blogs: 3})
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})