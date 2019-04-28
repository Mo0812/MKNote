<template>
    <b-row class="h-100 justify-content-center align-items-center text-center authentification">
        <b-col cols="6">
            <font-awesome-icon icon="lock" class="icon mb-3"/>
            <b-form @submit.prevent="authentificate" class="secret-form">
                <b-form-group
                    id="secret-group"
                    label="Please enter your secret to unlock the encrypted content:"
                    label-for="secret"
                    description
                >
                    <b-form-input
                        id="secret"
                        type="password"
                        placeholder="Your secret"
                        v-model="secret"
                    />
                </b-form-group>
                <b-button type="submit" variant="primary" class="secret-submit">Submit</b-button>
            </b-form>
        </b-col>
    </b-row>
</template>

<script>
import "./Authentification.scss";
export default {
    name: "Authentification",
    data() {
        return {
            secret: ""
        };
    },
    methods: {
        authentificate() {
            this.$store.dispatch("authentificate", this.secret);
        }
    }
};
</script>
