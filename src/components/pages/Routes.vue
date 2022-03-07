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
  export default {
    data: () => ({
      search: '',
      physical: '',
      routes: [
        {"index":1,"name":"大朝日岳（古寺鉱泉口）","physical":5,"technological":"B","start_point_name":"古寺鉱泉口","start_point_elevation":675,"highest_point_name":"大朝日岳","highest_point_elevation":1871,"end_point_name":"古寺鉱泉口","end_point_elevation":675,"course_time":10.3,"length":18.1,"cum_up_elevation":2.02,"cum_down_elevation":2.02,"route_coef":45.3,"location":"山形県","id":"shinshu-1"},
        {"index":2,"name":"【周】大朝日岳（朝日鉱泉口）＜中ツル尾根・鳥原山＞","physical":5,"technological":"B","start_point_name":"朝日鉱泉","start_point_elevation":555,"highest_point_name":"大朝日岳","highest_point_elevation":1871,"end_point_name":"朝日鉱泉","end_point_elevation":555,"course_time":11.5,"length":19.5,"cum_up_elevation":1.87,"cum_down_elevation":1.87,"route_coef":46.4,"location":"山形県","id":"shinshu-2"},
        {"index":3,"name":"【縦】西吾妻山（リフト終点）＜かもしか展望台・若女平＞","physical":2,"technological":"B","start_point_name":"リフト終点","start_point_elevation":1820,"highest_point_name":"西吾妻山","highest_point_elevation":2035,"end_point_name":"若女平登山口","end_point_elevation":863,"course_time":4.8,"length":9.1,"cum_up_elevation":0.54,"cum_down_elevation":1.5,"route_coef":17.7,"location":"山形県","id":"shinshu-3"},
      ],
    }),
    computed: {
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
          { text: 'アクション', value: 'action' },
        ]
      },
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
