import Vue from 'vue'
import Vuex from 'vuex'
import { GoogleAuthProvider, getAuth, signInWithRedirect, signOut } from "firebase/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user;
    },
    deleteLoginUser(state) {
      state.login_user = null;
    }
  },
  actions: {
    login() {
      // googleをプロバイダに使用してログイン（firebase sdk v9）
      const google_auth_provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithRedirect(auth, google_auth_provider)
    },
    logout() {
      const auth = getAuth();
      signOut(auth);
    },
    setLoginUser({commit}, user) {
      // ステートのログイン情報を更新
      commit('setLoginUser', user);
    },
    deleteLoginUser({commit}) {
      // ステートのログイン情報を削除
      commit('deleteLoginUser')
    }
  },
  modules: {
  }
})
