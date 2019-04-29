<template>
    <b-row class="h-100 justify-content-center align-items-center text-center authentification">
        <b-col cols="6">
            <template v-if="!init">
                <font-awesome-icon icon="lock" class="icon mb-3" :class="validClass"/>
                <b-form @submit.prevent="authentificate" class="secret-form">
                    <b-form-group
                        id="secret-group"
                        label="Please enter your secret to unlock the encrypted content:"
                        label-for="secret"
                        :state="valid"
                        invalid-feedback="Secret was not correct"
                    >
                        <b-form-input
                            id="secret"
                            type="password"
                            placeholder="Your secret"
                            :state="valid"
                            v-model="secret"
                        />
                    </b-form-group>
                    <b-button type="submit" variant="primary" class="secret-submit">Submit</b-button>
                </b-form>
            </template>
            <template v-else>
                <h3>MK Note</h3>
                <p>Before you start, you must to enter a secret which protects and encrypts your note data</p>
                <hr>
                <b-form
                    @submit.prevent="initAuthentification"
                    class="secret-form"
                    :class="validClass"
                >
                    <b-form-group
                        id="secret-group"
                        label="Please set a encryption secret initally:"
                        label-for="secret"
                        :state="valid"
                    >
                        <b-form-input
                            id="secret"
                            type="password"
                            placeholder="Your secret"
                            :state="valid"
                            v-model="secret"
                        />
                    </b-form-group>
                    <b-form-group
                        id="secret-confirm-group"
                        label="Please retype your choosen secret:"
                        label-for="secret-confirm"
                        :state="valid"
                        invalid-feedback="Given passwords do not match"
                    >
                        <b-form-input
                            id="secret-confirm"
                            type="password"
                            placeholder="Confirm your secret"
                            :state="valid"
                            v-model="secretConfirm"
                        />
                    </b-form-group>
                    <b-button type="submit" variant="primary" class="secret-submit">Submit</b-button>
                </b-form>
            </template>
        </b-col>
    </b-row>
</template>

<script>
import Api from "@/api/Api";
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
                    console.log(response);
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
