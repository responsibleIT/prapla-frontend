<script>
    import {words, user, quiz} from "$lib/store.js";
    import Wordlist from "$lib/components/Wordlist.svelte";
    import {browser} from '$app/environment';

    if (browser && $words.length === 0) {
        window.location.href = '/';
    }

</script>

{#if $words.length !== 0}
    <Wordlist words={words} quiz={quiz}/>
{/if}