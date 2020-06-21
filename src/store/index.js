import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        tabbarTitle: '首页',
        openId: '',
        parkTicketDetail:{}  // 停车券信息
    },
    mutations: {
        changeTabbarTitle(state, n) {
            state.tabbarTitle = n;
        },
        changeOpenId(state, n) {
            state.openId = n;
        },
        changeParkTicketDetail(state, n) {
            state.parkTicketDetail = n;
        },
    },
    getters: {
        getTabbarTitle(state, getters) {
            return state.tabbarTitle;
        },
        getOpenId(state, getters) {
            return state.openId;
        },
        getParkTicketDetail(state, getters) {
            return state.openId;
        },
    }
})