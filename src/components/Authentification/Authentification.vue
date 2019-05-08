<template>
    <b-row class="h-100 justify-content-center align-items-center text-center authentification">
        <b-col cols="6">
            <template v-if="!init">
                <font-awesome-icon icon="lock" class="icon mb-3" :class="validClass"/>
                <b-form @submit.prevent="authentificate" class="secret-form">
                    <b-form-group
                        id="secret-group"
                        :label="$t('authentification.lockScreen.message')"
                        label-for="secret"
                        :state="valid"
                        invalid-feedback="Secret was not correct"
                    >
                        <b-form-input
                            id="secret"
                            type="password"
                            :placeholder="$t('authentification.lockScreen.unlockInputPlaceholder')"
                            :state="valid"
                            v-model="secret"
                        />
                    </b-form-group>
                    <b-button
                        type="submit"
                        variant="primary"
                        class="secret-submit"
                    >{{$t("authentification.lockScreen.unlockButtonText")}}</b-button>
                </b-form>
            </template>
            <template v-else>
                <h3>MK Note</h3>
                <p>{{$t("authentification.initScreen.message")}}</p>
                <hr>
                <b-form
                    @submit.prevent="initAuthentification"
                    class="secret-form"
                    :class="validClass"
                >
                    <b-form-group
                        id="secret-group"
                        :label="$t('authentification.initScreen.secretInputLabel')"
                        label-for="secret"
                        :state="valid"
                    >
                        <b-form-input
                            id="secret"
                            type="password"
                            :placeholder="$t('authentification.initScreen.secretInputPlaceholder')"
                            :state="valid"
                            v-model="secret"
                        />
                    </b-form-group>
                    <b-form-group
                        id="secret-confirm-group"
                        :label="$t('authentification.initScreen.secretConfirmInputLabel')"
                        label-for="secret-confirm"
                        :state="valid"
                        invalid-feedback="Given secrets do not match"
                    >
                        <b-form-input
                            id="secret-confirm"
                            type="password"
                            :placeholder="$t('authentification.initScreen.secretConfirmInputPlaceholder')"
                            :state="valid"
                            v-model="secretConfirm"
                        />
                    </b-form-group>
                    <b-button
                        type="submit"
                        variant="primary"
                        class="secret-submit"
                    >{{$t("authentification.initScreen.initButtonText")}}</b-button>
                </b-form>
            </template>
            <footer class="mt-5 mx-auto w-50">
                <hr>
                <b-link to="/about">{{$t("navbar.about")}}</b-link>
            </footer>
        </b-col>
    </b-row>
</template>

<script>
import "./Authentification.scss";

export default {
    name: "Authentification",
    data() {
        return {
            secret: "",
            secretConfirm: "",
            init: false,
            valid: null
        };
    },
    computed: {
        validClass() {
            return this.valid !== true && this.valid !== null ? "fail" : "";
        }
    },
    created() {
        this.authentificate(false);
    },
    methods: {
        async authentificate(validCheck = true) {
            try {
                if (validCheck) {
                    this.valid = true;
                }
                const response = await this.$store.dispatch(
                    "authentificate",
                    this.secret
                );
                if (!response && validCheck) {
                    this.valid = false;
                }
                if (response) {
                    this.$router.push("/");
                }
            } catch (error) {
                this.init = true;
                this.secret = "";
            }
        },
        async initAuthentification() {
            if (this.secret === this.secretConfirm) {
                try {
                    const response = await this.$store.dispatch(
                        "initAuthentification",
                        this.secret
                    );
                    if (response) {
                        this.$router.push("/about");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.valid = false;
            }
        }
    }
};
</script>
