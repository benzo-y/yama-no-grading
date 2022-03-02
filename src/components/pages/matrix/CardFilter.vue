<template>
  <v-card>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="8">
        <v-select
          v-model="locationValue"
          multiple
          chips
          dense
          :items="locationItem"
          item-text="name"
          item-value="id"
          label="地域"
          @change="changeLocation"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="climbedValue"
          multiple
          chips
          dense
          :items="climbedItem"
          item-text="name"
          item-value="id"
          prepend-inner-icon="mdi-trophy"
          @change="changeClimbed"
        >
        </v-select>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data: () => ({
      locationItem: [
        {id:"shinshu", name:"信州"},
        {id:"yamanashi", name:"山梨"},
        {id:"shizuoka", name:"静岡"},
        {id:"gunma", name:"群馬"},
        {id:"gifu", name:"岐阜"},
        {id:"tochigi", name:"栃木"},
        {id:"ishizuchisankei", name:"石鎚山系"},
        {id:"akita", name:"秋田"},
        {id:"toyama", name:"富山"},
        {id:"hyaku", name:"百名山"},
        {id:"other", name:"その他"}
      ],
      climbedItem: [
        {id:"on", name:'on'},
        {id:"off", name:'off'},
      ],
      locationValue: [],
      climbedValue: [],
  }),
  methods: {
    changeLocation () {
      this.$emit('update:changeLocation', this.locationValue)
    },
    changeClimbed () {
      this.$emit('update:changeClimbed', this.climbedValue)
    },
  },
}
</script>