<template>
  <div>
    <v-icon v-if="climbed" @click="clickIcon" color="yellow darken-3">mdi-trophy</v-icon>
    <v-icon v-if="!climbed" @click="clickIcon" color="grey lighten-1">mdi-trophy</v-icon>    
  </div>
</template>


<script>

export default {
  data: () => ({
    climbed: false,
  }),
  props: {
    id: {type: String}
  },
  methods: {
    clickIcon() {
      this.climbed = !this.climbed;
      // firebaseに保存
      // ストアに保存
    }
  }
}

</script>