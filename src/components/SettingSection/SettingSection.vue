<template>
    <article class="setting-section my-3 py-3">
        <b-form-group :id="id" label-cols-sm="4" :label="label" :label-for="labelFor">
            <slot></slot>
        </b-form-group>
    </article>
</template>
<script>
import "./SettingSection.scss";
export default {
    name: "SettingSection",
    props: ["id", "label", "labelFor"]
};
</script>