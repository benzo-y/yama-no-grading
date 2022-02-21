<template>
  <div>
    <v-icon v-if="climbed" @click="clickIcon" color="yellow darken-3">mdi-trophy</v-icon>
    <v-icon v-if="!climbed" @click="clickIcon" color="grey lighten-1">mdi-trophy</v-icon>    
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    climbed: false,
  }),
  props: {
    id: {type: String},
  },
  computed: {
    ...mapGetters(['hasClimbed']),
  },
  methods: {
    ...mapActions(['addClimbedId', 'deleteClimbedId']),
    clickIcon() {
      this.climbed = !this.climbed;
      if(this.climbed) {
        // ストアとfirebaseに保存
        this.addClimbedId(this.id);
      } else {
        // ストアとfirebaseから削除
        this.deleteClimbedId(this.id);
      }
    },
  },
  created() {
    // ストアから登頂チェックを取得
    this.climbed = this.hasClimbed(this.id);
  },
}

</script>