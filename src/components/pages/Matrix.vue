<template>
  <v-container class="text-sm-body-2">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="8">
                <v-select
                  v-model="locationValue"
                  multiple
                  chips
                  dense 
                  :items="locationItem"
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
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="1">
        <v-card height="100%">
          体力度
        </v-card>
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="n in 10" :key="n">
            <v-col cols="1">
              <v-card height="100%">
                {{n}}
              </v-card>
            </v-col>
            <v-col
              v-for="j in 5"
              :key="`${n}${j}`"
              class="col-11-5"
            >
              <CardRouteListVue :routes="routes"/>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="11">
        <v-container>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col
              v-for="i in 5"
              :key="i"
              class="col-11-5"
            >
              <v-card>
                {{i}}
              </v-card>
            </v-col>
            <v-col cols="1"></v-col>
            <v-col cols="11">
              <v-card>
                技術的難易度
              </v-card>
            </v-col>
          </v-row>
        </v-container>
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
      locationValue: [],
      locationItem: ["信州", "山梨", "静岡", "群馬", "岐阜", "栃木", "石鎚山系", "秋田", "富山", "百名山", "その他"],
      climbedValue: [],
      climbedItem: ["on", "off"]
    }),
    components: {
      CardRouteListVue
    },
    computed: {
      ...mapGetters(["getRoutesBylocation"]),
    },
    created() {
      this.routes = this.getRoutesBylocation(this.locationValue);
    },
    mounted() {
      // stateの値の変更を検知する（ミューテーション実行後の値を取得）
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'setRouteMap') {
          this.routes = this.getRoutesBylocation(this.locationValue);
        }
      });
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