const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, { url, description }, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createLink(
    { data: { url, description, postedBy: { connect: { id: userId } } } },
    info,
  )
}

function profile(parent, { name, picUrl, role, description}, context, info) {
  return context.db.mutation.createProfile(
    {
      data: {  name, picUrl, role, description },
      info,
    }
  )
}

function skill(parent, { name, value, type, profile}, context, info) {
  return context.db.mutation.createSkill(
    {
      data: {  name, value, type, profile:{ connect: { id: profile } }  },
      info,
    }
  )
}

function contact(parent, { location, email, link, profile}, context, info) {
  return context.db.mutation.createContact(
    {
      data: {  location, email, link, profile:{ connect: { id: profile } }  },
      info,
    }
  )
}


function content(parent, { title, description, year, image_url, type, profile}, context, info) {
  return context.db.mutation.createContent(
    {
      data: {  title, description, year, type, image_url, profile:{ connect: { id: profile } }  },
      info,
    }
  )
}

function proyect(parent, { name, image, description, url, tags, profile}, context, info) {
  return context.db.mutation.createProyect(
    {
      data: {  name, image, description, url, tags, profile:{ connect: { id: profile } }  },
      info,
    }
  )
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    post,
    signup
  }
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } })
  if (!user) {
    throw new Error(`Could not find user with email: ${args.email}`)
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context)
  const { linkId } = args
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`)
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info,
  )
}

module.exports = {
  post,
  vote,
  signup,
  login,
  profile,
  skill,
  content,
  proyect,
  contact
}