<template>
    <div id="app">
        <header>
            <Navbar/>
        </header>
        <main>
            <router-view/>
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
