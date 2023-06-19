<script>
    import {words, user, quiz} from "$lib/store.js";
    import Button from "$lib/components/Button.svelte";
    import {browser} from '$app/environment';


    let speechSynthesis;
    if (browser) {
        speechSynthesis = window.speechSynthesis;
    }
    let message = '';
    let hasStarted = false;
    let auth = false;

    let getWordList = async (msg) => {
        try {
            const url = "https://cms-prapla.responsible-it.nl/api/list?spell=" + msg;
            const response = await fetch(url);
            const result = await response.json();

            message = "Hoi " + result[0]['student'] + ", klik de knop om naar de lijst te gaan.";
            user.set(result[0]);


            result.shift();
            words.set(result[0]);
            quiz.set(result[1]);

            auth = true;
        } catch (error) {
            message = "Helaas, dat is niet de magische spreuk."
        }
    }

    function handleMic() {
        hasStarted = true;
    }

    if (browser) {
        const utterance = new SpeechSynthesisUtterance("Druk op de bovenste knop voor een willekeurige lijst... Of... druk op de onderste knop en spreek jouw geheime spreuk");
        utterance.lang = 'nl-NL';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;

        speechSynthesis.speak(utterance);
        utterance.onend = (event) => {
            document.getElementById("random-button").style.display = "flex";
            document.getElementById("spell-button").style.display = "flex";
        }
    }

    async function randomList() {
        hasStarted = true;

        let test_spells = [
            "oranje vliegen die bananen knijpen",
            "dunne honden die kersen kopen",
            "dikke katten die broodjes kopen",
            "groene koeien die taarten koken",
            "rode vlinders die taarten lenen",
            "grijze jongens die taarten pakken",
            "dunne spinnen die aardbeien koken"
        ]

        let random_spell = test_spells[Math.floor(Math.random() * test_spells.length)];
        await getWordList(random_spell);
    }
</script>

<svelte:head>
    <title>Prapla</title>
    <meta name="description" content="About this app"/>
</svelte:head>

<div class="flex flex-col justify-center items-center h-screen">
    <div class="flex justify-center items-center p-4 w-full" id="progress-header">
        <div class="grow"></div>
        <a href="/"
           class="flex justify-center items-center border-solid border-2 border-slate-400 p-3 m-3 h-10 rounded-full align-middle"><b
                class="text-slate-400">×</b></a>
    </div>
    <div class="grow"></div>
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-2xl text-center">{message}</h1>
        {#if !hasStarted}
            <h1 class="text-2xl text-center">Druk op de knop voor een willekeurige lijst</h1>
            <Button id="random-button"
                    style="display: none;"
                    on:click={randomList}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                </svg>
            </Button>
            <h1 class="text-2xl text-center m-8">of</h1>

            <h1 class="text-2xl text-center">Druk op de knop en spreek jouw geheime spreuk</h1>

            <Button
                    id="spell-button"
                    style="display: none;"
                    on:click={handleMic}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=2
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                </svg>
            </Button>
        {:else}
            {#if !auth}
                <input class="bg-gray-50 text-gray-900 text-sm border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                       type="text" on:change={(e) => getWordList(e.target.value) }>
            {:else}
                <a class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                   href="app/list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                    </svg>
                </a>
            {/if}
        {/if}
    </div>
    <div class="grow"/>
</div>
