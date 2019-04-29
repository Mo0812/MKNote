<template>
    <b-navbar toggleable="md" type="light" variant="light" fixed="top">
        <b-navbar-brand href="#">MK Notes</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#" to="/">{{$t("navbar.notes")}}</b-nav-item>
                <b-nav-item href="#" to="/snippets" disabled>{{$t("navbar.snippets")}}</b-nav-item>
                <b-nav-item href="#" to="/about">{{$t("navbar.about")}}</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                        <font-awesome-icon icon="user-circle" class="mr-1"/>
                        {{$t("navbar.user")}}
                    </template>
                    <b-dropdown-item href="#" disabled>
                        <font-awesome-icon icon="code-branch" class="mr-1"/>
                        {{version}}
                    </b-dropdown-item>
                    <b-dropdown-divider/>
                    <b-dropdown-item href="#" to="/profile">
                        <font-awesome-icon icon="id-badge" class="mr-1"/>
                        {{$t("navbar.profile")}}
                    </b-dropdown-item>
                    <b-dropdown-item href="#" to="/settings">
                        <font-awesome-icon icon="cog" class="mr-1"/>
                        {{$t("navbar.settings")}}
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="lock">
                        <font-awesome-icon icon="lock" class="mr-1"/>
                        {{$t("navbar.lock")}}
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    name: "Navbar",
    computed: {
        version() {
            return "Version: " + process.env.VUE_APP_VERSION;
        }
    },
    methods: {
        lock() {
            this.$store.dispatch("lock");
        }
    }
};
</script>
