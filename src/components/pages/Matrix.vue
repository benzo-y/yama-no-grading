<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="8">
              <v-select
                v-model="locationValue"
                multiple
                chips
                dense
                :items="locationItem"
                item-text="name"
                item-value="id"
                label="地域"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="climbedValue"
                multiple
                chips
                dense
                :items="climbedItem"
                label="登頂済み"
              ></v-select>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="1">
        <v-card height="100%">
          体力度
        </v-card>
      </v-col>
      <v-col cols="11">
        <v-row v-for="phy in physical" :key="phy">
          <v-col cols="1">
            <v-card height="100%">
              {{phy}}
            </v-card>
          </v-col>
          <v-col
            v-for="tech in technological"
            :key="`${phy}${tech}`"
            class="col-11-5"
          >
            <CardRouteListVue :routes="createRouteList(phy, tech)"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="11">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col
            v-for="tech in technological"
            :key="tech"
            class="col-11-5"
          >
            <v-card>
              {{tech}}
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="11">
            <v-card>
              技術的難易度
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import CardRouteListVue from "./matrix/CardRouteList.vue";
import { mapGetters } from "vuex"

export default {
    data: () => ({
      routes: [],
      matrix: new Map(),
      physical: [1, 2 ,3 ,4 ,5 ,6 ,7 ,8 , 9, 10],
      technological: ["A", "B", "C", "D", "E"],
      locationValue: [],
      locationItem: [
        {id:"shinshu", name:"信州"},
        {id:"yamanashi", name:"山梨"},
        {id:"shizuoka", name:"静岡"},
        {id:"gunma", name:"群馬"},
        {id:"gifu", name:"岐阜"},
        {id:"tochigi", name:"栃木"},
        {id:"ishizuchisankei", name:"石鎚山系"},
        {id:"akita", name:"秋田"},
        {id:"toyama", name:"富山"},
        {id:"hyaku", name:"百名山"},
        {id:"other", name:"その他"}
      ],
      climbedValue: [],
      climbedItem: ["on", "off"]
    }),
    components: {
      CardRouteListVue
    },
    computed: {
      ...mapGetters(["matrixMap"]),
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
        // TODO:リファクタリング
        const pref = physical + "-" + technological;        
        if (!this.matrixMap.size || !this.matrixMap.has(pref)) {
          return [];
        }

        if(this.locationValue.length) {
          let routes = [];
          this.locationValue.forEach(val => {
            if(this.matrixMap.get(pref).has(val)) {
              routes = [...routes, ...this.matrixMap.get(pref).get(val)];
            }
          });
          return routes;
        }
        return this.matrixMap.get(pref).get("all");
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