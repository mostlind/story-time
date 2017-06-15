const SERVER_URL = 'http://api.x.dev:8081'

function setTokenHeader () {
  var token = localStorage.getItem('storytimetoken')
  if (!token) return false

  let headers = new Headers()
  headers.append('x-access-token', token)

  return headers
}

function createStory (storyInfo) {
  var tokenHeader = setTokenHeader()
  if (!tokenHeader) return {error: 'not logged in'}

  var options = {
    method: 'POST',
    headers: tokenHeader,
    body: JSON.stringify(storyInfo)
  }

  return fetch(`${SERVER_URL}/story`, options)
    .then(res => {
      if (res.ok) return res.json()

      throw new Error('not logged in')
    })
    .catch((err) => ({error: err}))
}

function getChapters (chapterId) {
  return fetch(`${SERVER_URL}/story/${chapterId}`)
    .then(res => res.json())
}

function postChapter (chapterInfo) {
  var headers = setTokenHeader()
  if (!headers) return (new Promise((resolve, reject) => resolve({error: 'not logged in'})))

  headers.append('Content-Type', 'application/json')

  var options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(chapterInfo)
  }

  return fetch(`${SERVER_URL}/chapter`, options)
    .then(res => {
      if (res.ok) return res.json()

      throw new Error('not logged in')
    })
    .catch((err) => ({error: err}))
}

function createUser (userInfo) {
  var options = {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return fetch(`${SERVER_URL}/user`, options)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.error) return {error: json.error}

      localStorage.setItem('storytimetoken', json.token)

      return {error: null, result: json.result}
    })
}

function authenticateUser (userInfo) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(userInfo)
  }

  return fetch(`${SERVER_URL}/authenticate`, options)
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        return {error: json.error}
      }

      localStorage.setItem('storytimetoken', json.token)

      return {error: null, test: 'test'}
    })
}

export { createStory, getChapters, postChapter, createUser, authenticateUser }
