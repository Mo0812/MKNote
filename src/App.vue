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
import { setInterval } from "timers";

export default {
    components: {
        Navbar
    },
    created() {
        const vm = this;
        addEventListener("keydown", evt => {
            // Access command line
            if (evt.ctrlKey && evt.shiftKey && evt.keyCode === 80) {
            }
        });
    }
};
</script>
