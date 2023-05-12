<script>
    import wordmark from '$lib/images/wordmark.svg'
    export let words;
    let step = 100 / $words.length
    let count = 0;
    let imageIndex = 0;
    let percentage = count;
    let correct = false;
    let hasStarted = false;
    let wrong = false;

    function handleCorrectClick() {
        count += step;
        percentage = count;
        imageIndex = (imageIndex + 1) % $words.length
        correct = false;
        hasStarted = false;
        if (percentage >= 100) {
            count = 0;
            percentage = count;
        }
    }

    function handleWrongClick() {
        wrong = false;
        hasStarted = false;
        correct = false;
    }

    function handleMic() {
        hasStarted = true;
    }

    let validate = (actual, target) => {
        if (actual !== target)
            wrong = true;

        correct = actual === target;
    }


</script>

{#if $words.length !== 0}
    <div class="flex flex-col items-center">
        <div class="flex justify-center items-center p-4 w-full" id="progress-header">
            <div class="border-solid border-2 border-sky-500 w-1/2 h-10 p-2 rounded-full">
                <div class="h-5 bg-sky-500 rounded-full" style="width: {percentage}%"></div>
            </div>
            <a href="/" class="flex justify-center items-center border-solid border-2 border-sky-500 p-3 m-3 h-10 rounded-full align-middle"><b
                    class="text-sky-500">×</b></a>
        </div>

        {#each [$words[imageIndex]] as word (imageIndex)}
            <figure class="h-full max-w-lg">
                <figcaption class="text-4xl text-center"><u>{word.word.split(" ")[0]}</u> {word.word.split(" ")[1]}
                </figcaption>
                <img class="m-4 h-96 max-w-full rounded-lg" src="{word.image}" alt="image description">
            </figure>

            {#if correct}
                <button class="flex justify-center items-center border-solid border-2 border-black w-24 h-10 m-8 rounded-full"
                        on:click={handleCorrectClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                    </svg>
                </button>
            {:else}
                {#if !hasStarted}
                    <button class="flex justify-center items-center border-solid border-2 border-black w-24 h-10 m-8 rounded-full"
                            on:click={handleMic}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                        </svg>
                    </button>
                {:else}
                    {#if wrong}
                        <button class="flex justify-center items-center border-solid border-2 border-black w-24 h-10 m-8 rounded-full"
                                on:click={handleWrongClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                            </svg>
                        </button>
                    {/if}
                {/if}
            {/if}
            {#if hasStarted}
                <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                       on:change={(e) => validate(e.target.value, word.word)}/>
            {/if}
        {/each}
    </div>
{/if}
<footer>
    <img src={wordmark} class="w-36 m-10" alt="wordmark">
</footer>