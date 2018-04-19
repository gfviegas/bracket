<template lang="pug">
  main.bracket
    b#clicktext(style='position:absolute;left:10px;top:10px;color:black;font-family:sans-serif;visibility:visible') {{bracket.title}} = {{bracket.description}}
    #bracket(v-if="bracket.options.length")
      #round1.round
        .region.region1
          article(v-for="(v, i) in pairs.slice(0,8)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-bind:src="v[0].image" @click="round1Winner(v[0], i)")
              .slot
                img.slot2(v-bind:src="v[1].image" @click="round1Winner(v[1], i)")
        .region.region3
          article(v-for="(v,i) in pairs.slice(8,16)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-bind:src="v[0].image" @click="round1Winner(v[0], i+8)")
              .slot
                img.slot2(v-bind:src="v[1].image" @click="round1Winner(v[1], i+8)")

      #round2.round
        .region.region1
          article(v-for="(v,i) in roundTwo.slice(0,4)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round2Winner(v[0], i)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round2Winner(v[1], i)")
        .region.region3
          article(v-for="(v,i) in roundTwo.slice(4,8)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round2Winner(v[0], i+4)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round2Winner(v[1], i+4)")
      #round3.round
        .region.region1
          article(v-for="(v,i) in roundThree.slice(0,2)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round3Winner(v[0], i)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round3Winner(v[1], i)")
        .region.region3
          article(v-for="(v,i) in roundThree.slice(2,4)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round3Winner(v[0], i+2)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round3Winner(v[1], i+2)")
      #round4.round
        .region.region1
          article(v-for="(v,i) in roundFour.slice(0,1)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round4Winner(v[0], i)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round4Winner(v[1], i)")
        .region.region3
          article(v-for="(v,i) in roundFour.slice(1,2)")
            .match(v-bind:class="`m${i+1}`")
              .slot
                img.slot1(v-if="v[0]" v-bind:src="v[0].image" @click="round4Winner(v[0], i+1)")
              .slot
                img.slot2(v-if="v[1]" v-bind:src="v[1].image" @click="round4Winner(v[1], i+1)")
      #round5.round
        .region
          #match63.match.m1
            p.slot.slot1
            p.slot.slot2
          #match62.match.m2
            p.slot.slot1
            p.slot.slot2

      #round6.round
        .region
          #match64.match.m1
            p#slot127.slot.slot1
              strong
                |  Winner
                em.score 65
              // winner
            p#slot128.slot.slot2
              strike
                |  Loser
                em.score 60
</template>

<script>
import BracketService from '@/services/bracket'

export default {
  name: 'Bracket',
  data () {
    return {
      pairs: [],
      bracket: {options: []},
      roundTwo: Array.from({length: 8}, (e, i) => [null, null]),
      roundThree: Array.from({length: 4}, (e, i) => [null, null]),
      roundFour: Array.from({length: 2}, (e, i) => [null, null]),
      roundFive: Array.from({length: 2}, (e, i) => [null, null])
    }
  },
  methods: {
    foundEqualAndReplace (searchIn, match, target) {
      searchIn.forEach(outer => {
        outer.forEach(ar => {
          const index = ar.indexOf(ar.find(el => (el && match && el._id === match._id)))
          if (index >= 0) ar.splice(index, 1, target)
        })
      })
    },
    round1Winner (v, i) {
      const floor = Math.floor(i / 2)
      const position = (i % 2 === 0) ? 0 : 1
      this.foundEqualAndReplace([this.roundThree, this.roundFour, this.roundFive], this.roundTwo[floor][position], v)
      this.roundTwo[floor].splice(position, 1, v)
    },
    round2Winner (v, i) {
      const floor = Math.floor(i / 2)
      const position = (i % 2 === 0) ? 0 : 1
      this.foundEqualAndReplace([this.roundFour, this.roundFive], this.roundThree[floor][position], v)
      this.roundThree[floor].splice(position, 1, v)
    },
    round3Winner (v, i) {
      const floor = Math.floor(i / 2)
      const position = (i % 2 === 0) ? 0 : 1
      this.foundEqualAndReplace([this.roundFive], this.roundFour[floor][position], v)
      this.roundFour[floor].splice(position, 1, v)
    }
  },
  created () {
  },
  async beforeRouteEnter (to, from, next) {
    try {
      const response = await BracketService.find(to.params.slug)
      return next((vm) => {
        vm.bracket = response.body
        const {options} = vm.bracket

        vm.pairs = options.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / 2)

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
          }

          resultArray[chunkIndex].push(item)

          return resultArray
        }, [])

        vm.$emit('updateHead')
      })
    } catch (e) {
      next({name: 'Brackets'})
    }
  }
}
</script>

<style scoped>
body.bracket #content-wrapper {
  width: 100%;
  padding-top: 10px;
  margin: 0 auto;
}
body.bracket #content-wrapper .content {
  width: 90%;
  padding: 15px 10px;
}
body.bracket {
  font-family: 'Helvetica Neue', Helvetica, Arial, FreeSans, sans-serif;
}
hr.section_hr, div.section_sidebar {
  display: none;
}
body h4 {
  color: #444;
  text-transform: uppercase;
}
table.gridtable {
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #fff;
  border-collapse: collapse;
}
table.gridtable th {
  background-color: #b3d4ef;
  padding: 8px;
  width: 69.4px;
  border: 1px solid #fff;
}
table.gridtable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #fff;
  background-color: #ffffff;
  text-align: center;
}
table.gridtable td.title {
  background: #ccc;
  font-weight: bold;
}
#bracket {
  margin-top: 15px;
  height: auto;
  position: relative;
}
#bracket img {
  width: auto;
  cursor: pointer;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
#bracket .round {
  position: absolute;
  top: 0;
  width: 805px;
}
#bracket .round strong, #bracket .round strong span.seed, #bracket .round strong span.score {
  color: #4aa5ef;
}
#bracket #round2 {
  left: 65px;
  width: 675px;
}
#bracket #round3 {
  left: 130px;
  width: 545px;
}
#bracket #round4 {
  left: 195px;
  width: 415px;
}
#bracket #round5 {
  left: 80px;
  width: 465px;
}
#bracket #round6 {
  left: 340px;
  width: 250px;
}
#bracket .round .region1 .match, #bracket .round .region2 .match {
  left: 0px;
}
#bracket .round .region3 .match, #bracket .round .region4 .match {
  right: 0px;
}
#bracket .match {
  border: 1px solid #444;
  padding: 0;
  width: 64px;
  position: absolute;
  font-size: 12px;
}
#bracket #round1 .match {
  height: 100px;
}
#bracket #round1 .m1 {
  top: 0;
}
#bracket #round1 .m2 {
  top: 110px;
}
#bracket #round1 .m3 {
  top: 220px;
}
#bracket #round1 .m4 {
  top: 330px;
}
#bracket #round1 .m5 {
  top: 440px;
}
#bracket #round1 .m6 {
  top: 550px;
}
#bracket #round1 .m7 {
  top: 660px;
}
#bracket #round1 .m8 {
  top: 770px;
}
#bracket #round1 .region2 .m1, #bracket #round1 .region4 .m1 {
  top: 1150px;
}
#bracket #round1 .region2 .m2, #bracket #round1 .region4 .m2 {
  top: 1200px;
}
#bracket #round1 .region2 .m3, #bracket #round1 .region4 .m3 {
  top: 1250px;
}
#bracket #round1 .region2 .m4, #bracket #round1 .region4 .m4 {
  top: 1300px;
}
#bracket #round1 .region2 .m5, #bracket #round1 .region4 .m5 {
  top: 1350px;
}
#bracket #round1 .region2 .m6, #bracket #round1 .region4 .m6 {
  top: 1400px;
}
#bracket #round1 .region2 .m7, #bracket #round1 .region4 .m7 {
  top: 1450px;
}
#bracket #round1 .region2 .m8, #bracket #round1 .region4 .m8 {
  top: 1500px;
}
#bracket #round2 .match {
  height: 100px;
}
#bracket #round2 .m1 {
  top: 45px;
}
#bracket #round2 .m2 {
  top: 265px;
}
#bracket #round2 .m3 {
  top: 485px;
}
#bracket #round2 .m4 {
  top: 705px;
}
#bracket #round2 .region2 .m1, #bracket #round2 .region4 .m1 {
  top: 550px;
}
#bracket #round2 .region2 .m2, #bracket #round2 .region4 .m2 {
  top: 650px;
}
#bracket #round2 .region2 .m3, #bracket #round2 .region4 .m3 {
  top: 750px;
}
#bracket #round2 .region2 .m4, #bracket #round2 .region4 .m4 {
  top: 850px;
}
#bracket #round3 .match {
  height: 200px;
}
#bracket #round3 .m1 {
  top: 100px;
}
#bracket #round3 .m2 {
  top: 540px;
}
#bracket #round3 .region2 .m1, #bracket #round3 .region4 .m1 {
  top: 600px;
}
#bracket #round3 .region2 .m2, #bracket #round3 .region4 .m2 {
  top: 800px;
}
#bracket #round4 .match {
  height: 450px;
}
#bracket #round4 .m1 {
  top: 200px;
}
#bracket #round4 .region2 .m1, #bracket #round4 .region4 .m1 {
  top: 550px;
}
#bracket #round5 .match {
  height: 210px;
  top: 320px;
}
#bracket #round5 .m1 {
  left: 180px;
  border-left: none;
}
#bracket #round5 .m2 {
  right: 0;
  border-right: none;
}
#bracket #round6 .match {
  height: 200px;
  top: 380px;
  border: none;
  width: 125px;
  padding: 0;
}
#bracket #round6 .slot {
  font-size: 13px;
  height: 25px;
  line-height: 25px;
  padding: 0 10px 0 6px;
}
#bracket #round6 .selected {
  font-size: 16px;
  background: #D7E8F0;
}
#bracket #round6 .slot1 {
  border-bottom: 1px solid #666;
  top: 22px;
}
#bracket #round6 .slot2 {
  top: 48px;
}
#bracket #round6 strong, #bracket #round6 strong span.seed, #bracket #round6 strong span.score {
  color: #c52000;
}
#bracket h3, #bracket h4 {
  display: none;
}
#bracket #round1 h4 {
  display: block;
  position: absolute;
  left: 170px;
  top: 165px;
  width: 150px;
}
#bracket #round1 .region3 h4, #bracket #round1 .region4 h4 {
  left: auto;
  right: 170px;
  text-align: right;
}
#bracket #round1 .region2 h4, #bracket #round1 .region4 h4 {
  top: 715px;
}
#bracket .match .slot {
  margin: 0;
  left: 0;
  right: 0;
  padding: 0 4px;
  height: 50%;
}
#bracket .match .slot2 {
  bottom: 0px;
}
#bracket .match .score {
  position: absolute;
  right: 4px;
  font-style: normal;
}
#bracket .match .seed {
  color: #777;
  font-size: 10px;
}
#bracket .match .winner, #bracket .match .winner em {
  font-weight: bold;
}
#bracket .region1 .match, #bracket .region2 .match {
  border-left: 0px;
}
#bracket .region3 .match, #bracket .region4 .match {
  border-right: 0px;
}
#bracket .final_pick {
  font-size: 16px;
  background: #fff;
}
#bracket .loser, #bracket strike {
  font-weight: normal;
  color: #777777;
  text-decoration: line-through;
}
#bracket strike a {
  color: #666;
}
</style>
