<template>
  <v-card height="100%">
    <v-list dense >
      <v-list-item v-for="item in this.routes" :key="item.id" style="min-height: auto;">
        <v-list-item-icon class="mr-2 my-1">
          <IconClimbed :id="item.id"/>
        </v-list-item-icon>
        <v-list-item-content
          style="padding: 0;"
          @click="clickListItem(item.id)"
        >
          {{item.name}}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import IconClimbed from "../../parts/IconClimbed.vue"
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
  },
  methods: {
    clickListItem(id) {
      this.$emit('update:getSelectedRouteId', {isShow: true, id});
    },
  },
}

</script>

<style>
</style>