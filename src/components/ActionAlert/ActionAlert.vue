<template>
    <b-alert variant="primary" :show="show">
        <h5 class="alert-heading">{{title}}</h5>
        <hr>
        <p>{{content}}</p>
        <b-spinner v-if="busy" small label="Loading..." class="mx-auto mb-3 d-block"></b-spinner>
        <b-button v-if="actionShow" class="mx-auto d-block" @click="action()">{{actionContent}}</b-button>
    </b-alert>
</template>

<script>
export default {
    name: "ActionAlert",
    props: ["title", "content", "show", "busy", "actionShow", "actionContent"],
    methods: {
        action(value) {
            this.$emit("action", value);
        }
    }
};
</script>
