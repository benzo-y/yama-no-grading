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
        v-if="$store.state.login_user"
      >
        <v-tab
          v-for="link in links"
          :key="link.name" :to="{name: link.name}"
        >
          {{ link.label }}
        </v-tab>
      </v-tabs>

      <v-avatar
        size="36"
        v-if="$store.state.login_user"
      >
        <img 
        :src="$store.state.login_user.photoURL"
          :alt="$store.state.login_user.displayName"
        />
      </v-avatar>
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        v-if="$store.state.login_user"
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
import { mapActions } from 'vuex';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'App',

  data: () => ({
  links: [
    {name: 'matrix', label: "マトリクス"},
    {name: 'routes', label: "リスト"},
    ]
  }),

  created () {
    // ログイン済み否か確認
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
        this.setLoginUser(user)
        this.$router.push({ name: 'matrix' }, () => {})
      } else {
        this.deleteLoginUser()
        this.$router.push({ name: 'login' }, () => {})
      }
    })
  },
  methods: {
    ...mapActions(['setLoginUser', 'deleteLoginUser'])
  }
};
</script>
