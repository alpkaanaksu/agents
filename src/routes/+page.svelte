<script>
	import { AceEditor } from 'svelte-ace';
	import 'brace/mode/javascript';
	import 'brace/theme/chrome';

	import Canvas from '$lib/Canvas.svelte';
	import { Environment, Agent } from '../agents';

	import { sheepCode } from '../defaults';
	import { onMount } from 'svelte';

	let code = sheepCode;

	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

	let environment = newEnvironment();

	function newEnvironment() {
		return new Environment({
			x: visualViewport.width / 2,
			y: visualViewport.height - 100
		});
	}

	function setup() {
        const agent = new Agent({x: 0, y: 0});
		const setupCode = '(environment) => {' + code + '\n}';
		const setupFunction = eval(setupCode);

		setupFunction(environment);
		ticks++;
	}

	let ticks = 0;
	let running = false;

	async function toggle() {
		if (running) {
			running = false;
			return;
		}

		running = true;

		while (running) {
			ticks++;
			environment.agents.forEach((agent) => agent.tick());
			await sleep(50);
		}
	}

	function reset() {
		running = false;
		environment = newEnvironment();
		ticks = 0;
	}
</script>

<div class="main-container">
	<div class="code-editor">
		<AceEditor
			value={sheepCode}
			width="100%"
			height="100vh"
			lang="javascript"
			on:input={(obj) => {
				code = obj.detail;
			}}
		/>
	</div>

	<div class="simulation-display">
		<div>
			<button
				on:click={() => {
                    reset();
					setup();
                    ticks = 0;
				}}>Setup</button
			>
			<button
				class={running ? 'running' : 'frozen'}
				on:click={() => {
					toggle();
				}}>{running ? 'Stop' : 'Run'}</button
			>
			<button
				on:click={reset}>Reset</button
			>

			<span class="ticks">{ticks}</span>

			<br /><br />

			{#key ticks}
				<Canvas {environment} />
			{/key}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.main-container {
		display: flex;
	}

	.code-editor {
		width: 50%;
	}

	.simulation-display {
		width: 50%;
		padding: 16px;
	}

	button {
		border-radius: 4px;
		background-color: #efefef;
		border: none;
		font-weight: bold;
		font-size: 12pt;
		cursor: pointer;
	}

	button:hover {
		background-color: #dfdfdf;
	}

	button.running {
		background-color: crimson;
		color: white;
	}

	button.frozen {
		background-color: mediumseagreen;
		color: white;
	}

	.ticks {
		font-family: sans-serif;
		font-size: 15pt;
		margin-left: 1rem;
	}
</style>
