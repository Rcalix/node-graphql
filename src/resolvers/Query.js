function feed(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {}

  return context.db.query.links({ first, skip, where }, info)
}

function feed_skills(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = {AND: [{profile:{id_contains: filter}}]}
  // const where = filter
    // ? { OR: [{ id_contains: filter, profile: filter }] }
    // : {}

  return context.db.query.skills({ first, skip, where, orderBy: 'value_DESC' }, info)
}


function get_profile(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ id_contains: filter }, { name_contains: filter }] }
    : {}

  return context.db.query.profiles({ first, skip, where }, info)
}


function get_contact(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ id_contains: filter }, { email_contains: filter }] }
    : {}

  return context.db.query.contacts({ first, skip, where }, info)
}

function get_content(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ id_contains: filter }, { title_contains: filter },  { type_contains: filter }] }
    : {}

  return context.db.query.contents({ first, skip, where }, info)
}

function get_proyect(parent, args, context, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ id_contains: filter }, {name_contains: filter }] }
    : {}

  return context.db.query.proyects({ first, skip, where }, info)
}

module.exports = {
  feed,
  feed_skills,
  get_profile,
  get_contact,
  get_content,
  get_proyect
}