<script>
    import wordmark from "$lib/images/wordmark.svg";

    export let quiz;
    let correct = false;
    let wrong = false;
    let answered = false;
    let finished = false;
    let questionIndex = 0;
    let count = 0;
    let percentage = count;
    let correctAnswer = $quiz[questionIndex].find(answer => answer.correct);

    function validate(answer) {
        if (answered) return;

        if (percentage >= 100) {
            finished = true;
        }

        if (answer) {
            count++;
            percentage = count * 100 / $quiz.length;
            correct = true;
            wrong = false;
        } else {
            correct = false;
            wrong = true;
        }
        answered = true;
    }

    function handleWrong() {
        correct = false;
        wrong = false;
        answered = false;
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
    }

</script>

{#if $quiz.length !== 0}
    <div class="flex flex-col items-center h-screen" class:bg-green-100={correct} class:bg-orange-100={wrong}>
        <div class="flex justify-center items-center p-4 w-full" id="progress-header">
            <div class="grow"></div>
            <div class="border-solid border-2 border-slate-400 w-1/2 h-10 p-2 ml-16 rounded-full"
                 class:border-green-400={correct} class:border-orange-400={wrong}>
                <div class="h-5 bg-slate-400 rounded-full" style="width: {percentage}%" class:bg-green-400={correct}
                     class:bg-orange-500={wrong}></div>
            </div>
            <div class="grow"></div>
            <a href="/"
               class="flex justify-center items-center border-solid border-2 border-slate-400 p-3 m-3 h-10 rounded-full align-middle"
               class:border-green-400={correct} class:border-red-400={wrong}><b
                    class="text-slate-400" class:text-green-400={correct} class:text-orange-400={wrong}>×</b></a>
        </div>

        {#each [$quiz[questionIndex]] as question (questionIndex)}
            <h1 class="text-4xl text-center">Welk plaatje hoort bij <br>
                <u>{correctAnswer.word.split(" ")[0]}</u> {correctAnswer.word.split(" ")[1]}?</h1>
            <div class="flex p-8 space-x-4">
                {#each question as answer}
                    <button class="border-2 border-black rounded-xl p-4 w-1/4" on:click={validate(answer.correct)}>
                        <img src="{answer.image}"/>
                    </button>
                {/each}
            </div>
        {/each}

        {#if finished}
            <a href="/app/done"
               class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                </svg>
            </a>
        {/if}

        {#if answered}
            {#if finished}
                <a href="/app/done"
                   class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                    </svg>
                </a>
            {:else }
                {#if correct}
                    <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                            on:click={handleCorrect}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
                        </svg>
                    </button>
                {/if}
                {#if wrong}
                    <button class="flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full"
                            on:click={handleWrong}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                        </svg>
                    </button>
                {/if}
            {/if}
        {/if}
        <div class="grow"></div>
        <footer class="flex align-top justify-start w-full m-8 pl-8">
            <img src={wordmark} class="w-36" alt="wordmark">
        </footer>
    </div>
{/if}