import Vue from 'vue'
import Vuex from 'vuex'
import { GoogleAuthProvider, getAuth, signInWithRedirect, signOut } from "firebase/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    climbedIdSet: new Set(),
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user;
    },
    deleteLoginUser(state) {
      state.login_user = null;
    },
    addClimbedId(state, id) {
      state.climbedIdSet.add(id);
    },
    deleteClimbedId(state, id) {
      state.climbedIdSet.delete(id);
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
      commit('deleteLoginUser');
    },
    addClimbedId({commit}, id) {
      // TODO:fierbaseの更新処理
      // ステートの登頂チェックにルートのIDを追加
      commit('addClimbedId', id);
    },
    deleteClimbedId({commit}, id) {
      // TODO:fierbaseの更新処理
      // ステートの登頂チェックにルートのIDを削除
      commit('deleteClimbedId', id);
    },
  },
  modules: {
  },
  getters: {
    hasClimbed: state => id => state.climbedIdSet.has(id)
  }
})
