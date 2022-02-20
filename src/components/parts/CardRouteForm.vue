<template>
  <v-card>
    <v-card-title>
      <div style="width:100%">
        {{route.name}}
        <v-icon class="float-right mr-4" color="yellow darken-3">mdi-trophy</v-icon>
        <v-icon class="float-right mr-4" color="grey lighten-1">mdi-trophy</v-icon>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form
        v-for="item, property in label"
        :key="property"
        class="mx-4"
      >
        <v-text-field
          v-model="route[property]"
          :label="item"
          readonly
        >
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn>
        戻る
      </v-btn>
      <v-btn color="primary">
        保存
      </v-btn>
      <v-btn>
        キャンセル
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  data: () => ({
    label: {
      name : 'ルート名称',
      physical : '体力度',
      technological : '技術的難易度',
      start_point_name : 'スタート地点 地名',
      start_point_elevation : 'スタート地点 標高',
      highest_point_name : '最高地点 名称',
      highest_point_elevation : '最高地点 標高',
      end_point_name : '終了地点 名称',
      end_point_elevation : '終了地点 標高',
      course_time : 'コースタイム',
      length : 'ルート長',
      cum_up_elevation : '累計登り標高差',
      cum_down_elevation : '累計下り標高差',
      route_coef : 'ルート係数',
      location : '地域',
    },
    route: {
      id : 'shinshu-1',
      name : 'ダミー ルート名',
      physical : 1,
      technological : 'A',
      start_point_name : 'ダミー スタート地点',
      start_point_elevation : 1234,
      highest_point_name : 'ダミー 最高地点',
      highest_point_elevation : 1234,
      end_point_name : 'ダミー ゴール名',
      end_point_elevation : 1234,
      course_time : '12:34',
      length : 12,
      cum_up_elevation : 1234,
      cum_down_elevation : 1234,
      route_coef : 1.2,
      location : '信州',
    },
    climbed: false
  })
}
</script>