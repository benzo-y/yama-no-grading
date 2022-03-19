<template>
  <div>
    <v-icon v-if="hasClimbed" @click="clickIcon" :color="icon.on">mdi-trophy</v-icon>
    <v-icon v-if="!hasClimbed" @click="clickIcon" :color="icon.off">mdi-trophy</v-icon>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import { CLIMBED_ICON_COLOR } from "../../const/const";

export default {
  data: () => ({
    hasClimbed: false,
    icon: CLIMBED_ICON_COLOR,
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