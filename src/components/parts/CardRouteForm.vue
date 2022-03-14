<template>
  <v-card>
    <v-card-title>
      <div v-if="route.id" style="width:100%">
        <template v-if="mode==='read'">{{route.name}}</template>
        <template v-if="mode==='edit'">編集</template>
        <IconClimbed :id="route.id" class="float-right mr-4"/>
      </div>
      <div v-else>新規登録</div>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        class="mx-4"
      >
        <template
          v-for="item, property in form"
        >
          <v-text-field
            v-if="item.type==='text'"
            v-model="route[property]"
            :label="item.label"
            :rules="item.rules"
            :readonly="mode==='read'"
            :key="property"
          >
          </v-text-field>
          <v-text-field
            v-if="item.type==='number'"
            type="number"
            min="0"
            :max="item.max"
            v-model.number="route[property]"
            :label="item.label"
            :rules="item.rules"
            :readonly="mode==='read'"
            :key="property"
          >
          </v-text-field>
          <v-text-field
            v-if="item.type==='auto'"
            v-model.number="autoInputValues[property]"
            :label="item.label"
            readonly
            placeholder="自動で計算されます。"
            :key="property"
          >
          </v-text-field>
          <v-select
            v-if="item.type==='select'"
            :items="item.items"
            v-model="route[property]"
            :label="item.label"
            :rules="item.rules"
            :readonly="mode==='read'"
            :key="property"
          >
          </v-select>
          <v-text-field
            v-if="!item.type && mode==='read'"
            v-model="route[property]"
            :label="item.label"
            :rules="item.rules"
            readonly
            :key="property"
          >
          </v-text-field>
        </template>
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
    form: {
      name : {
        label: 'ルート名称',
        type: 'text',
        rules: [
          v => (v && v.length <= 100) || '100文字以内で値を入力してください。',
        ],
      },
      physical : {
        label:'体力度',
        type: 'auto',
        valueName: ''
      },
      technological : {
        label:'技術的難易度',
        type: 'select',
        items: ["A","B","C","D","E"],
        rules: [
          v => !!v || '選択してください。',
        ],
      },
      start_point_name : {
        label:'スタート地点 地名',
        type: 'text',
        rules: [
          v => (v && v.length <= 100) || '100文字以内で値を入力してください。',
        ],
      },
      start_point_elevation : {
        label:'スタート地点 標高（m）',
        type: 'number',
        max: 8848,
        rules: [
          v => (1 <= v && v <= 8848) || '1～8848の範囲で値を入力してください。',
        ],
        },
      highest_point_name : {
        label:'最高地点 名称',
        type: 'text',
        rules: [
          v => (v && v.length <= 100) || '100文字以内で値を入力してください。',
        ],
      },
      highest_point_elevation : {
        label:'最高地点 標高（m）',
        type: 'number',
        max: 8848,
        rules: [
          v => (1 <= v && v <= 8848) || '1～8848の範囲で値を入力してください。',
        ],
      },
      end_point_name : {
        label:'終了地点 名称',
        type: 'text',
        rules: [
          v => (v && v.length <= 100) || '100文字以内で値を入力してください。',
        ],
      },
      end_point_elevation : {
        label:'終了地点 標高（m）',
        type: 'number',
        max: 8848,
        rules: [
          v => (1 <= v && v <= 8848) || '1～8848の範囲で値を入力してください。',
        ],
      },
      course_time : {
        label:'コースタイム（h）',
        type: 'number',
        max: 1000,
        rules: [
          v => (1 <= v && v <= 1000) || '1～1000の範囲で値を入力してください。',
        ],
      },
      length : {
        label:'ルート長（km）',
        type: 'number',
        max: 10000,
        rules: [
          v => (1 <= v && v <= 10000) || '1～10000の範囲で値を入力してください。',
        ],
      },
      cum_up_elevation : {
        label:'累計登り標高差（km）',
        type: 'number',
        max: 1000,
        rules: [
          v => (1 <= v && v <= 1000) || '1～1000の範囲で値を入力してください。',
        ],
      },
      cum_down_elevation : {
        label:'累計下り標高差（km）',
        type: 'number',
        max: 1000,
        rules: [
          v => (1 <= v && v <= 1000) || '1～1000の範囲で値を入力してください。',
        ],
      },
      route_coef : {
        label:'ルート係数',
        type: 'auto',
      },
      publisher : {
        label:'発行元',
      },
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
    autoInputValues() {
      let physical, route_coef
      if(this.route.course_time && this.route.length && this.route.cum_up_elevation && this.route.cum_down_elevation) {
        route_coef = this.route.course_time*1.8 + this.route.length*0.3 +
          this.route.cum_up_elevation*10.0 + this.route.cum_down_elevation*0.6;
        physical = route_coef/10 < 10 ? Math.floor(route_coef/10) : 10;
      }
      return { physical, route_coef };
    }
  },
  created() {
    if (this.id) {
      this.route = { ...this.getRouteById(this.id) };
    }
  },
  mounted() {
    // stateの値の変更を検知する（ミューテーション実行後の値を取得）
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'setRouteMap' && this.id) {
        this.route = { ...this.getRouteById(this.id) };
      }
    });
  },
  methods: {
    clickClose() {
      this.$emit('update:clickClose', false);
    },
    clickCancel() {
      this.$emit('update:clickCancel');
    },
    clickOk() {
      if(this.$refs.form.validate()) {
        this.$emit('update:clickOk', {...this.route, ...this.autoInputValues });
      }
    },
  },
}
</script>