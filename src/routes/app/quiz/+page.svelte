<script>
    import {quiz, user} from "$lib/store.js";
    import Quiz from "$lib/components/Quiz.svelte";
</script>

{#if $quiz.length !== 0}
    <Quiz quiz={quiz}/>
{:else}
    <p>Niet ingelogd jij bent, ga <a href="/">terug</a></p>
{/if}