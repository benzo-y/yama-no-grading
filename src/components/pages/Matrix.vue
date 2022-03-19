<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-row>
      <v-col cols="12">
        <CardFilterVue
          :changePublisher.sync="publisherValue"
          :changeClimbed.sync="climbedValue"
        />
      </v-col>
      <v-col cols="12">
        <v-row v-for="phy in physical" :key="phy.grade">
          <v-col cols="1">
            <TooltipAxis :item="phy"/>
          </v-col>
          <v-col
            v-for="tech in technological"
            :key="`${phy.grade}${tech.grade}`"
            class="col-11-5"
          >
            <CardRouteListVue
              :routes="createRouteList(phy.grade, tech.grade)"
              :getSelectedRouteId.sync="dialog"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col
            v-for="tech in technological"
            :key="tech.grade"
            class="col-11-5"
          >
            <TooltipAxis :item="tech"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog.isShow"
      v-if="dialog.isShow"
      width="75%"
    >
      <CardRouteForm
        mode="read"
        :id="dialog.id"
        :clickClose.sync="dialog.isShow"
      />
    </v-dialog>
  </v-container>
</template>


<script>
import CardRouteListVue from "./matrix/CardRouteList.vue";
import CardFilterVue from "./matrix/CardFilter.vue";
import CardRouteForm from "../parts/CardRouteForm.vue"
import TooltipAxis from "./matrix/TooltipAxis.vue";
import { MATRIX_AXIS } from "../../const/const";
import { mapGetters } from "vuex"

export default {
    data: () => ({
      routes: [],
      matrix: new Map(),
      physical: MATRIX_AXIS.physical,
      technological: MATRIX_AXIS.technological,
      publisherValue: [],
      climbedValue: [],
      dialog: {
        isShow: false,
        id: null,
      }
    }),
    components: {
      CardRouteListVue,
      CardFilterVue,
      CardRouteForm,
      TooltipAxis
    },
    computed: {
      ...mapGetters(["matrixMap", "climbedIdSet"]),
    },
    mounted() {
      // stateの値の変更を検知する（ミューテーション実行後の値を取得）
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'setMatrixMap') {
          this.matrix = this.matrixMap;
        }
      });
    },
    methods: {
      createRouteList(physical, technological) {
        // ストアから体力と技術難易度に一致するルートのマップを取得
        const routeListMap = this.matrixMap.get(physical + "-" + technological);
        let result = [];

        // リストがない場合は空配列を返す
        if (!this.matrixMap.size || !routeListMap) {
          return result;
        }

        // 発行元でフィルタ
        if(this.publisherValue.length) {
          this.publisherValue.forEach(publisher => {
            if(routeListMap.has(publisher)) {
              result = [...result, ...routeListMap.get(publisher)];
            }
          });
        } else {
          result = routeListMap.get("all");
        }

        // 登頂チェックでフィルタ
        if(this.climbedValue.length == 1 && this.climbedValue[0]) {
          result = result.filter(val => this.climbedIdSet.has(val.id));
        } else if(this.climbedValue.length == 1 && !this.climbedValue[0]) {
          result = result.filter(val => !this.climbedIdSet.has(val.id));
        }
        return result
      }
    }
  }
</script>

<style scoped>
.col-11-5 {
  /* 11colを5等分する */
  width: calc(100%*11/12/5);
  flex: 0 0 calc(100%*11/12/5);

position: relative;
	min-height: 1px;
	padding-right: 15px;
	padding-left: 15px;
}
</style>