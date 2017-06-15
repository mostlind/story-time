<template>
  <div>
    <form v-on:submit.prevent="signUp">
      <p>email: <input name="email" type="text"></input></p>
      <p>pen name: <input name="username" type="text">
      <p>password: <input name="password" type="password"></input></p>
      <p>Input password again: <input type="password" name="password2">
      <p>color: <input type="text" name="color"></p>

      <input type="submit" value="Sign Up">
    </form>
    <p v-if="success">{{success}}</p>
  </div>
</template>

<script>
import { createUser } from '../utils/dbWrapper'
export default {
  name: 'signup',
  data: function () {
    return {
      success: null,
      info: null
    }
  },
  methods: {
    signUp (event) {
      let data = new FormData(event.target)
      console.log(event)
      console.log(data.get('email'))
      console.log(data.get('password'))
      if (data.get('password') !== data.get('password2')) { this.success = 'passwords don\'t match'; return }

      let dataObj = {
        email: data.get('email'),
        password: data.get('password'),
        color: data.get('color'),
        username: data.get('username')
      }

      let handleResponse = function (res) {
        console.log(res)
        if (res.error) { this.success = 'could not create user'; return }
        this.success = 'welcome to the site'
      }.bind(this)

      createUser(dataObj)
        .then(handleResponse)
    }
  }
}
</script>
