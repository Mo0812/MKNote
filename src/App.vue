<template>
    <div id="app" class="d-flex flex-column">
        <header>
            <Navbar/>
        </header>
        <main class="flex-fill">
            <b-container class="h-100" fluid>
                <router-view/>
            </b-container>
        </main>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar/Navbar";

export default {
    components: {
        Navbar
    }
};
</script>
