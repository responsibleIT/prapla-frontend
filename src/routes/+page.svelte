<script>
    import wordmark from '$lib/images/wordmark.svg'
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Prapla"/>
</svelte:head>

<section>
    <div class="flex flex-col justify-center items-center h-screen">
        <img src={wordmark} alt="Prapla" class="w-1/3"/>
        <a class="flex justify-center items-center text-2xl border-solid border-2 border-black w-40 h-16 m-8 mt-16 rounded-full hover:bg-sky-200"
           href="/app">Start</a>
    </div>
    <div class='air'></div>
</section>

<style>
    section{
        position: relative;
        width: 100%;
        height: 100vh;
        background: aliceblue;
        overflow: hidden;
    }
    section .air{
        position: absolute;
        color: white;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: url($lib/images/wave.png);
        background-size: 1000px 100px;
        animation: wave 10s linear infinite;
    }
    @keyframes wave{
        100%{
            background-position-x: 1000px;
        }
    }
</style>
