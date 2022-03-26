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
          <!-- ルート名称のテキストボックス（登録・編集のみ表示） -->
          <v-text-field
            v-if="item.type==='title' && mode==='edit'"
            :label="item.label"
            :key="property"
            v-model="route[property]"
            :rules="rules[property]"
          >
          </v-text-field>
          <!-- 各名称のテキストボックス -->
          <v-text-field
            v-if="item.type==='text'"
            :label="item.label"
            :key="property"
            v-model="route[property]"
            :rules="rules[property]"
            :readonly="mode==='read'"
          >
          </v-text-field>
          <!-- 各数値のテキストボックス -->
          <v-text-field
            v-if="item.type==='number'"
            :label="item.label"
            :key="property"
            v-model.number="route[property]"
            :rules="rules[property]"
            :readonly="mode==='read'"
            type="number"
            min="0"
            :max="item.max"
          >
          </v-text-field>
          <!-- 自動計算（体力度、ルート係数）のテキストボックス -->
          <v-text-field
            v-if="item.type==='auto'"
            :label="item.label"
            :key="property"
            v-model.number="autoInputValues[property]"
            readonly
            placeholder="自動で計算されます。"
          >
          </v-text-field>
          <!-- 技術的難易度のセレクトボックス -->
          <v-select
            v-if="item.type==='select'"
            :label="item.label"
            :key="property"
            v-model="route[property]"
            :rules="rules[property]"
            :readonly="mode==='read'"
            :items="item.items"
          >
          </v-select>
          <!-- 発行元（参照時のみ表示） -->
          <v-text-field
            v-if="!item.type && mode==='read'"
            :label="item.label"
            :key="property"
            v-model="route[property]"
            :rules="rules[property]"
            readonly
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
import { TECHNOLOGICAL } from "../../const/const"

const MAX_TEXT = 100;
const MAX_ELEVATION = 8848;
const MAX_TIME = 1000;
const MAX_DISTANCE = 10000;
const MAX_CUM_ELEVATION = 100;

export default {
  components: {IconClimbed},
  data: () => ({
    route: {},
    form: {
      name : {
        label: 'ルート名称',
        type: 'title',
      },
      physical : {
        label:'体力度',
        type: 'auto',
        valueName: ''
      },
      technological : {
        label:'技術的難易度',
        type: 'select',
        items: TECHNOLOGICAL,
      },
      start_point_name : {
        label:'スタート地点 地名',
        type: 'text',
      },
      start_point_elevation : {
        label:'スタート地点 標高（m）',
        type: 'number',
        max: MAX_ELEVATION,
      },
      highest_point_name : {
        label:'最高地点 名称',
        type: 'text',
      },
      highest_point_elevation : {
        label:'最高地点 標高（m）',
        type: 'number',
        max: MAX_ELEVATION,
      },
      end_point_name : {
        label:'終了地点 名称',
        type: 'text',
      },
      end_point_elevation : {
        label:'終了地点 標高（m）',
        type: 'number',
        max: MAX_ELEVATION,
      },
      course_time : {
        label:'コースタイム（h）',
        type: 'number',
        max: MAX_TIME,
      },
      distance : {
        label:'ルート長（km）',
        type: 'number',
        max: MAX_DISTANCE,
      },
      cum_up_elevation : {
        label:'累計登り標高差（km）',
        type: 'number',
        max: MAX_CUM_ELEVATION,
      },
      cum_down_elevation : {
        label:'累計下り標高差（km）',
        type: 'number',
        max: MAX_CUM_ELEVATION,
      },
      route_coef : {
        label:'ルート係数',
        type: 'auto',
      },
      publisher : {
        label:'発行元',
      },
    },
  }),
  props: {
    id: {type: String},
    mode: {type: String},
  },
  computed: {
    ...mapGetters(["getRouteById"]),
    autoInputValues() {
      let physical, route_coef
      if(this.route.course_time && this.route.distance && this.route.cum_up_elevation && this.route.cum_down_elevation) {
        // 体力度とルート係数の計算
        route_coef = this.route.course_time*1.8 + this.route.distance*0.3 +
          this.route.cum_up_elevation*10.0 + this.route.cum_down_elevation*0.6;
        physical = route_coef/10 < 10 ? Math.floor(route_coef/10) : 10;
      }
      return { physical, route_coef };
    },
    rules() {
      const rules = {};
      Object.entries(this.form).forEach(([key, value]) => {
        switch(value.type) {
          case "title":
          case "text":
            rules[key] = [v => (v && v.length <= MAX_TEXT) || `${MAX_TEXT}文字以内で値を入力してください。`,];
            break;
          case "number":
            rules[key] =  [v => (1 <= v && v <= value.max) || `1～${value.max}の範囲で値を入力してください。`,];
            break;
          case "select":
            rules[key] =  [v => !!v || '選択してください。',];
            break;
          default:
            rules[key] =  [];
        }
      });
      return rules;
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
      if (mutation.type === 'initRouteMap' && this.id) {
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
        this.$emit('update:clickOk', { ...this.route, ...this.autoInputValues });
      }
    },
  },
}
</script>