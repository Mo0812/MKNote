<template>
    <b-navbar toggleable="md" type="light" variant="light">
        <b-navbar-brand href="#">MK Notes</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#" to="/">Notes</b-nav-item>
                <b-nav-item href="#" to="/snippets" disabled>Snippets</b-nav-item>
                <b-nav-item href="#" to="/about">About</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">User</template>
                    <b-dropdown-item href="#" disabled>Profile</b-dropdown-item>
                    <b-dropdown-item href="#" to="/settings">Settings</b-dropdown-item>
                    <b-dropdown-item href="#" disabled>Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    name: "Navbar"
};
</script>
