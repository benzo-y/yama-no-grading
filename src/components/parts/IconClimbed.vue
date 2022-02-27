<template>
  <div>
    <v-icon v-if="hasClimbed" @click="clickIcon" color="yellow darken-3">mdi-trophy</v-icon>
    <v-icon v-if="!hasClimbed" @click="clickIcon" color="grey lighten-1">mdi-trophy</v-icon>    
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    hasClimbed: false,
  }),
  props: {
    id: {type: String},
  },
  computed: {
    ...mapGetters(['getHasClimbedById', 'climbedIdSet']),
    _climbedIdSet() {
      return this.climbedIdSet;
    },
  },
  methods: {
    ...mapActions(['addClimbedId', 'deleteClimbedId']),
    clickIcon() {
      this.hasClimbed = !this.hasClimbed;
      if(this.hasClimbed) {
        // ストアとfirebaseに保存
        this.addClimbedId(this.id);
      } else {
        // ストアとfirebaseから削除
        this.deleteClimbedId(this.id);
      }
    },
  },
  created() {
    this.hasClimbed = this.getHasClimbedById(this.id);
  },
  watch: {
    _climbedIdSet() {
      this.hasClimbed = this.getHasClimbedById(this.id);
    },
  }
}

</script>