<script>
    import wordmark from "$lib/images/wordmark.svg";
    import correct_sound from "$lib/sounds/static_sounds_feedback_positive.mp3";
    import incorrect_sound from "$lib/sounds/static_sounds_feedback_fart.mp3";
    import finished_sound from "$lib/sounds/static_sounds_feedback_completed.mp3";

    import {browser} from "$app/environment";
    import Button from "$lib/components/Button.svelte";
    import AnchorButton from "$lib/components/AnchorButton.svelte";

    export let quiz;
    export let words;
    let correct = false;
    let wrong = false;
    let answered = false;
    let finished = false;
    let step = 100 / ($words.length + $quiz.length);
    let questionIndex = 0;
    let count = 0;
    let percentage = step * $words.length;
    let correctAnswer = $quiz[questionIndex].find(answer => answer.correct);
    let selected = null;

    $: {
        if (percentage >= 100) {
            finished = true;
        }
    }

    $: if (correct) {
        document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = true);
        new Audio(correct_sound).play();
    }

    $: if (wrong) {
        document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = true);
        new Audio(incorrect_sound).play();
    }

    $: if (finished) {
        document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = true);
        new Audio(finished_sound).play();
    }

    if (browser) {
        const utterance = new SpeechSynthesisUtterance("Welk plaatje hoort bij... " + correctAnswer.word);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.7;
        utterance.pitch = 1.2;

        speechSynthesis.speak(utterance);
        utterance.addEventListener("end", (event) => {
            document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = false);
        });
    }

    function validate() {
        let answer = selected.correct;
        if (answered) return;

        if (percentage >= 100) {
            finished = true;
        }

        if (answer) {
            percentage += step;
            correct = true;
            wrong = false;
        } else {
            correct = false;
            wrong = true;
        }
        answered = true;
        selected = null;
    }

    function handleWrong() {
        correct = false;
        wrong = false;
        answered = false;

        if (browser) {
            const utterance = new SpeechSynthesisUtterance("Welk plaatje hoort bij... " + correctAnswer.word);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.7;
            utterance.pitch = 1.2;

            speechSynthesis.speak(utterance);
            utterance.addEventListener("end", (event) => {
                document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = false);
            });
        }
    }

    function handleCorrect() {
        if (percentage >= 100) {
            correct = false;
            wrong = false;
            answered = false;
            finished = true;
        } else {
            correct = false;
            wrong = false;
            answered = false;

            questionIndex++;
            correctAnswer = $quiz[questionIndex].find(answer => answer.correct);
        }

        if (browser) {
            const utterance = new SpeechSynthesisUtterance("Welk plaatje hoort bij... " + correctAnswer.word);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.7;
            utterance.pitch = 1.2;

            speechSynthesis.speak(utterance);
            utterance.addEventListener("end", (event) => {
                document.querySelectorAll("[id=quiz-answer]").forEach(element => element.disabled = false);
            });
        }
    }

</script>

{#if $quiz.length !== 0}
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

        {#each [$quiz[questionIndex]] as question (questionIndex)}
            <h1 class="text-4xl text-center">Welk plaatje hoort bij <br>
                <u>{correctAnswer.word.split(" ")[0]}</u> {correctAnswer.word.split(" ")[1]}?</h1>
            <div class="flex p-8 space-x-4">
                {#each question as answer}
                    <label class="w-1/4">
                        <input type="radio" value={answer} bind:group={selected} id="quiz-answer" disabled class="hidden peer"/>
                        <img src="{answer.image}"
                             alt="{answer.correct}"
                        class="border-2 border-black rounded-xl p-4 h-full object-contain peer-checked:bg-sky-200"/>
                    </label>
                {/each}
            </div>
        {/each}

        {#if finished}
            <AnchorButton href="/app/done">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                </svg>
            </AnchorButton>
        {:else}
            {#if selected}
                <Button on:click={validate}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                    </svg>
                </Button>
            {:else}
                {#if answered}
                    {#if finished}
                        <AnchorButton href="/app/done">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                            </svg>
                        </AnchorButton>
                    {:else }
                        {#if correct}
                            <Button on:click={handleCorrect}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5"
                                     stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                                </svg>
                            </Button>
                        {:else }
                            <Button on:click={handleWrong}>
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
            {/if}
        {/if}

        <div class="grow"></div>
        <footer class="flex align-top justify-start w-full m-8 pl-8">
            <img src={wordmark} class="w-36 absolute bottom-0 left-0 m-8" alt="wordmark">
        </footer>
    </div>
{/if}