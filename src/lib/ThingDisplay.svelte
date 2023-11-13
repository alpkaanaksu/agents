<script>
	export let thing;
</script>

{#if thing.visual}
	<image
		href={thing.visual}
		x={thing.position.x}
		y={thing.position.y}
		width={thing.size.x}
		height={thing.size.y}
        style="color: {thing.color};"
	/>
{:else}
	<rect
		x={thing.position.x}
		y={thing.position.y}
		width={thing.size.x}
		height={thing.size.y}
        fill={thing.color}
        rx="8"
	/>
{/if}
