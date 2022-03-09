<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-card>
      <v-card-actions>
        <v-btn color="primary">
          新規作成
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-actions>
      <v-data-table
        :headers="headersSetFilter"
        :items="routes"
        item-key="id"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
        <template v-slot:[`item.climbed`]="{ item }">
          <v-layout justify-center>
            <IconClimbed :id="item.id" justify="center"/>
          </v-layout>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-layout
            v-if="item.publisherKey==='other'"
            justify-center
          >
            <v-icon
              class="mr-1"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              class="ml-1"
            >
              mdi-delete
            </v-icon>
          </v-layout>
        </template>
        <template v-slot:[`body.append`]>
          <tr>
            <td v-for="header,index in headers" :key="index">
              <v-select
                v-if="'filter' in header" 
                :items="filter[header.value].items"
                item-text="name"
                item-value="value"
                v-model="filter[header.value].selected"
              >
              </v-select>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import IconClimbed from "../parts/IconClimbed.vue";
import { PUBLISHER } from "../../const/const";

const ELEVATION_INCREMENTS = 500;
const TIME_INCREMENTS = 10;
const LENGTH_INCREMENTS = 10;
const CUM_ELEVATION_INCREMENTS = 1;
const ROUTE_COEF_INCREMENTS = 20;

export default {
  data: () => ({
    search: '',
    filter: {
      physical: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "1"},
          {value: 2, name: "2"},
          {value: 3, name: "3"},
          {value: 4, name: "4"},
          {value: 5, name: "5"},
          {value: 6, name: "6"},
          {value: 7, name: "7"},
          {value: 8, name: "8"},
          {value: 9, name: "9"},
          {value: 10, name: "10"},
        ],
        selected: null,
      },
      technological: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "A"},
          {value: 2, name: "B"},
          {value: 3, name: "C"},
          {value: 4, name: "D"},
          {value: 5, name: "E"},
        ],
        selected: null,
      },
      start_point_elevation: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~500"},
          {value: 2, name: "500~1000"},
          {value: 3, name: "1000~1500"},
          {value: 4, name: "1500~2000"},
          {value: 5, name: "2000~2500"},
          {value: 6, name: "2500~3000"},
          {value: 7, name: "3000~3500"},
          {value: 8, name: "3500~"},
        ],
        selected: null,
      },
      highest_point_elevation: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~500"},
          {value: 2, name: "500~1000"},
          {value: 3, name: "1000~1500"},
          {value: 4, name: "1500~2000"},
          {value: 5, name: "2000~2500"},
          {value: 6, name: "2500~3000"},
          {value: 7, name: "3000~3500"},
          {value: 8, name: "3500~"},
        ],
        selected: null,
      },
      end_point_elevation: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~500"},
          {value: 2, name: "500~1000"},
          {value: 3, name: "1000~1500"},
          {value: 4, name: "1500~2000"},
          {value: 5, name: "2000~2500"},
          {value: 6, name: "2500~3000"},
          {value: 7, name: "3000~3500"},
          {value: 8, name: "3500~"},
        ],
        selected: null,
      },
      course_time: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~10"},
          {value: 2, name: "10~20"},
          {value: 3, name: "20~30"},
          {value: 4, name: "30~40"},
          {value: 5, name: "40~50"},
          {value: 6, name: "50~"},
        ],
        selected: null,
      },
      length: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~10"},
          {value: 2, name: "10~20"},
          {value: 3, name: "20~30"},
          {value: 4, name: "30~40"},
          {value: 5, name: "40~50"},
          {value: 6, name: "50~"},
        ],
        selected: null,
      },
      cum_up_elevation: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~1"},
          {value: 2, name: "1~2"},
          {value: 3, name: "2~3"},
          {value: 4, name: "3~4"},
          {value: 5, name: "4~5"},
          {value: 6, name: "5~"},
        ],
        selected: null,
      },
      cum_down_elevation: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~1"},
          {value: 2, name: "1~2"},
          {value: 3, name: "2~3"},
          {value: 4, name: "3~4"},
          {value: 5, name: "4~5"},
          {value: 6, name: "5~"},
        ],
        selected: null,
      },
      route_coef: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: "0~20"},
          {value: 2, name: "20~40"},
          {value: 3, name: "40~60"},
          {value: 4, name: "60~80"},
          {value: 5, name: "80~100"},
          {value: 6, name: "100~"},
        ],
        selected: null,
      },
      publisher: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: PUBLISHER.shinshu},
          {value: 2, name: PUBLISHER.yamanashi},
          {value: 3, name: PUBLISHER.shizuoka},
          {value: 4, name: PUBLISHER.gunma},
          {value: 5, name: PUBLISHER.gifu},
          {value: 6, name: PUBLISHER.tochigi},
          {value: 7, name: PUBLISHER.ishizuchisankei},
          {value: 8, name: PUBLISHER.akita},
          {value: 9, name: PUBLISHER.toyama},
          {value: 10, name: PUBLISHER.hyaku},
          {value: 11, name: PUBLISHER.other},
        ],
        selected: null,
      },
      climbed: '',
    },
    routes: [],
    headers: [
      {
        text: 'ルート名称',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {
        text: '体力度',
        value: 'physical',
        filterType: "filterBySelectedName",
      },
      { 
        text: '技術的難易度',
        value: 'technological',
        filterType: "filterBySelectedName",
      },
      { text: 'スタート地点（地名）', value: 'start_point_name' },
      { text:
        'スタート地点（標高）',
        value: 'start_point_elevation',
        filterType: "filterElevation",
      },
      { text: 'ルート最高地点（地名）', value: 'highest_point_name' },
      { text:
        'ルート最高地点（標高）',
        value: 'highest_point_elevation',
        filterType: "filterElevation",
      },
      { text: '終了地点（地名）', value: 'end_point_name' },
      {
        text: '終了地点（標高）',
        value: 'end_point_elevation',
        filterType: "filterElevation",
        },
      {
        text: 'コースタイム',
        value: 'course_time',
        filterType: "filterTime",
        },
      {
        text: 'ルート長',
        value: 'length',
        filterType: "filterLength",
        },
      {
        text: '累計登り標高差',
        value: 'cum_up_elevation',
        filterType: "filterCumElevation",
        },
      {
        text: '累計下り標高差',
        value: 'cum_down_elevation',
        filterType: "filterCumElevation",
      },
      {
        text: 'ルート係数',
        value: 'route_coef',
        filterType: "filterRouteCoef",
      },
      {
        text: '発行元',
        value: 'publisher',
        filterType: "filterBySelectedName",
      },
      {
        text: '登頂チェック',
        value: 'climbed',
        sortable: false,
        filterType: "selectClimbed",
      },
      { text: 'アクション', value: 'actions', sortable: false },
    ],
  }),
  components: {
    IconClimbed,
  },
  computed: {
    ...mapGetters(["routeMap"]),
    headersSetFilter() {
      this.headers.forEach(el => {
        switch(el.filterType) {
          case "filterBySelectedName":
            el.filter = value => this.filterBySelectedName(value, el.value);
            break;
          case "filterElevation":
            el.filter = value => this.filterUseIncrements(value, el.value, ELEVATION_INCREMENTS);
            break;
          case "filterTime":
            el.filter = value => this.filterUseIncrements(value, el.value, TIME_INCREMENTS);
            break;
          case "filterLength":
            el.filter = value => this.filterUseIncrements(value, el.value, LENGTH_INCREMENTS);
            break;
          case "filterCumElevation":
            el.filter = value => this.filterUseIncrements(value, el.value, CUM_ELEVATION_INCREMENTS);
            break;
          case "filterRouteCoef":
            el.filter = value => this.filterUseIncrements(value, el.value, ROUTE_COEF_INCREMENTS);
            break;
        }
      });
      return this.headers;
    },
  },
  mounted() {
    this.routes = this.routeMap.get("all");
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setRouteMap') {
        this.routes = this.routeMap.get("all");
      }
    });
  },
  methods: {
    filterOnlyCapsText (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
    },
    // グレードのフィルタ：一致したものを表示する
    filterBySelectedName(value, key) {
      let target = this.filter[key];
      if (!target.selected) return true;
      return value.toString() === target.items[target.selected].name;
    },
    // ○○～○○の範囲を選択するフィルタ：一致したものを表示する、0～10の場合は0以上、10以下
    filterUseIncrements(value, key, constValue) {
      let target = this.filter[key];
      if (!target.selected) return true;
      // 選択した値が配列の一番最後だった場合、「以上の」チェックだけする
      if (target.selected === (target.items.length-1)) return constValue*(target.selected-1) <= value;
      return constValue*(target.selected-1) <= value && value <= constValue*target.selected;
    }
  },
}
</script>
