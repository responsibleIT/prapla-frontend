<script>
    export let id;
    export let style;

    export let href;
    let anchorProps = {
        class: 'flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full hover:bg-sky-200'
    }
</script>
<a id={id}
   style={style}
   href={href}
   on:click
   on:mouseover
   on:mouseenter
   on:mouseleave
   {...anchorProps}>
    <slot/>
</a>