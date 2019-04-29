<template>
    <article class="option-article my-3 py-3">
        <b-form-group
            :id="id"
            label-cols-sm="4"
            :label="label"
            :label-for="labelFor"
            :description="description"
        >
            <slot></slot>
        </b-form-group>
    </article>
</template>
<script>
import "./SettingSection.scss";
export default {
    name: "SettingSection",
    props: ["id", "label", "labelFor", "description"]
};
</script>