<template>
  <form v-on:submit.prevent="login">
    <p>email: <input name="email" type="text"></input></p>
    <p>password: <input name="password" type="password"></input></p>
    <input type="submit" value="Log In">
  </form>
</template>

<script>
import { authenticateUser } from '../utils/dbWrapper'
export default {
  name: 'login',
  data: function () {
    return {
      success: null,
      info: null
    }
  },
  methods: {
    login (event) {
      let data = new FormData(event.target)
      authenticateUser({email: data.get('email'), password: data.get('password')})
        .then(res => console.log(res))
    }
  }
}
</script>
