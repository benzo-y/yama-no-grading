<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-card>
      <v-card-actions>
        <v-btn color="primary" :to="{ name: 'route_edit' }">
          新規作成
        </v-btn>
        <v-spacer></v-spacer>
        <!-- テキストフィルタ -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-actions>
      <!-- データテーブル -->
      <v-data-table
        :headers="headers"
        :items="routes"
        item-key="id"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
        <!-- テーブルヘッダーの登頂チェックアイコン -->
        <template v-slot:[`header.climbed`]>
          <v-layout>
            <v-icon>mdi-trophy-outline</v-icon>
          </v-layout>
        </template>
        <!-- テーブル内の登頂チェックアイコン -->
        <template v-slot:[`item.climbed`]="{ item }">
          <IconClimbed :id="item.id"/>
        </template>
        <!-- テーブル内のアクションアイコン -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-layout
            v-if="item.publisherKey==='other'"
            justify-center
          >
            <v-btn icon :to="{ name: 'route_edit', params: { route_id: item.id }}">
              <v-icon class="mr-1">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="clickDeleteIcon(item)">
              <v-icon class="ml-1">mdi-delete</v-icon>
            </v-btn>
          </v-layout>
        </template>
        <!-- セレクトフィルタ -->
        <template v-slot:[`body.append`]>
          <tr>
            <td v-for="header,index in headers" :key="index">
              <v-select
                v-if="'filter' in header"
                :items="selectItems[header.value]"
                item-text="name"
                item-value="value"
                v-model="selectedValues[header.value]"
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
import { PHYSICAL, TECHNOLOGICAL,PUBLISHER_ITEMS, CLIMBED_ICON_ITEMS } from "../../const/const";
import DialogRouteDel from "./routes/DialogRouteDel.vue";

const FILTER_RANGE_ELEVATION = {increments: 500, max: 3500};
const FILTER_RANGE_TIME = {increments: 10, max: 50};
const FILTER_RANGE_DISTANCE = {increments: 10, max: 50};
const FILTER_RANGE_CUM_ELEVATION = {increments: 1, max: 5};
const FILTER_RANGE_ROUTE_COEF = {increments: 20, max: 100};

export default {
  data: () => ({
    search: '',
    selectedValues: {
      physical: null,
      technological: null,
      start_point_elevation: null,
      highest_point_elevation: null,
      end_point_elevation: null,
      course_time: null,
      distance: null,
      cum_up_elevation: null,
      cum_down_elevation: null,
      route_coef: null,
      publisher: null,
      climbed: null,
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
    ...mapGetters(["getHasClimbedById", "getRoutes"]),
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
          filter: value => this.filterUseIncrements(value, 'start_point_elevation', FILTER_RANGE_ELEVATION),
        },
        { text: 'ルート最高地点（地名）', value: 'highest_point_name' },
        { text:
          'ルート最高地点（標高）',
          value: 'highest_point_elevation',
          filter: value => this.filterUseIncrements(value, 'highest_point_elevation', FILTER_RANGE_ELEVATION),
        },
        { text: '終了地点（地名）', value: 'end_point_name' },
        {
          text: '終了地点（標高）',
          value: 'end_point_elevation',
          filter: value => this.filterUseIncrements(value, 'end_point_elevation', FILTER_RANGE_ELEVATION),
          },
        {
          text: 'コースタイム',
          value: 'course_time',
          filter: value => this.filterUseIncrements(value, 'course_time', FILTER_RANGE_TIME),
          },
        {
          text: 'ルート長',
          value: 'distance',
          filter: value => this.filterUseIncrements(value, 'distance', FILTER_RANGE_DISTANCE),
          },
        {
          text: '累計登り標高差',
          value: 'cum_up_elevation',
          filter: value => this.filterUseIncrements(value, 'cum_up_elevation', FILTER_RANGE_CUM_ELEVATION),
          },
        {
          text: '累計下り標高差',
          value: 'cum_down_elevation',
          filter: value => this.filterUseIncrements(value, 'cum_down_elevation', FILTER_RANGE_CUM_ELEVATION),
        },
        {
          text: 'ルート係数',
          value: 'route_coef',
          filter: value => this.filterUseIncrements(value, 'route_coef', FILTER_RANGE_ROUTE_COEF),
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
    selectItems() {
      return {
        physical:                 [{value: null, name: ""}, ...PHYSICAL.map((v,i) => ({value: i+1, name: v}))],
        technological:            [{value: null, name: ""}, ...TECHNOLOGICAL.map((v,i) => ({value: i+1, name: v}))],
        start_point_elevation:    this.createSelecrItems(FILTER_RANGE_ELEVATION),
        highest_point_elevation:  this.createSelecrItems(FILTER_RANGE_ELEVATION),
        end_point_elevation:      this.createSelecrItems(FILTER_RANGE_ELEVATION),
        course_time:              this.createSelecrItems(FILTER_RANGE_TIME),
        distance:                   this.createSelecrItems(FILTER_RANGE_DISTANCE),
        cum_up_elevation:         this.createSelecrItems(FILTER_RANGE_CUM_ELEVATION),
        cum_down_elevation:       this.createSelecrItems(FILTER_RANGE_CUM_ELEVATION),
        route_coef:               this.createSelecrItems(FILTER_RANGE_ROUTE_COEF),
        publisher:                [{value: null, name: ""}, ...PUBLISHER_ITEMS],
        climbed:                  [{value: null}, ...CLIMBED_ICON_ITEMS],
      }
    },
  },
  mounted() {
    this.routes = this.getRoutes();
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (['initRouteMap', 'setRouteMap', 'deleteRouteMap'].includes(mutation.type)) {
        this.routes = this.getRoutes();
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
    filterBySelectedName(dataValue, key) {
      let selectedValue = this.selectedValues[key];
      let items = this.selectItems[key];
      // 未選択はすべてtrue
      if (!selectedValue) return true;
      // セレクトの中から選択した項目の比較をする、セレクトで選んだ値がvalueでデータの値がnameに相当するので両方確認する
      return items.some(item => item.value === selectedValue && item.name === dataValue);
    },
    // ○○～○○の範囲を選択するフィルタ：一致したものを表示する、0～10の場合は0以上、10以下
    filterUseIncrements(dataValue, key, range) {
      let selectedValue = this.selectedValues[key];
      let items = this.selectItems[key];
      // 未選択はすべてtrue
      if (!selectedValue) return true;
      // 選択した値が配列の一番最後だった場合、「以上」のチェックだけする
      if (selectedValue === (items.length-1)) return range.max <= dataValue;
      // 範囲内にデータの値があるか確認する
      return range.increments*(selectedValue-1) <= dataValue && dataValue <= range.increments*selectedValue;
    },
    // 登頂チェックのフィルタ
    filterClimbed(key, item) {
      let selectedValue = this.selectedValues[key];
      // 未選択はすべてtrue
      if (selectedValue === null) return true;
      // 登頂チェックに値があるか確認
      let targetClimbed = this.getHasClimbedById(item.id);
      return selectedValue ? targetClimbed : !targetClimbed;
    },
    clickDeleteIcon(target) {
      this.deleteDialog.target = target;
      this.deleteDialog.isShow = true;
    },
    // 「○○～○○」「○○～」の範囲のセレクトの選択肢を作成
    createSelecrItems(range) {
      const arr = [{value: 0, name: ""}];
      let i;
      for(i=1; i*range.increments <= range.max; i++) {
        arr.push({
          value: i,
          name: (range.increments*(i-1)) + "～" + (range.increments*i)
        });
      }
      // 末尾は「○○～」にする
      arr.push({value: i, name: range.max + "～"});
      return arr;
    }
  },
}
</script>
