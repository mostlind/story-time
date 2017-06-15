<template>
  <div>
    <router-link :to="{path: id}">{{title}}</router-link>
  </div>
</template>

<script>
export default {
  created () {
    console.log(this.id)
  },
  data () {
    return {
      title: this.chapter.title,
      id: this.chapter.id
    }
  },
  props: ['chapter'],
  methods: {
  }
}

</script>

<style scoped>
  a {
    background-color: antiquewhite;
    padding: 1rem;
    color: black;
    text-decoration: none;
    transition: all 200ms ease;
  }

  a:hover {
    background-color: #6789ab;
    color: white;
  }

</style>
