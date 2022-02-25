<template>
  <v-container class="text-sm-body-2">
    <v-row>
      <v-col cols="1">
        <v-card height="100%">
          体力度
        </v-card>
      </v-col>
      <v-col cols="11">
        <v-row v-for="n in 10" :key="n">
          <v-col cols="1">
            <v-card height="100%">
              {{n}}
            </v-card>
          </v-col>
          <v-col
            v-for="j in 5"
            :key="`${n}${j}`"
            class="col-11-5"
          >
            <v-card height="100%">
              <v-list dense >
                <v-list-item v-for="i in n*j*2" :key="i" style="min-height: auto;">
                  <v-list-item-content style="padding: 0;">
                    {{i}}-山ルート
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="11">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col
            v-for="i in 5"
            :key="i"
            class="col-11-5"
          >
            <v-card>
              {{i}}
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="11">
            <v-card>
              技術的難易度
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
  export default {
    data: () => ({ 
    }),
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