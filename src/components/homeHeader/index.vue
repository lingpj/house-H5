<template>
    <div class="container">
        <mt-header>
            <mt-button slot="left">上海e通</mt-button>
            <mt-button slot="right">26℃</mt-button>
        </mt-header>
    </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
    name: '',

    data() {
        return {
        }
    },
    computed: {
        
    },

    methods: {}
}
</script>

<style lang='scss' scoped>
.container {
    display: none;
    height: 45.5px;
    &>* {
        height: 100%;
    }
}
</style>
