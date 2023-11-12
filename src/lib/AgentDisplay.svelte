<script>
	export let agent;
</script>

{#if agent.visual}
	<image href={agent.visual} x={agent.position.x} y={agent.position.y} width={agent.size} />
{:else}
	<circle
		cx={agent.position.x}
		cy={agent.position.y}
		r="5"
		stroke="green"
		stroke-width="1"
		fill="yellow"
	/>
{/if}
