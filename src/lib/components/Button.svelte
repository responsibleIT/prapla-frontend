<script>
    export let id;
    export let style;
    let buttonProps = {
        class: 'flex justify-center items-center border-solid border-2 border-black w-40 h-24 mt-8 rounded-full'
    }
</script>
<button id={id}
        style={style}
        on:click
        on:mouseover
        on:mouseenter
        on:mouseleave
        {...buttonProps}>
    <slot/>
</button>