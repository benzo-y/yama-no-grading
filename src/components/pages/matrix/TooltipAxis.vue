<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-card
        height="100%"
        v-bind="attrs"
        v-on="on"
      >
        {{item.body}}
      </v-card>
    </template>
    <span v-html="item.tooltip"></span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    item: {type: Object}
  },
}
</script>