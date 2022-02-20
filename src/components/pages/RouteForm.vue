<template>
  <div>
    <v-container>
      <h1>This is a RouteForm page</h1>
      <v-row>
        <v-col>
          <CardRouteFormVue/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CardRouteFormVue from '../parts/CardRouteForm.vue';

export default {
    components: {CardRouteFormVue},
}

</script>