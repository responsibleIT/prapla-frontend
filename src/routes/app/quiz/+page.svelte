<script>
    import {quiz, user, words} from "$lib/store.js";
    import Quiz from "$lib/components/Quiz.svelte";
    import {browser} from "$app/environment";

    if (browser && $words.length === 0) {
        window.location.href = '/';
    }
</script>

{#if $quiz.length !== 0}
    <Quiz quiz={quiz} words={words}/>
{/if}