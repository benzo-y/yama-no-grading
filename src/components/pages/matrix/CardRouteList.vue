<template>
  <v-card height="100%">
    <v-list dense >
      <v-list-item v-for="item in this.routes" :key="item.id" style="min-height: auto;">
        <v-dialog
          v-model="dialog"
          width="75%"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon class="mr-2 my-1">
              <IconClimbed :id="item.id"/>
            </v-list-item-icon>
            <v-list-item-content
              style="padding: 0;"
              v-bind="attrs"
              v-on="on"
            >
              {{item.name}}
            </v-list-item-content>
          </template>
          <CardRouteForm/>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            閉じる
          </v-btn>
        </v-dialog>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import IconClimbed from "../../parts/IconClimbed.vue"
import CardRouteForm from "../../parts/CardRouteForm.vue"
export default {
  data: () => ({
    dialog: false
  }),
  props: {
    routes: {type: Array},
  },
  components: {
    IconClimbed,
    CardRouteForm,
  },
}

</script>

<style>
</style>