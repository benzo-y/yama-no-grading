import Vue from 'vue'
import Vuex from 'vuex'
import { GoogleAuthProvider, getAuth, signInWithRedirect, signOut } from "firebase/auth";
import {
  doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, collection, arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from '../plugins/firebase';
import { PUBLISHER } from '../const/const'

// ダミーデータ
import gradingData from '../dummyData/gradingData';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    climbedIdSet: new Set(),
    routeMap: new Map(),
    matrixFilterValue: {
      publisher: Object.keys(PUBLISHER),
      climbed: [true, false],
    },
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user;
    },
    deleteLoginUser(state) {
      state.login_user = null;
    },
    setClimbedIds(state, ids) {
      state.climbedIdSet = new Set(ids);
    },
    addClimbedId(state, id) {
      state.climbedIdSet.add(id);
    },
    deleteClimbedId(state, id) {
      state.climbedIdSet.delete(id);
    },
    initRouteMap(state, routeMap) {
      state.routeMap = routeMap;
    },
    setRouteMap(state, route) {
      state.routeMap.set(route.id, route);
    },
    deleteRouteMap(state, id) {
      state.routeMap.delete(id);
    },
    setMatrixFilterValue(state, selectedValue) {
      state.matrixFilterValue = selectedValue;
    },
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
    async setClimbedIds({commit, getters}) {
      // fierbaseのusersドキュメントのclimbedIdsを取得
      const userRef = doc(db, "users", getters.uid);
      const userDoc = await getDoc(userRef);
      // ステートの登頂チェックにデータを格納
      commit('setClimbedIds', userDoc.get("climbedIds"));
    },
    async addClimbedId({commit, getters}, id) {
      // fierbaseのusersドキュメントのclimbedIdsからIDを取得
      const userRef = doc(db, "users", getters.uid);
      setDoc(userRef, {}, { merge: true });
      await updateDoc(userRef, {
        climbedIds: arrayUnion(id)
      });
      // ステートの登頂チェックにルートのIDを追加
      commit('addClimbedId', id);
    },
    async deleteClimbedId({commit,getters}, id) {
      // fierbaseのusersドキュメントのclimbedIdsからIDを削除
      const userRef = doc(db, "users", getters.uid);
      setDoc(userRef, {}, { merge: true });
      await updateDoc(userRef, {
        climbedIds: arrayRemove(id)
      });
      // ステートの登頂チェックにルートのIDを削除
      commit('deleteClimbedId', id);
    },
    async initRouteMap({commit, getters}) {
      const routeMap = new Map();
      // 各自治体のルート情報を作成
      Object.entries(gradingData).forEach(([publisherKey, routeArr]) => {
        routeArr.forEach(route => {
          route.id = publisherKey + "-" + route.index;
          route.publisherKey = publisherKey;
          route.publisher = PUBLISHER[publisherKey];
          // Mapに格納
          routeMap.set(route.id, route);
        })
      });

      // fierbaseからusersが登録しているroutesコレクションを取得
      const routeDocs = await getDocs(collection(db, "users", getters.uid, "routes"));
      routeDocs.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        data.publisherKey = "other";
        data.publisher = PUBLISHER.other;
        // Mapに格納
        routeMap.set(data.id, data);
      });

      // ステートのルート情報にデータを格納
      commit('initRouteMap', routeMap);
    },
    async addRoute({commit, getters}, route) {
      // fierbaseのusersのroutesコレクションに追加
      const routeDoc = await addDoc(collection(db, "users", getters.uid, "routes"), route);

      // 登録結果からストアに格納するデータを設定
      route.id = routeDoc.id;
      route.publisherKey = "other";
      route.publisher = PUBLISHER.other;

      // ステートのルート情報にデータを格納
      commit('setRouteMap', route);
    },
    async updateRoute({commit, getters}, route) {
      // fierbaseのusersのroutesコレクションの対象のドキュメントを上書きする
      await setDoc(doc(db, "users", getters.uid, "routes", route.id), route);

      // ステートのルート情報にデータを格納
      commit('setRouteMap', route);
    },
    async deleteRoute({commit, getters}, target) {
      // fierbaseのusersのroutesコレクションの対象のドキュメントを削除する
      await deleteDoc(doc(db, "users", getters.uid, "routes", target.id));

      // ステートのルート情報にデータを格納
      commit('deleteRouteMap', target.id);
    },
    setMatrixFilterValue({commit}, selectedValue) {
      commit('setMatrixFilterValue', selectedValue);
    },
  },
  modules: {
  },
  getters: {
    uid: state => state.login_user ? state.login_user.uid : null,
    getHasClimbedById: state => id => state.climbedIdSet.has(id),
    getRouteById: state => id => state.routeMap.get(id),
    getRoutes: state => () => {
      const obj = Object.fromEntries(state.routeMap);
      return Object.values(obj);
    },
    getRoutesByGrade: state => (phy, tech) => {
      const obj = Object.fromEntries(state.routeMap);
      const allRoutes = Object.values(obj);
      return allRoutes.filter(route => route.physical === phy && route.technological === tech);
    },
    getMatrixFilterValue: state => () => ({...state.matrixFilterValue}),
  },
})
