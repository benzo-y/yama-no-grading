<template>
  <v-card>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="8">
        <v-select
          v-model="selectedValue.publisher"
          multiple
          chips
          dense
          :items="publisherItem"
          item-text="name"
          item-value="value"
          label="発行元"
          @change="changePublisher"
        >
          <template v-slot:prepend-item>
            <v-list-item
              @mousedown.prevent
              @click="clickAll(changePublisher)"
              @mousedown="loaderToggle"
            >
              <v-list-item-action>
                <v-icon :color="selectAllIcon.color">
                  {{ selectAllIcon.icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  全て
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template v-slot:[`item`]="{ item, attrs, on }">
            <v-list-item
              v-on="on"
              v-bind="attrs"
              #default="{ active }"
              @mousedown="loaderToggle"
            >
              <v-list-item-action>
              <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{item.name}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedValue.climbed"
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
          <template v-slot:[`item`]="{ item, attrs, on }">
            <v-list-item
              v-on="on"
              v-bind="attrs"
              #default="{ active }"
              @mousedown="loaderToggle"
            >
              <v-list-item-action>
              <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon :color="item.color">mdi-trophy</v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-card>
</template>

<script>
import { PUBLISHER_ITEMS, CLIMBED_ICON_ITEMS } from "../../../const/const"
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    publisherItem: PUBLISHER_ITEMS,
    climbedItem: CLIMBED_ICON_ITEMS,
    selectedValue: {
      publisher: [],
      climbed: [],
    },
  }),
  computed: {
    ...mapGetters(["getMatrixFilterValue"]),
    isSelectedAllPublisher () {
      return this.selectedValue.publisher.length === this.publisherItem.length
    },
    selectAllIcon () {
      let icon = (() => {
        if (this.isSelectedAllPublisher) return 'mdi-close-box'
        if (this.selectedValue.publisher.length > 0 && !this.isSelectedAllPublisher) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      })();
      let color = this.selectedValue.publisher.length > 0 ? 'indigo darken-4' : '';
      return {icon, color};
    },
  },
  created() {
    this.selectedValue = this.getMatrixFilterValue();
  },
  methods: {
    ...mapActions(["setMatrixFilterValue", "loaderToggle"]),
    changePublisher () {
      this.setMatrixFilterValue(this.selectedValue);
      this.loaderToggle();
    },
    changeClimbed () {
      this.setMatrixFilterValue(this.selectedValue);
      this.loaderToggle();
    },
    clickAll(callback) {
      if (this.isSelectedAllPublisher) {
        this.selectedValue.publisher = []
      } else {
        this.selectedValue.publisher = this.publisherItem.map(item => item.value);
      }
      callback();
    },
  },
}
</script>