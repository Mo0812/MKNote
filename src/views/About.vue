<template>
    <section class="about mt-3">
        <b-row>
            <b-col cols="12" md="6" offset-md="3">
                <b-row>
                    <b-col cols="12">
                        <h2 class="text-center">About</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="my-3">
                        <h3 class="text-center">What is MK Notes?</h3>
                        <p>
                            <i>MK Notes</i> is a simple note manager, which uses Markdown as a markup language.
                        </p>
                        <p>
                            Whats special about
                            <i>MK Notes</i> is, that it runs totaly local on your machine. All your note data is stored into your browsers local storage systems and gets encrypted with an AES encryption. In addition to that once you visited this site,
                            <i>MK Notes</i> installs itself as a
                            <i>Progressive Web App (PWA)</i>, which means you can use it even without a connection to the internet for days.
                        </p>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" md="6" class="my-5">
                        <GithubContent
                            title="Release Notes"
                            url="https://raw.githubusercontent.com/Mo0812/MKNote/master/CHANGELOG.md"
                        />
                    </b-col>
                    <b-col cols="12" md="6" class="my-5">
                        <GithubContent
                            title="Roadmap"
                            url="https://raw.githubusercontent.com/Mo0812/MKNote/master/ROADMAP.md"
                        />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" class="my-5">
                        <h3 class="text-center">Manual</h3>
                        <p class="text-center">More to come</p>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </section>
</template>

<script>
import GithubContent from "@/components/GithubContent/GithubContent";
export default {
    name: "about",
    components: {
        GithubContent
    }
};
</script>


