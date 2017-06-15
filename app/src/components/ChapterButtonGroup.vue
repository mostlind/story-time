<template>
  <div>
    <chapter-button 
      v-for="chapter in chapters" 
      v-bind:chapter="chapter" 
      :key="chapter.id || 0">
    </chapter-button>
    <new-chapter-button v-bind:parentChapterId="parentChapterId">
    </new-chapter-button>
  </div>
</template>

<script>
  import ChapterButton from './ChapterButton'
  import NewChapterButton from './NewChapterButton'
  export default {
    components: {
      'chapter-button': ChapterButton,
      'new-chapter-button': NewChapterButton
    },
    props: ['chapters', 'parentChapterId'],
    created () {
      console.log(this.parentChapterId)
    },
    data: function () {
      return {
      }
    }
  }
</script>

<style scoped>
  div {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
