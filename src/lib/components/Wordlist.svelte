<script>
    import wordmark from '$lib/images/wordmark.svg'
    import WaveSurfer from "wavesurfer.js";
    import RecordPlugin from "$lib/record.js";
    import {onMount} from "svelte";

    export let words;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    let wavesurfer;
    let record;
    let result;
    let step = 100 / $words.length
    let count = 0;
    let imageIndex = 0;
    let percentage = count;
    let correct = false;
    let hasStarted = false;
    let wrong = false;
    let finished = false;

    onMount(async () => {
        wavesurfer = WaveSurfer.create({
            container: document.getElementById("mic-elem"),
            waveColor: 'slategray',
            normalize: true,
            interact: false,
            cursorWidth: 0,
            hideScrollbar: true
        });
        record = wavesurfer.registerPlugin(RecordPlugin.create())
    });

    function handleCorrectClick() {
        count += step;
        percentage = count;
        imageIndex = (imageIndex + 1) % $words.length
        correct = false;
        wrong = false;
        hasStarted = false;

        if (percentage >= 100) {
            finished = true;
        }
    }

    function handleWrongClick() {
        wrong = false;
        correct = false;
        hasStarted = false;
    }

    function handleMic() {
        hasStarted = true;
        recognition.start();

        if (wavesurfer.isPlaying()) {
            wavesurfer.pause()
        }

        if (record.isRecording()) {
            return;
        }

        record.startRecording();
    }

    recognition.onresult = (event) => {
        result = event.results[0][0].transcript;
    }

    recognition.onend = (event) => {
        record.stopRecording();
        document.getElementById("mic-elem").innerHTML = "";
        recognition.stop();

        console.log(result);
        validate(result, $words[imageIndex].word);
    };


    let validate = (actual, target) => {
        if (actual !== target) {
            wrong = true;
            return;
        }

        correct = actual === target;
    }


</script>

{#if $words.length !== 0}
    <div class="flex flex-col items-center h-screen" class:!bg-green-100={correct} class:!bg-orange-100={wrong}>
        <div class="flex justify-center items-center p-4 w-full" id="progress-header">
            <div class="grow"></div>
            <div class="border-solid border-2 border-slate-400 w-1/2 h-10 p-2 ml-16 rounded-full"
                 class:!border-green-400={correct} class:!border-orange-400={wrong}>
                <div class="h-5 bg-slate-400 rounded-full" style="width: {percentage}%" class:!bg-green-400={correct}
                     class:!bg-orange-500={wrong}></div>
            </div>
            <div class="grow"></div>
            <a href="/"
               class="flex justify-center items-center border-solid border-2 border-slate-400 p-3 m-3 h-10 rounded-full align-middle"
               class:!border-green-400={correct} class:!border-red-400={wrong}><b
                    class="text-slate-400" class:!text-green-400={correct} class:!text-orange-400={wrong}>×</b></a>
        </div>

        {#each [$words[imageIndex]] as word (imageIndex)}
            <figure class="h-full max-w-lg">
                <figcaption class="text-4xl text-center"><u>{word.word.split(" ")[0]}</u> {word.word.split(" ")[1]}
                </figcaption>
                <img class="m-4 h-96 max-w-full rounded-lg" src="{word.image}" alt="image description">
            </figure>

            <div id="mic-elem" class="w-40 h-24 m-8">
                {#if correct}
                    {#if finished}
                        <a href="/app/quiz"
                           class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </a>
                    {:else}
                        <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                on:click={handleCorrectClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </button>
                    {/if}
                {:else}
                    {#if !hasStarted}
                        <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                on:click={handleMic}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=2
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                            </svg>
                        </button>
                    {:else}
                        {#if wrong}
                            <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                    on:click={handleWrongClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                     stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                                </svg>
                            </button>
                        {:else}
<!--                            <input id="mic-input-elem"-->
<!--                                   class="bg-gray-50 text-gray-900 text-sm border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"-->
<!--                                   on:change={(e) => validate(e.target.value, word.word)}/>-->
                        {/if}
                    {/if}
                {/if}
            </div>
        {/each}
        <footer class="flex align-top justify-start w-full m-8 pl-8">
            <img src={wordmark} class="w-36" alt="wordmark">
        </footer>
    </div>
{/if}