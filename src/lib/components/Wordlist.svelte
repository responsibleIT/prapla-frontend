<script>
    export let words;
    let step = 100 / $words.length
    let count = 0;
    let imageIndex = 0;
    let percentage = count;
    let correct = false;

    function handleClick() {
        count += step;
        percentage = count;
        imageIndex = (imageIndex + 1) % $words.length
        correct = false;
        if (percentage >= 100) {
            count = 0;
            percentage = count;
        }
    }

    let validate = (actual, target) => {
        /// todo correct and incorrect logic
        correct = actual === target;
    }
</script>

{#if $words.length !== 0}
    <div class="flex flex-col items-center">
        <div class="flex justify-center items-center p-4 w-full" id="progress-header">
            <div class="border-solid border-2 border-sky-500 w-full h-10 p-2 rounded-full">
                <div class="h-5 bg-sky-500 rounded-full" style="width: {percentage}%"></div>
            </div>
            <a href="/" class="border-solid border-2 border-sky-500 p-3 m-3 h-10 rounded-full align-middle"><b
                    class="text-sky-500">×</b></a>
        </div>

        {#each [$words[imageIndex]] as word (imageIndex)}
            <figure class="h-full max-w-lg">
                <figcaption class="text-4xl text-center"><u>{word.word.split(" ")[0]}</u> {word.word.split(" ")[1]}
                </figcaption>
                <img class="m-4 h-96 max-w-full rounded-lg" src="{word.image}" alt="image description">
            </figure>

            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                   on:change={(e) => validate(e.target.value, word.word)}/>
            {#if correct}
                <button class="border-solid border-2 border-black w-24 h-10 m-8 rounded-full" on:click={handleClick}>
                    <b>→</b>
                </button>
            {/if}
        {/each}
    </div>
{/if}
