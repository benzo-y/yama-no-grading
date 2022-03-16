<template>
  <v-dialog
    v-model="isShow"
    width="400px"
    @click:outside="cliclOutside()"
  >
    <v-card>
      <v-card-title>
        <strong>{{deleteTarget.name}}</strong>を削除しますか？
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn
          color="error"
          @click="clickDelete()"
        >
          削除
        </v-btn>
        <v-btn
          @click="clickCancel()"
        >
          キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: {
    isShow: {type: Boolean},
    deleteTarget: {type: Object},
  },
  methods: {
    ...mapActions(["deleteRoute", "deleteClimbedId"]),
    clickDelete() {
      this.deleteRoute(this.deleteTarget);
      this.deleteClimbedId(this.deleteTarget.id);
      this.$emit('update:isShow', false);
    },
    clickCancel() {
      this.$emit('update:isShow', false);
    },
    cliclOutside() {
      this.$emit('update:isShow', false);
    },
  },
}
</script>