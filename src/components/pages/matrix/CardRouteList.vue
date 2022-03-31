<template>
  <v-card height="100%">
    <v-list dense >
      <v-list-item v-for="item in this.filteredRoutes" :key="item.id" style="min-height: auto;">
        <v-list-item-icon class="mr-2 my-1">
          <IconClimbed :id="item.id"/>
        </v-list-item-icon>
        <v-list-item-content
          style="padding: 0;"
          @click="clickListItem(item.id)"
        >
          {{item.name}}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import IconClimbed from "../../parts/IconClimbed.vue"
import { mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false,
    showRouteId: null,
    routes: null,
  }),
  props: {
    grade: {type: Object},
  },
  components: {
    IconClimbed,
  },
  computed: {
    ...mapGetters(["getRoutesByGrade", "getHasClimbedById", "getMatrixFilterValue"]),
    filteredRoutes() {
      const selectedValue = this.getMatrixFilterValue();
      return this.routes.filter(route => {
        // 発行元でフィルタ：未選択、または選択されたセレクトの中にルートの発行元がない場合、falseを返す
        if (!selectedValue.publisher.includes(route.publisherKey)) return false;
        // 登頂チェックでフィルタ：未選択の場合、falseを返す
        if (!selectedValue.climbed.length) return false;
        // 登頂チェックでフィルタ：選択された登頂チェックがtrueが存在、かつ登頂チェックに対象のIDがある場合、trueを返す
        if (selectedValue.climbed.includes(true) && this.getHasClimbedById(route.id)) return true;
        // 登頂チェックでフィルタ：選択された登頂チェックがfalseが存在、かつ登頂チェックに対象のIDがない場合、trueを返す
        if (selectedValue.climbed.includes(false) && !this.getHasClimbedById(route.id)) return true;
        return false;
      });
    },
  },
  created() {
    this.routes = this.getRoutesByGrade(this.grade.physical, this.grade.technological);
  },
  mounted() {
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (['initRouteMap', 'setRouteMap', 'deleteRouteMap'].includes(mutation.type)) {
        this.routes = this.getRoutesByGrade(this.grade.physical, this.grade.technological);
      }
    });
  },
  methods: {
    clickListItem(id) {
      this.$emit('update:getSelectedRouteId', {isShow: true, id});
    },
  },
}
</script>
