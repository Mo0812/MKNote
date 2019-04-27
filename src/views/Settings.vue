<template>
    <section class="settings mt-3">
        <h2>{{$t("settings.title")}}</h2>
        <SettingSection
            id="settings-lang"
            :label="$t('settings.language')"
            labelFor="setting-lang-select"
        >
            <b-form-select
                v-model="settings.lang"
                :options="options.lang"
                :size="settings.size"
                id="setting-lang-select"
                @change="onChange"
            />
        </SettingSection>
        <SettingSection
            id="settings-display-size"
            :label="$t('settings.displaySize')"
            labelFor="setting-display-size-select"
        >
            <b-form-select
                v-model="settings.size"
                :options="options.size"
                :size="settings.size"
                id="setting-lang-select"
                @change="onChange"
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
            settings: {
                lang: null,
                size: null
            },
            options: {
                lang: [
                    { value: "en", text: "English" },
                    { value: "de", text: "Deutsch" }
                ],
                size: [
                    { value: "sm", text: "klein" },
                    { value: "", text: "normal" },
                    { value: "lg", text: "groß" }
                ]
            }
        };
    },
    watch: {
        settings: {
            handler(newSettings, oldSettings) {
                if (newSettings.lang === oldSettings.lang) {
                    this.$moment.locale(newSettings.lang);
                    this.$i18n.locale = newSettings.lang;
                }
            },
            deep: true
        }
    },
    created() {
        this.getSettings();
    },
    methods: {
        getSettings() {
            this.settings = this.$store.getters.getSettings;
        },
        onChange(evt) {
            this.$store.dispatch("settings", this.settings);
        }
    }
};
</script>
