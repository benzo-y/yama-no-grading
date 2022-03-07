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
        :headers="headers"
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
            <td></td>
            <td>
              <v-text-field
                v-model="physical"
                type="number"
                label="Less than"
              ></v-text-field>
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

export default {
  data: () => ({
    search: '',
    physical: '',
    routes: [],
  }),
  components: {
    IconClimbed,
  },
  computed: {
    ...mapGetters(["routeMap"]),
    headers () {
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
          filter: value => {
            if (!this.physical) return true

            return value < parseInt(this.physical)
          },
        },
        { text: '技術的難易度', value: 'technological' },
        { text: 'スタート地点（地名）', value: 'start_point_name' },
        { text: 'スタート地点（標高）', value: 'start_point_elevation' },
        { text: 'ルート最高地点（地名）', value: 'highest_point_name' },
        { text: 'ルート最高地点（標高）', value: 'highest_point_elevation' },
        { text: '終了地点（地名）', value: 'end_point_name' },
        { text: '終了地点（標高）', value: 'end_point_elevation' },
        { text: 'コースタイム', value: 'course_time' },
        { text: 'ルート長', value: 'length' },
        { text: '累計登り標高差', value: 'cum_up_elevation' },
        { text: '累計下り標高差', value: 'cum_down_elevation' },
        { text: 'ルート係数', value: 'route_coef' },
        { text: '発行元', value: 'publisher' },
        { text: '登頂チェック', value: 'climbed' },
        { text: 'アクション', value: 'actions' },
      ]
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
  },
}
</script>
