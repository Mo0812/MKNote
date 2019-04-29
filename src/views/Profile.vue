<template>
    <section class="settings mt-3">
        <h2>{{$t("profile.title")}}</h2>
        <hr>
        <h3>{{$t("profile.encryption")}}</h3>
        <SettingSection
            id="profile-secret-current-group"
            :label="$t('profile.crypto')"
            labelFor="setting-crypto-input"
        >
            <b-input
                id="secret"
                type="password"
                placeholder="Your secret"
                v-model="security.secret"
            />
        </SettingSection>
        <SettingSection
            id="settings-crypto"
            :label="$t('settings.crypto')"
            labelFor="setting-crypto-input"
        >
            <b-input
                id="secret"
                type="password"
                placeholder="Your secret"
                v-model="security.secret"
            />
        </SettingSection>
        <SettingSection
            id="settings-crypto"
            :label="$t('settings.crypto')"
            labelFor="setting-crypto-input"
        >
            <b-input
                id="secret"
                type="password"
                placeholder="Your secret"
                v-model="security.secret"
            />
        </SettingSection>
    </section>
</template>

<script>
import SettingSection from "@/components/SettingSection/SettingSection";

export default {
    name: "settings",
    components: {
        SettingSection
    },
    data() {
        return {
            security: {
                secret: null
            }
        };
    },
    created() {
        this.getSecurity();
    },
    methods: {
        getSecurity() {
            this.security = this.$store.getters.getSecurity;
        }
    }
};
</script>
