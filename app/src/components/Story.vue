<template>
  <div class="story-container">
    <div class="story">
      <div class="chapter">
        <h1 v-if="root.title">{{root.title}}</h1>
        <p v-if="root.content">{{root.content}}</p>
      </div>
      <div v-if="chapters" v-for="chapter in chapters" :key="chapter.id || ''" class="chapter">
        <h3>{{chapter.title}}</h3>
        <p>{{chapter.content}}</p>
      </div>
      <chapter-button-group 
        v-if="childChapters && !create" 
        v-bind:chapters="childChapters" 
        v-bind:parentChapterId="lastChapterId">
      </chapter-button-group>
      <div v-if="create">
        <input v-model="titleInput" type="text">
        <textarea v-model="contentInput" cols="30" rows="10"></textarea>
        <a v-on:click.prevent="submitChapter">Submit Chapter</a>
        <p :if="submitMessage">{{submitMessage}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { postChapter, getChapters } from '../utils/dbWrapper'
import { last } from '../utils/arrayUtil.js'
import ChapterButtonGroup from './ChapterButtonGroup'

export default {
  name: 'story',
  props: ['chapterId', 'create'],
  data () {
    return {
      root: {
        title: '',
        content: ''
      },
      chapters: [],
      childChapters: [],
      lastChapterId: '',
      submitMessage: '',
      titleInput: '',
      contentInput: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    getChapters(to.params.id)
      .then(json => {
        next(vm => vm.setData(json.error, json.result))
      })
  },
  beforeRouteUpdate (to, from, next) {
    getChapters(to.params.id)
      .then(json => {
        this.setData(json.error, json.result)
        next()
      })
  },
  methods: {
    setData (err, data) {
      // do something with err
      if (err) return

      console.log(data)

      let [root, ...chapters] = data
      this.root = root
      this.chapters = chapters
      this.childChapters = last(data).chapters
      this.lastChapterId = last(data).id
    },
    submitChapter () {
      console.log(this.titleInput, this.contentInput)
      postChapter({
        title: this.titleInput,
        content: this.contentInput,
        id: this.lastChapterId
      }).then(response => {
        if (response.error) {
          this.submitMessage = response.error
        } else {
          this.$router.push({path: '/story/' + response.result.id})
        }
      })
    }
  },
  components: {
    'chapter-button-group': ChapterButtonGroup
  }
}
</script>


<style scoped>
  .story-container {
    width: 100%;
    background-color: #6789ab;
    max-width: 100vw;
    height: 100vh;
  }

  .story {
    background-color: #efefe6;
    padding: 10vw;
    margin: 0 10vw;
  }
</style>
