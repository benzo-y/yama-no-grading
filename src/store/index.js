import Vue from 'vue'
import Vuex from 'vuex'
import { GoogleAuthProvider, getAuth, signInWithRedirect, signOut } from "firebase/auth";
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../plugins/firebase';

// ダミーデータ
import dummy from '../dummyData/dummy.json';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    climbedIdSet: new Set(),
    routeMap: new Map(),
    matrixMap: new Map(),
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
    setRouteMap(state, routeMap) {
      state.routeMap = routeMap;
    },
    setMatrixMap(state, matrixMap) {
      state.matrixMap = matrixMap;
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
    async setRoutes({commit, getters}) {
      // デフォルトの山情報を取得
      let routesMap = new Map([
        ...Object.entries(dummy),
        ["other", []],
        ["all", []]
      ]);

      // fierbaseからusersが登録しているroutesコレクションを取得
      const othreArr = routesMap.get('other');
      const routeDocs = await getDocs(collection(db, "users", getters.uid, "routes"));
      routeDocs.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        data.location = "other";
        othreArr.push(data);
      });

      // すべて用の配列を設定
      const allArr = [];
      const matrixMap = new Map(); 
      routesMap.forEach((arr, key) => {
        // デフォルトの山情報にidとlocationを設定
        arr.forEach(obj => {
          obj.id = obj.id ? obj.id : key + "-" + obj.index;
          obj.location = key;

          const pref = obj.physical + "-" + obj.technological;

          // TODO:リファクタリング
          if(!matrixMap.has(pref)) {
            matrixMap.set(pref, new Map());
          }
          if(!matrixMap.get(pref).has("all")) {
            matrixMap.get(pref).set("all", [obj]);
          } else {
            matrixMap.get(pref).set(
              "all", 
              [...matrixMap.get(pref).get("all"), obj]
            );
          }
          if(!matrixMap.get(pref).has(key)) {
            matrixMap.get(pref).set(key, [obj]);
          } else {
            matrixMap.get(pref).set(
              key, 
              [...matrixMap.get(pref).get(key), obj]
            );
          }
        });
        allArr.push(...arr);
      });
      routesMap.set("all", allArr);

      // ステートの登頂チェックにデータを格納
      commit('setRouteMap', routesMap);
      commit('setMatrixMap', matrixMap);
    },

  },
  modules: {
  },
  getters: {
    uid: state => state.login_user ? state.login_user.uid : null,
    getHasClimbedById: state => id => state.climbedIdSet.has(id),
    climbedIdSet: state => state.climbedIdSet,
    matrixMap: state => state.matrixMap,
  }
})
