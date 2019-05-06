<template>
    <section class="profile option-container mt-3">
        <h2>{{$t("profile.title")}}</h2>
        <div class="option-group">
            <h3 class="header">{{$t("profile.encryption.title")}}</h3>
            <SettingSection
                id="profile-encryption-renew-secret-group"
                :label="$t('profile.encryption.renewSecret')"
            >
                <template v-if="!security.success">
                    <b-input-group v-if="!security.renew">
                        <b-input
                            id="profile-encryption-renew-current-secret"
                            :class="validClass"
                            type="password"
                            :placeholder="$t('profile.encryption.currentSecretInputPlaceholder')"
                            :state="security.valid"
                            :disabled="!encryptionEnabled"
                            v-model="security.currentSecret"
                        />
                        <b-input-group-append>
                            <b-button
                                variant="warning"
                                @click="validateSecret"
                            >{{$t("profile.encryption.currentSecretButtonText")}}</b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <template v-else>
                        <b-input
                            id="profile-encryption-renew-new-secret"
                            type="password"
                            class="my-1"
                            :class="validClass"
                            :placeholder="$t('profile.encryption.newSecretInputPlaceholder')"
                            :disabled="!encryptionEnabled"
                            :state="security.valid"
                            v-model="security.newSecret"
                        />

                        <b-input-group class="mt-1">
                            <b-input
                                id="profile-encryption-renew-new-secret-confirm"
                                type="password"
                                :class="validClass"
                                :placeholder="$t('profile.encryption.newSecretConfirmInputPlaceholder')"
                                :disabled="!encryptionEnabled"
                                :state="security.valid"
                                v-model="security.newSecretConfirm"
                            />
                            <b-input-group-append>
                                <b-button variant="danger" @click="renewSecret">
                                    <template v-if="security.busy">
                                        <b-spinner></b-spinner>
                                    </template>
                                    <template
                                        v-else
                                    >{{$t("profile.encryption.newSecretButtonText")}}</template>
                                </b-button>
                                <b-button
                                    variant="secondary"
                                    @click="abortSecretRenewal"
                                >{{$t("common.cancel")}}</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </template>
                </template>
                <template v-else>
                    <b-input
                        class="text-center"
                        value="Successfully renewed secret"
                        :plaintext="true"
                    ></b-input>
                </template>
            </SettingSection>
        </div>
        <div class="option-group">
            <h3 class="header">Remote & Sync</h3>
            <SettingSection id="profile-remote-enable-sync-group" label="Enable remote sync">
                <b-checkbox
                    v-model="remote.enabled"
                    name="profile-remote-enable-sync"
                    switch
                    @input="updateRemote"
                >Remote sync</b-checkbox>
            </SettingSection>
            <SettingSection id="profile-remote-url-group" label="Remote instance URL">
                <b-input-group>
                    <b-input
                        v-model="remote.url"
                        name="profile-remote-url"
                        placeholder="Remote URL"
                        :disabled="!remote.enabled"
                    />
                    <b-input-group-append>
                        <b-button
                            variant="primary"
                            :disabled="!remote.enabled"
                            @click="updateRemote"
                        >Connect</b-button>
                    </b-input-group-append>
                </b-input-group>
            </SettingSection>
            <SettingSection id="profile-remote-live-sync-group" label="Enable live sync">
                <b-checkbox
                    v-model="remote.liveSync"
                    name="profile-remote-live-sync"
                    :disabled="!remote.enabled"
                    switch
                    @input="updateRemote"
                >Live sync</b-checkbox>
            </SettingSection>
        </div>
    </section>
</template>

<script>
import SettingSection from "@/components/SettingSection/SettingSection";

export default {
    name: "profile",
    components: {
        SettingSection
    },
    data() {
        return {
            security: {
                renew: false,
                currentSecret: null,
                newSecret: null,
                newSecretConfirm: null,
                busy: false,
                success: false,
                valid: null
            },
            defaultSecurity: {
                renew: false,
                currentSecret: null,
                newSecret: null,
                newSecretConfirm: null,
                busy: false,
                success: false,
                valid: null
            },
            remote: {
                enabled: false,
                url: null,
                liveSync: true
            }
        };
    },
    computed: {
        encryptionEnabled() {
            const security = this.$store.getters.getSecurity;
            return security.secret !== null;
        },
        validClass() {
            return this.security.valid !== true && this.security.valid !== null
                ? "shake"
                : "";
        }
    },
    created() {
        this.getRemote();
    },
    methods: {
        getSecurity() {
            this.security = this.$store.getters.getSecurity;
        },
        async validateSecret() {
            this.security.valid = null;
            const response = await this.$store.dispatch(
                "authentificate",
                this.security.currentSecret
            );
            this.security.valid = response === true ? null : false;
            this.security.renew = response;
        },
        getRemote() {
            this.remote = this.$store.getters.getRemote;
        },
        async validateSecret() {
            this.security.valid = null;
            const response = await this.$store.dispatch(
                "authentificate",
                this.security.currentSecret
            );
            this.security.valid = response === true ? null : false;
            this.security.renew = response;
        },
        async renewSecret() {
            this.security.valid = null;
            if (this.security.newSecret === this.security.newSecretConfirm) {
                try {
                    this.security.valid = true;
                    this.security.busy = true;
                    await this.$store.dispatch("renewAuthentification", {
                        oldSecret: this.security.currentSecret,
                        newSecret: this.security.newSecret
                    });
                    this.security.busy = false;
                    this.security.success = true;
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                this.security.valid = false;
            }
        },
        abortSecretRenewal() {
            Object.assign(this.security, this.defaultSecurity);
        },
        async updateRemote() {
            try {
                await this.$store.dispatch("remote", this.remote);
            } catch (error) {
                this.remote.enabled = false;
                this.$bvToast.toast(error.message, {
                    title: "Remote connection",
                    variant: "danger"
                });
                console.log(error);
            }
        }
    }
};
</script>
