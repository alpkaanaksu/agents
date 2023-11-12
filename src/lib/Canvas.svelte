<script>
	import { Agent, Environment } from '../agents';
	import AgentDisplay from './AgentDisplay.svelte';

	export let environment;
</script>

<svg id="environment" width={environment.dimensions.x} height={environment.dimensions.y}>
	{#each environment.agents as agent}
		<AgentDisplay {agent} />
	{/each}
</svg>

<style>
	#environment {
		border-radius: 8px;
		box-shadow: 0 0 8px #ccc;
	}
</style>
