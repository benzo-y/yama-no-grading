<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-card>
      <v-card-actions>
        <v-btn color="primary" :to="{ name: 'route_edit' }">
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
        :headers="headers"
        :items="routes"
        item-key="id"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
        <template v-slot:[`header.climbed`]>
          <v-layout>
            <v-icon>mdi-trophy-outline</v-icon>
          </v-layout>
        </template>
        <template v-slot:[`item.climbed`]="{ item }">
          <IconClimbed :id="item.id"/>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-layout
            v-if="item.publisherKey==='other'"
            justify-center
          >
            <v-btn icon :to="{ name: 'route_edit', params: { route_id: item.id }}">
              <v-icon class="mr-1">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="cleckDeleteIcon(item)">
              <v-icon class="ml-1">mdi-delete</v-icon>
            </v-btn>
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
                <template v-if="header.value === 'climbed'" v-slot:[`selection`]="{ item }">
                  <v-icon v-if="item.color" :color="item.color">mdi-trophy</v-icon>
                  <span v-else></span>
                </template>
                <template v-if="header.value === 'climbed'" v-slot:[`item`]="{ item }">
                  <v-icon v-if="item.color" :color="item.color">mdi-trophy</v-icon>
                  <span v-else></span>
                </template>
              </v-select>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <DialogRouteDel :isShow.sync="deleteDialog.isShow" :deleteTarget="deleteDialog.target"/>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import IconClimbed from "../parts/IconClimbed.vue";
import { PUBLISHER } from "../../const/const";
import DialogRouteDel from "./routes/DialogRouteDel.vue";

const ELEVATION_INCREMENTS = 500;
const ELEVATION_MAX = 3500;
const TIME_INCREMENTS = 10;
const TIME_MAX = 50;
const LENGTH_INCREMENTS = 10;
const LENGTH_MAX = 50;
const CUM_ELEVATION_INCREMENTS = 1;
const CUM_ELEVATION_MAX = 5;
const ROUTE_COEF_INCREMENTS = 20;
const ROUTE_COEF_MAX = 100;

// 「○○～○○」「○○～」の範囲のセレクトの選択肢を作成
function createSelecrItems(increments, max) {
  const arr = [{value: 0, name: ""}];
  let i;
  for(i=1; i*increments <= max; i++) {
    arr.push({
      value: i,
      name: (increments*(i-1)) + "～" + (increments*i)
    });
  }
  // 末尾は「○○～」にする
  arr.push({value: i, name: max + "～"});
  return arr;
}

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
        items: createSelecrItems(ELEVATION_INCREMENTS, ELEVATION_MAX),
        selected: null,
      },
      highest_point_elevation: {
        items: createSelecrItems(ELEVATION_INCREMENTS, ELEVATION_MAX),
        selected: null,
      },
      end_point_elevation: {
        items: createSelecrItems(ELEVATION_INCREMENTS, ELEVATION_MAX),
        selected: null,
      },
      course_time: {
        items: createSelecrItems(TIME_INCREMENTS, TIME_MAX),
        selected: null,
      },
      length: {
        items: createSelecrItems(LENGTH_INCREMENTS, LENGTH_MAX),
        selected: null,
      },
      cum_up_elevation: {
        items: createSelecrItems(CUM_ELEVATION_INCREMENTS, CUM_ELEVATION_MAX),
        selected: null,
      },
      cum_down_elevation: {
        items: createSelecrItems(CUM_ELEVATION_INCREMENTS, CUM_ELEVATION_MAX),
        selected: null,
      },
      route_coef: {
        items: createSelecrItems(ROUTE_COEF_INCREMENTS, ROUTE_COEF_MAX),
        selected: null,
      },
      publisher: {
        items: [
          {value: 0, name: ""},
          {value: 1, name: PUBLISHER.nagano},
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
      climbed: {
        items: [
          {value: null},
          {value: true, color: "yellow darken-3"},
          {value: false, color: "grey lighten-1"},
        ],
        selected: null,
      },
    },
    routes: [],
    deleteDialog: {
      isShow: false,
      target: {},
      },
  }),
  components: {
    IconClimbed,
    DialogRouteDel,
  },
  computed: {
    ...mapGetters(["routeMap", "getHasClimbedById"]),
    headers() {
      return [
        {
          text: 'ルート名称',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: '体力度',
          value: 'physical',
          filter: value => this.filterBySelectedName(value, 'physical'),
        },
        {
          text: '技術的難易度',
          value: 'technological',
          filter: value => this.filterBySelectedName(value, 'technological'),
        },
        { text: 'スタート地点（地名）', value: 'start_point_name' },
        { text:
          'スタート地点（標高）',
          value: 'start_point_elevation',
          filter: value => this.filterUseIncrements(value, 'start_point_elevation', ELEVATION_INCREMENTS),
        },
        { text: 'ルート最高地点（地名）', value: 'highest_point_name' },
        { text:
          'ルート最高地点（標高）',
          value: 'highest_point_elevation',
          filter: value => this.filterUseIncrements(value, 'highest_point_elevation', ELEVATION_INCREMENTS),
        },
        { text: '終了地点（地名）', value: 'end_point_name' },
        {
          text: '終了地点（標高）',
          value: 'end_point_elevation',
          filter: value => this.filterUseIncrements(value, 'end_point_elevation', ELEVATION_INCREMENTS),
          },
        {
          text: 'コースタイム',
          value: 'course_time',
          filter: value => this.filterUseIncrements(value, 'course_time', TIME_INCREMENTS),
          },
        {
          text: 'ルート長',
          value: 'length',
          filter: value => this.filterUseIncrements(value, 'length', LENGTH_INCREMENTS),
          },
        {
          text: '累計登り標高差',
          value: 'cum_up_elevation',
          filter: value => this.filterUseIncrements(value, 'cum_up_elevation', CUM_ELEVATION_INCREMENTS),
          },
        {
          text: '累計下り標高差',
          value: 'cum_down_elevation',
          filter: value => this.filterUseIncrements(value, 'cum_down_elevation', CUM_ELEVATION_INCREMENTS),
        },
        {
          text: 'ルート係数',
          value: 'route_coef',
          filter: value => this.filterUseIncrements(value, 'route_coef', ROUTE_COEF_INCREMENTS),
        },
        {
          text: '発行元',
          value: 'publisher',
          filter: value => this.filterBySelectedName(value, 'publisher'),
        },
        {
          text: '',
          value: 'climbed',
          sortable: false,
          filter: (value, search, item) => this.filterClimbed('climbed', item),
        },
        { text: '', value: 'actions', sortable: false },
      ]
    },
  },
  mounted() {
    this.routes = this.routeMap.get("all");
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setRouteMap') {
        this.routes = [...this.routeMap.get("all")];
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
    filterUseIncrements(value, key, increments) {
      let target = this.filter[key];
      if (!target.selected) return true;
      // 選択した値が配列の一番最後だった場合、「以上の」チェックだけする
      if (target.selected === (target.items.length-1)) return increments*(target.selected-1) <= value;
      return increments*(target.selected-1) <= value && value <= increments*target.selected;
    },
    // 登頂チェックのフィルタ
    filterClimbed(key, item) {
      let selectedValue = this.filter[key].selected;
      // 未選択はすべてtrue
      if (selectedValue === null) return true;
      // 登頂チェックに値があるか確認
      let targetClimbed = this.getHasClimbedById(item.id);
      return selectedValue ? targetClimbed : !targetClimbed;
    },
    cleckDeleteIcon(target) {
      this.deleteDialog.target = target;
      this.deleteDialog.isShow = true;
    },
  },
}
</script>
