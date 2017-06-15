<template>
  <router-link to="create" append>Create New</router-link>
</template>

<script>
  import ChapterButton from './ChapterButton'
  export default {
    components: {
      'chapter-button': ChapterButton
    },
    props: ['parentChapterId'],
    created () {
      console.log(this.parentChapterId)
    },
    data: function () {
      return {
      }
    },
    methods: {
      createInput: function () {

      }
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
