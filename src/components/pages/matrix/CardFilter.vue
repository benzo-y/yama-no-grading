<template>
  <v-card>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="8">
        <v-select
          v-model="publisherValue"
          multiple
          chips
          dense
          :items="publisherItem"
          item-text="name"
          item-value="value"
          label="発行元"
          @change="changePublisher"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="climbedValue"
          multiple
          chips
          dense
          :items="climbedItem"
          item-value="value"
          @change="changeClimbed"
        >
          <template v-slot:[`label`]>
            <v-icon style="height: 100%;">mdi-trophy-outline</v-icon>
          </template>
          <template v-slot:[`selection`]="{ item }">
            <v-icon v-if="item.color" :color="item.color" class="mx-1">mdi-trophy</v-icon>
            <span v-else></span>
          </template>
          <template v-slot:[`item`]="{ item }">
            <v-icon v-if="item.color" :color="item.color">mdi-trophy</v-icon>
            <span v-else></span>
          </template>
        </v-select>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-card>
</template>

<script>
import { PUBLISHER_ITEMS, CLIMBED_ICON_ITEMS } from "../../../const/const"

export default {
  data: () => ({
      publisherItem: PUBLISHER_ITEMS,
      climbedItem: CLIMBED_ICON_ITEMS,
      publisherValue: [],
      climbedValue: [],
  }),
  methods: {
    changePublisher () {
      this.$emit('update:changePublisher', this.publisherValue)
    },
    changeClimbed () {
      this.$emit('update:changeClimbed', this.climbedValue)
    },
  },
}
</script>