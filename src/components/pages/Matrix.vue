<template>
  <v-container class="text-sm-body-2 mt-5" fluid>
    <v-row>
      <v-col cols="12">
        <CardFilterVue/>
      </v-col>
      <v-col cols="12">
        <v-row v-for="phy in physical" :key="phy.grade">
          <v-col cols="1">
            <TooltipAxis :item="phy"/>
          </v-col>
          <v-col
            v-for="tech in technological"
            :key="`${phy.grade}${tech.grade}`"
            class="col-11-5"
          >
            <CardRouteListVue
              :grade="{physical: phy.grade, technological: tech.grade}"
              :getSelectedRouteId.sync="dialog"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col
            v-for="tech in technological"
            :key="tech.grade"
            class="col-11-5"
          >
            <TooltipAxis :item="tech"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog.isShow"
      v-if="dialog.isShow"
      width="75%"
    >
      <CardRouteForm
        mode="read"
        :id="dialog.id"
        :clickClose.sync="dialog.isShow"
      />
    </v-dialog>
  </v-container>
</template>


<script>
import CardRouteListVue from "./matrix/CardRouteList.vue";
import CardFilterVue from "./matrix/CardFilter.vue";
import CardRouteForm from "../parts/CardRouteForm.vue"
import TooltipAxis from "./matrix/TooltipAxis.vue";
import { MATRIX_AXIS } from "../../const/const";

export default {
  data: () => ({
    routes: [],
    physical: MATRIX_AXIS.physical,
    technological: MATRIX_AXIS.technological,
    dialog: {
      isShow: false,
      id: null,
    },
  }),
  components: {
    CardRouteListVue,
    CardFilterVue,
    CardRouteForm,
    TooltipAxis
  },
}
</script>

<style scoped>
.col-11-5 {
  /* 11colを5等分する */
  width: calc(100%*11/12/5);
  flex: 0 0 calc(100%*11/12/5);

position: relative;
	min-height: 1px;
	padding-right: 15px;
	padding-left: 15px;
}
</style>