<script>
	import { Agent, Environment } from '../agents';
	import AgentDisplay from './AgentDisplay.svelte';
	import ThingDisplay from './ThingDisplay.svelte';

	export let environment;

	let currentObject = {};

	const getAllPrototypes = (obj) => {
		const prototypes = [];

		let current = Object.getPrototypeOf(obj);

		while (true) {
			current = Object.getPrototypeOf(current);

			if(current === null || current.constructor.name === "Object") {
				break;
			}

			prototypes.push(current.constructor.name);
		}

		return prototypes;
	};
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
	{#if currentObject && currentObject.constructor.name != "Object"}
		<div class="info">
			<b>{currentObject.constructor.name}</b> • {getAllPrototypes(currentObject).join(" • ")}
			<br /><br />
			{#each Object.entries(currentObject).filter((x) => x[1]) as entry}
				<div><b>{entry[0]}:</b> {JSON.stringify(entry[1])}</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	#environment {
		background-color: #fbfbfb;
		box-sizing: border-box;
		border-left: 1px solid lightgray;
	}

	.simulation {
		position: relative;
		pointer-events: none;
	}

	.info {
		position: absolute;
		bottom: 8px;
		left: 8px;
		border-radius: 8px;
		padding: 8px;
		color: white;
		background-color: #00000099;
	}

	g {
		pointer-events: all;
	}
</style>
