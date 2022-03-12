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
  watch: {
    submitData(value) {
      console.log(value);
      if (value) {
        // 登録処理
      }
      this.$router.push({ name: 'routes' }, () => {});
    }
  }
}

</script>