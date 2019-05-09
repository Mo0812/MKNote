<template>
    <div id="app" class="d-flex flex-column">
        <header>
            <Navbar/>
        </header>
        <template>
            <main class="flex-fill">
                <b-container fluid>
                    <router-view/>
                </b-container>
            </main>
        </template>
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
