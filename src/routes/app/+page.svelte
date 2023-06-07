<script>
    import {words, user, quiz} from "$lib/store.js";
    import Button from "$lib/components/Button.svelte";

    let message = 'Druk op de knop en spreek jouw geheime spreuk';
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

    let hasStarted = false;
    let auth = false;

    function handleMic() {
        hasStarted = true;
    }
</script>

<svelte:head>
    <title>Prapla</title>
    <meta name="description" content="About this app"/>
</svelte:head>

<div class="flex flex-col justify-center items-center h-screen">
    <h1 class="text-2xl text-center">{message}</h1>
    {#if !hasStarted}
        <Button
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
