<template>
    <div>
        <header class="d-flex w-100 justify-content-between">
            <h5>{{title}}</h5>
            <small>{{time}}</small>
        </header>
        <!--<p class="excerpt mb-1">{{excerpt}}</p>-->
        <footer>
            <b-button variant="danger" size="sm" @click="removeAction($event)">
                <font-awesome-icon v-if="!remove.confirm" icon="trash"/>
                <template v-else>{{$t("common.sure")}}</template>
            </b-button>
            <b-button
                v-if="remove.confirm"
                variant="secondary"
                size="sm"
                class="ml-1"
                aria-label="close"
                @click="abortAction"
            >
                <span aria-hidden="true">&times;</span>
            </b-button>
        </footer>
    </div>
</template>
<script>
export default {
    name: "NoteTreeItem",
    props: ["title", "extra", "excerpt"],
    data() {
        return {
            remove: {
                confirm: false
            }
        };
    },
    computed: {
        time() {
            return this.$moment(this.extra).fromNow();
        }
    },
    methods: {
        removeAction(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.remove.confirm) {
                this.$emit("remove", evt);
                this.remove.confirm = false;
            } else {
                this.remove.confirm = true;
            }
        },
        abortAction(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.remove.confirm = false;
        }
    }
};
</script>
