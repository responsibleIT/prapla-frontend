<script>
    import Test from "$lib/components/Test.svelte";
    import {words, user} from "$lib/store.js";

    let message = '';
    let getWordList = async (msg) => {
        try {
            const url = "https://cms-prapla.responsible-it.nl/api/list?spell=" + msg;
            const response = await fetch(url);
            const result = await response.json();

            message = "Hoi " + result[0]['student'] + ", klik hier om naar de lijst te gaan.";
            user.set(result[0]);


            result.shift();
            words.set(result);
        } catch (error) {
            message = "Helaas, dat is niet de magische spreuk."
        }
    }
</script>

<svelte:head>
    <title>Test</title>
    <meta name="description" content="About this app"/>
</svelte:head>

<div class="text-column">
    <h1>Druk op de knop en spreek jouw geheime woord</h1>
    <input type="text" on:change={(e) => getWordList(e.target.value) }>
    <a href="app/list">{message}</a>
</div>
