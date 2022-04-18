<template>
  <v-container text-center>
    <v-row justify="center">
      <v-col cols="12">
        <h1>山のグレーディング</h1>
      </v-col>
      <v-col cols="8">
        <div class="container text-left">
          <p>
            各自治体が発行した、「山のグレーディング」をまとめたサイトです。Googleアカウントでログインしてください。
          </p>
          <ul>
            <li>
              本サイトはPC推奨です。スマホの場合、デザインが大きく崩れます。
            </li>
            <li>
              群馬県、岐阜県のデータは、2016年の発行されたデータになります。
            </li>
          </ul>
        </div>
        <div>
          <v-btn color="info" @click="login">
            Googleアカウントでログイン
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions } from "vuex"

export default {
  methods: {
    ...mapActions(['login'])
  }
}
</script>