<template>
    <div id="app" class="d-flex flex-column">
        <header>
            <Navbar/>
        </header>
        <template>
            <main class="flex-fill">
                <b-container class="h-100" fluid>
                    <router-view v-if="unlocked"/>
                    <Authentification v-else/>
                </b-container>
            </main>
        </template>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar/Navbar";
import Authentification from "@/components/Authentification/Authentification";

export default {
    components: {
        Navbar,
        Authentification
    },
    computed: {
        unlocked() {
            const security = this.$store.getters.getSecurity;
            return security.secret !== null;
        }
    }
};
</script>
