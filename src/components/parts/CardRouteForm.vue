<template>
  <v-card>
    <v-card-title>
      <div style="width:100%">
        {{route.name}}
        <IconClimbed :id="route.id" class="float-right mr-4"/>
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
      <v-btn v-if="mode==='read'" @click="clickClose">
        戻る
      </v-btn>
      <v-btn color="primary" v-if="mode==='edit'" @click="clickOk">
        保存
      </v-btn>
      <v-btn v-if="mode==='edit'" @click="clickCancel">
        キャンセル
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import IconClimbed from "./IconClimbed.vue"
import { mapGetters } from "vuex"

export default {
  components: {IconClimbed},
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
      publisher : '発行元',
    },
    route: {},
    climbed: false
  }),
  props: {
    id: {type: String},
    mode: {type: String},
  },
  computed: {
    ...mapGetters(["getRouteById"]),
  },
  created() {    
    this.route = this.getRouteById(this.id);
  },
  methods: {
    clickClose() {
      this.$emit('update:clickClose', false);
    },
    clickCancel() {
      this.$emit('update:clickCancel');
    },
    clickOk() {
      this.$emit('update:clickOk', this.route);
    },
  },
}
</script>