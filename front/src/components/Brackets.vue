<template lang="pug">
  .hello.container
    h1.title Super-Brackets
    h2.subtitle Conheça todos os brackets cadastrados
    .columns.is-multiline
      .column.is-one-third(v-for="bracket in brackets" v-bind:key="bracket._id")
        .card
          .card-content
            .content
              h1.title.is-4
                router-link(v-bind:to="{name: 'Bracket', params: {slug: bracket.slug}}") {{bracket.title}}
              hr
              p {{bracket.description}}
</template>

<script>
import BracketService from '@/services/bracket'

export default {
  name: 'Brackets',
  data () {
    return {
      brackets: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    try {
      const response = await BracketService.query()
      return next((vm) => {
        vm.brackets = response.body
        vm.$emit('updateHead')
      })
    } catch (e) {
      next((vm) => {
        vm.$emit('updateHead')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
