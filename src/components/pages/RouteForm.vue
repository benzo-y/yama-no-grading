<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <CardRouteFormVue
            mode="edit"
            :id="id"
            :clickCancel.sync="submitData"
            :clickOk.sync="submitData"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CardRouteFormVue from '../parts/CardRouteForm.vue';
import { mapActions } from 'vuex';

export default {
  components: {CardRouteFormVue},
  data:() => ({
    submitData: null,
  }),
  computed: {
    id() {
      return this.$route.params.route_id;
    },
  },
  methods: {
    ...mapActions([
      "addRoute",
      "updateRoute"
    ]),
  },
  watch: {
    submitData(value) {
      if(value) {
        if("id" in value) {
          // 変更
          this.updateRoute(value);
        } else {
          // 登録処理
          this.addRoute(value);
        }
      }
      this.$router.push({ name: 'routes' }, () => {});
    }
  }
}

</script>