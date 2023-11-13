<script>
	import { Agent, Environment } from '../agents';
	import AgentDisplay from './AgentDisplay.svelte';
	import ThingDisplay from './ThingDisplay.svelte';

	export let environment;

	let currentObject = {};
</script>

<div class="simulation">
	<svg id="environment" width={environment.dimensions.x} height={environment.dimensions.y}>
		{#each environment.agents as agent}
			<g on:click={() => (currentObject = agent)}>
				{#if agent.alive}
					<AgentDisplay {agent} />
				{/if}
			</g>
		{/each}

		{#each environment.things as thing}
			<g on:click={() => (currentObject = thing)}>
				<ThingDisplay {thing} />
			</g>
		{/each}
	</svg>
	{#if currentObject}
		<div class="info">
			{#each Object.entries(currentObject) as entry}
				<div><b>{entry[0]}:</b> {JSON.stringify(entry[1])}</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	#environment {
		border-radius: 8px;
		box-shadow: 0 0 8px #ccc;
		box-sizing: border-box;
		pointer-events: none;
	}

	.simulation {
		position: relative;
	}

	.info {
		position: absolute;
		bottom: 8px;
		left: 8px;
		border-radius: 8px;
		padding: 8px;
		background-color: #00000011;
	}

	g {
		pointer-events: all;
	}
</style>
