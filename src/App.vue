<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-title>
        山のグレーディング
      </v-app-bar-title>
      <v-tabs
        centered
        class="ml-n9"
      >
        <v-tab
          v-for="link in links"
          :key="link.name" :to="{name: link.name}"
        >
          {{ link.label }}
        </v-tab>
      </v-tabs>

      <v-avatar
        color="orange"
        size="36"
      >仮</v-avatar>
    <v-btn
      color="blue-grey"
      class="ma-2 white--text"
    >
      ログアウト仮
      <v-icon
        right
      >
        mdi-logout
      </v-icon>
    </v-btn>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
  links: [
    {name: 'matrix', label: "マトリクス"},
    {name: 'routes', label: "リスト"},
    ]
  }),
};
</script>
