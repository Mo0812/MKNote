<template>
    <b-container fluid>
        <section class="settings">
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
    </b-container>
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
