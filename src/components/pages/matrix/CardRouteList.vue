<template>
  <v-card height="100%">
    <v-list dense >
      <v-list-item v-for="item in this.routes" :key="item.id" style="min-height: auto;">
        <v-list-item-icon class="mr-2 my-1">
          <IconClimbed :id="item.id"/>
        </v-list-item-icon>
        <v-list-item-content
          style="padding: 0;"
          @click="showDialog(item.id)"
        >
          {{item.name}}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-dialog
      v-model="dialog"
      v-if="dialog"
      width="75%"
    >
      <CardRouteForm :id="showRouteId" mode="read" :clickClose.sync="dialog"/>
    </v-dialog>
  </v-card>
</template>

<script>
import IconClimbed from "../../parts/IconClimbed.vue"
import CardRouteForm from "../../parts/CardRouteForm.vue"
export default {
  data: () => ({
    dialog: false,
    showRouteId: null,
  }),
  props: {
    routes: {type: Array},
  },
  components: {
    IconClimbed,
    CardRouteForm,
  },
  methods: {
    showDialog(id) {
      this.dialog = true;
      this.showRouteId = id;
    },
  },
}

</script>

<style>
</style>