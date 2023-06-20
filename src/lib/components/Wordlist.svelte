<script>
    import wordmark from '$lib/images/wordmark.svg'
    import dutch from '$lib/models/dutch.zip'
    import WaveSurfer from "wavesurfer.js";
    import RecordPlugin from "$lib/record.js";
    import {onMount} from "svelte";
    import * as Vosk from "vosk-browser";
    import audioprocessor from "$lib/processor.js?url";
    import {browser} from "$app/environment";

    import correct_sound from "$lib/sounds/static_sounds_feedback_positive.mp3";
    import incorrect_sound from "$lib/sounds/static_sounds_feedback_fart.mp3";
    import AnchorButton from "$lib/components/AnchorButton.svelte";
    import Button from "$lib/components/Button.svelte";

    export let words;
    export let quiz;

    let usesVosk = false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let audioContext;
    let recognizerProcessor;
    let recognition;
    let model;
    let channel;

    let wavesurfer;
    let record;
    let result;
    let step = 100 / ($words.length + $quiz.length);
    let count = 0;
    let imageIndex = 0;
    let correct = false;
    let hasStarted = false;
    let wrong = false;
    let finished = false;
    let skip = false;
    let tries = 0;

    let speechSynthesis;
    if (browser) {
        speechSynthesis = window.speechSynthesis;
    }

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

            recognition.acceptWaveform(audioBuffer);
            setTimeout(() => {
                recognition.retrieveFinalResult();
            }, 10000);
        });

        recognition.on("result", (message) => {
            result = message.result.text;
            validate(result, $words[imageIndex].word);
        });

        recognizerProcessor.port.postMessage({action: 'init', recognizerId: recognition.id}, [channel.port2])

        usesVosk = true;
    }

    onMount(async () => {
        document.getElementById("mic-elem").style.display = "none";

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
                document.getElementById("mic-elem").style.display = "none";
                validate(result, $words[imageIndex].word);
            };
        } catch (e) {
            document.getElementById("control").style.opacity = "0";
            document.getElementById("control").style.pointerEvents = "none";

            initVosk().then(() => {
                document.getElementById("control").style.opacity = "1";
                document.getElementById("control").style.pointerEvents = "auto";
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
        record.on("stopRecording", () => {
            document.getElementById("mic-elem").style.display = "none";
        })

        if (browser) {
            document.getElementById("control").style.opacity = "0";
            document.getElementById("control").style.pointerEvents = "none";

            const utterance = new SpeechSynthesisUtterance($words[imageIndex].word);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.7;
            utterance.pitch = 1.2;

            speechSynthesis.speak(utterance);
            utterance.addEventListener("end", (event) => {
                document.getElementById("control").style.opacity = "1";
                document.getElementById("control").style.pointerEvents = "auto";
            });
        }
    });
    $: if (imageIndex === $words.length - 1) {
        finished = true;
    }

    $: if (correct) {
        new Audio(correct_sound).play();
    }

    $: if (wrong) {
        new Audio(incorrect_sound).play();
    }

    function handleNextClick() {
        document.getElementById("control").style.opacity = "0";
        document.getElementById("control").style.pointerEvents = "none";

        count += step;
        imageIndex = (imageIndex + 1) % $words.length
        correct = false;
        wrong = false;
        hasStarted = false;
        skip = false;
        tries = 0;

        if (browser) {
            const utterance = new SpeechSynthesisUtterance($words[imageIndex].word);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.7;
            utterance.pitch = 1.2;

            speechSynthesis.speak(utterance);
            utterance.addEventListener("end", (event) => {
                document.getElementById("control").style.opacity = "1";
                document.getElementById("control").style.pointerEvents = "auto";
            });
        }
    }

    function handleRepeatClick() {
        document.getElementById("control").style.opacity = "0";
        document.getElementById("control").style.pointerEvents = "none";

        wrong = false;
        correct = false;
        hasStarted = false;
        skip = false;
        tries++;

        if (browser) {
            const utterance = new SpeechSynthesisUtterance($words[imageIndex].word);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.7;
            utterance.pitch = 1.2;

            speechSynthesis.speak(utterance);
            utterance.addEventListener("end", (event) => {
                document.getElementById("control").style.opacity = "1";
                document.getElementById("control").style.pointerEvents = "auto";
            });
        }
    }

    async function handleMic() {
        document.getElementById("mic-elem").style.display = "block";
        hasStarted = true;

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
        try {
            actual = actual.toLowerCase().trim();
            target = target.toLowerCase().trim();
        } catch (e) {
            // Empty input
        }

        if (tries >= 2) {
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

            <div id="control" class="grid">
                {#if skip}
                    {#if imageIndex === $words.length - 1}
                        <AnchorButton
                                href="/app/quiz"
                                style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </AnchorButton>
                    {:else}
                        <Button
                                on:click={handleNextClick}
                                style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </Button>
                    {/if}
                {/if}
                {#if correct}
                    {#if finished}
                        <AnchorButton href="/app/quiz"
                                      style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </AnchorButton>
                    {:else}
                        <Button
                                on:click={handleNextClick}
                                style="grid-area: 1/1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </Button>
                    {/if}
                {:else}
                    {#if !hasStarted}
                        <Button id="mic-button"
                                style="grid-area: 1/1"
                                on:click={handleMic}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=2
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                            </svg>
                        </Button>
                    {:else}
                        {#if wrong}
                            <Button on:click={handleRepeatClick}
                                    style="grid-area: 1/1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="2"
                                     stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                                </svg>
                            </Button>
                        {/if}
                    {/if}
                {/if}
            </div>
        {/each}
        <div id="mic-elem" class="absolute w-40 h-24 mt-8 pointer-events-none bottom-20 z-20"
             style="grid-area: 1/1">
        </div>
        <footer class="flex align-top justify-start w-full m-8 pl-8">
            <img src={wordmark} class="w-36 absolute bottom-0 left-0 m-8" alt="wordmark">
        </footer>
    </div>
{/if}