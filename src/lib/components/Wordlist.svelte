<script>
    import wordmark from '$lib/images/wordmark.svg'
    import dutch from '$lib/models/dutch.zip'
    import WaveSurfer from "wavesurfer.js";
    import RecordPlugin from "$lib/record.js";
    import {onMount} from "svelte";
    import * as Vosk from "vosk-browser";
    import audioprocessor from "$lib/processor.js?url";

    export let words;
    let usesVosk = false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let mediaStream;
    let audioContext;
    let recognizerProcessor;
    let source;
    let recognition;
    let model;
    let channel;

    let wavesurfer;
    let record;
    let result;
    let step = 100 / $words.length
    let count = 0;
    let imageIndex = 0;
    let correct = false;
    let hasStarted = false;
    let wrong = false;
    let finished = false;
    let skip = false;
    let tries = 0;

    async function initVosk() {
        channel = new MessageChannel();
        model = await Vosk.createModel(dutch, -1);
        model.registerPort(channel.port1)

        audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule(audioprocessor);
        recognizerProcessor = new AudioWorkletNode(audioContext, 'processor', {
            channelCount: 1,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });

        recognition = new model.KaldiRecognizer(44100);
        recognition.setWords(true);

        record.on('stopRecording', async () => {
            let blob = await fetch(record.getRecordedUrl()).then(r => r.blob());
            let arrayBuffer = await blob.arrayBuffer();
            let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            document.getElementById("mic-elem").style.opacity = "0";

            recognition.acceptWaveform(audioBuffer);
            setTimeout(() => {
                recognition.retrieveFinalResult();
            }, 10000);
        });

        recognition.on("result", (message) => {
            result = message.result.text;

            console.log("vosk", result)
            validate(result, $words[imageIndex].word);
        });

        recognizerProcessor.port.postMessage({action: 'init', recognizerId: recognition.id}, [channel.port2])

        usesVosk = true;
    }

    onMount(async () => {
        try {
            recognition = new SpeechRecognition();
            recognition.lang = 'nl-NL';
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 5;

            recognition.onresult = (event) => {
                result = event.results[0][0].transcript;
            }

            recognition.onend = (event) => {
                recognition.stop();

                document.getElementById("mic-elem").style.opacity = "0";

                console.log("og", result);
                validate(result, $words[imageIndex].word);
            };
        } catch (e) {
            document.getElementById("mic-button").style.display = "none";
            initVosk().then(() => {
                document.getElementById("mic-button").style.display = "flex";
            });
        }

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

    $: if (skip) {
        tries = 0;
    }

    function handleNextClick() {
        if (count === 100 - step) {
            skip = false;
            if (usesVosk) {
                recognition.remove();
                model.terminate();
            }
            finished = true;
        }

        count += step;
        imageIndex = (imageIndex + 1) % $words.length
        correct = false;
        wrong = false;
        hasStarted = false;
        skip = false;

    }

    function handleRepeatClick() {
        wrong = false;
        correct = false;
        hasStarted = false;
        skip = false;
        tries++;
    }

    async function handleMic() {
        hasStarted = true;

        console.log("tries", tries);
        document.getElementById("mic-elem").style.opacity = "1";

        if (!record.isRecording()) {
            await record.startRecording();
            setTimeout(() => {
                record.stopRecording();
            }, 5000);
        }
        if (!usesVosk) {
            recognition.start();
        }
    }

    let validate = (actual, target) => {
        if (tries >= 3) {
            skip = true;
            return;
        }

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
                <div class="h-5 bg-slate-400 rounded-full" style="width: {count}%" class:!bg-green-400={correct}
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

            <div class="grid">
                <div id="mic-elem" class="w-40 h-24 pointer-events-none"
                     style="grid-area: 1/1">
                </div>
                {#if skip}
                    {#if count === 100 - step}
                        <a href="/app/quiz"
                           class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                           style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </a>
                    {:else}
                        <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                on:click={handleNextClick}
                                style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </button>
                    {/if}
                {/if}
                {#if correct}
                    {#if finished}
                        <a href="/app/quiz"
                           class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                           style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </a>
                    {:else}
                        <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                on:click={handleNextClick}
                                style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </button>
                    {/if}
                {:else}
                    {#if !hasStarted}
                        <button id="mic-button"
                                class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                                style="grid-area: 1/1"
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
                                    on:click={handleRepeatClick}
                                    style="grid-area: 1/1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="2"
                                     stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                                </svg>
                            </button>
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