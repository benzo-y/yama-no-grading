<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-row>
      <v-col cols="12">
        <CardFilterVue
          :changeLocation.sync="locationValue"
          :changeClimbed.sync="climbedValue"
        />
      </v-col>
      <v-col cols="12">
        <v-row v-for="phy in physical" :key="phy.grade">
          <v-col cols="1">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-card
                  height="100%"
                  v-bind="attrs"
                  v-on="on"
                >
                  体力度：{{phy.grade}}
                </v-card>
              </template>
              <span>{{phy.tooltip}}</span>
            </v-tooltip>
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
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-card
                  height="100%"
                  v-bind="attrs"
                  v-on="on"
                >
                  技術的難易度：{{tech.grade}}
                </v-card>
              </template>
              <span v-html="tech.tooltip"></span>
            </v-tooltip>
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
import { mapGetters } from "vuex"

export default {
    data: () => ({
      routes: [],
      matrix: new Map(),
      physical: [
        { grade: 10, tooltip: "2～3泊以上が適当" },
        { grade:  9, tooltip: "2～3泊以上が適当" },
        { grade:  8, tooltip: "2～3泊以上が適当" },
        { grade:  7, tooltip: "1～2泊以上が適当" },
        { grade:  6, tooltip: "1～2泊以上が適当" },
        { grade:  5, tooltip: "1泊以上が適当" },
        { grade:  4, tooltip: "1泊以上が適当" },
        { grade:  3, tooltip: "日帰りが可能" },
        { grade:  2, tooltip: "日帰りが可能" },
        { grade:  1, tooltip: "日帰りが可能" },
      ],
      technological: [
        { grade: "A", tooltip: `登山道<br>
                                ◇概ね整備済<br>
                                ◇転んだ場合でも転落・滑落の可能性は低い。<br>
                                ◇道迷いの心配は少ない。<br>
                                <br>
                                技術・能力<br>
                                ◇登山の装備が必要`
        },
        { grade: "B", tooltip: `登山道<br>
                                ◇沢、崖、場所により雪渓などを通過<br>
                                ◇急な登下降がある。<br>
                                ◇道が分かりにくい所がある。<br>
                                ◇転んだ場合の転落・滑落事故につながる場所がある。<br>
                                <br>
                                技術・能力<br>
                                ◇登山経験が必要<br>
                                ◇地図読み能力があることが望ましい。`
        },
        { grade: "C", tooltip: `登山道<br>
                                ◇ハシゴ・くさり場、また、場所により雪渓や渡渉箇所がある。<br>
                                ◇ミスをすると転落・滑落などの事故になる場所がある。<br>
                                ◇案内標識が不十分な箇所も含まれる。<br>
                                <br>
                                技術・能力<br>
                                ◇地図読み能力、ハシゴ・くさり場などを通過できる身体能力が必要`
        },
        { grade: "D", tooltip: `登山道<br>
                                ◇厳しい岩稜や不安定なガレ場、ハシゴ・くさり場、藪漕ぎを必要とする箇所、場所により雪渓や渡渉箇所がある。<br>
                                ◇手を使う急な登下降がある。<br>
                                ◇ハシゴ・くさり場や案内標識などの人工的な補助は限定的で、転落・滑落の危険箇所が多い。<br>
                                <br>
                                技術・能力<br>
                                ◇地図読み能力、岩場、雪渓を安定して通過できるバランス能力や技術が必要<br>
                                ◇ルートファインディングの技術が必要`
        },
        { grade: "E", tooltip: `登山道<br>
                                ◇緊張を強いられる厳しい岩稜の登下降が続き、転落・滑落の危険箇所が連続する。<br>
                                ◇深い藪漕ぎを必要とする箇所が連続する場合がある。<br>
                                <br>
                                技術・能力<br>
                                ◇地図読み能力、岩場、雪渓を安定して通過できるバランス能力や技術が必要<br>
                                ◇ルートファインディングの技術、高度な判断力が必要<br>
                                ◇登山者によってはロープを使わないと危険な場所もある`
        },
      ],
      locationValue: [],
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

        // 地域でフィルタ
        if(this.locationValue.length) {
          this.locationValue.forEach(location => {
            if(routeListMap.has(location)) {
              result = [...result, ...routeListMap.get(location)];
            }
          });
        } else {
          result = routeListMap.get("all");
        }

        // 登頂チェックでフィルタ
        if(this.climbedValue.length == 1 && this.climbedValue[0] == "on") {
          result = result.filter(val => this.climbedIdSet.has(val.id));
        } else if(this.climbedValue.length == 1 && this.climbedValue[0] == "off") {
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