<script>
	export let agent;
</script>

{#if agent.visual}
	<image href={agent.visual} x={agent.position.x} y={agent.position.y} width={agent.size} />
{:else}
	<circle
		cx={agent.position.x}
		cy={agent.position.y}
		r={agent.size / 2}
		fill="firebrick"
	/>
{/if}
