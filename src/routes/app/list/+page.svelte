<script>
    import {words, user} from "$lib/store.js";
    import Wordlist from "$lib/components/Wordlist.svelte";
</script>

{#if $words.length !== 0}
    <Wordlist words={words}/>
{:else}
    <p>Niet ingelogd jij bent, ga <a href="/">terug</a></p>
{/if}