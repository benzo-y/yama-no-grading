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
    ...mapGetters(['getHasClimbedById']),
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
  mounted() {
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (['getHasClimbedById', 'addClimbedId', 'deleteClimbedId'].includes(mutation.type)) {
        this.hasClimbed = this.getHasClimbedById(this.id);
      }
    });
  },
}

</script>