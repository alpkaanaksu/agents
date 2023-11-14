<script>
	import { AceEditor } from 'svelte-ace';
	import 'brace/mode/javascript';
	import 'brace/theme/chrome';

	import Canvas from '$lib/Canvas.svelte';
	import { Environment, Agent, Thing, utils } from '../agents';

	import { herrErwin } from '../defaults';

	let code = localStorage.getItem('code') ?? herrErwin;

	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

	let environment = newEnvironment();

	let exposed = {};

	function newEnvironment() {
		return new Environment({
			x: visualViewport.width / 2,
			y: visualViewport.height - 100
		});
	}

	function setup() {
		const setupCode = '(environment, Agent, Thing, exposed, utils) => {' + code + '\n}';
		const setupFunction = eval(setupCode);

		setupFunction(environment, Agent, Thing, exposed, utils);
		ticks++;
		exposed = exposed;
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
			environment.tick();
			await sleep(50);
		}
	}

	function reset() {
		running = false;
		exposed = {};
		environment = newEnvironment();
		ticks = 0;
	}

	$: localStorage.setItem('code', code);
</script>

<div class="main-container">
	<div class="code-editor">
		<AceEditor
			value={code}
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
			<div class="menu">
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
				</div>

				<span class="ticks">{ticks}</span>
			</div>

			<div class="simulation-container">
				<div class="exposed">
					{#each Object.keys(exposed) as k}
						<div class="pill">
							<label>{k} <input type="number" bind:value={exposed[k]} /></label>
						</div>
					{/each}
				</div>

				{#key ticks}
					<Canvas {environment} />
				{/key}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: sans-serif;
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

	.simulation-container {
		position: relative;
	}

	.exposed {
		top: 8px;
		left: 8px;
		position: absolute;
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
		margin-left: 1rem;
		color: gray;
        background-color: #efefef;
        padding: 0.125rem 0.5rem;
        border-radius: 99px;
	}

	.pill {
		border-radius: 99px;
		background-color: #00000011;
		padding: 0.25rem;
		display: inline-block;
		margin-bottom: 0.5rem;
		margin-right: 0.5rem;
	}

	.pill label {
		margin-left: 0.5rem;
	}

	.pill input {
		border-radius: 99px;
		width: 40px;
		margin-left: 0.5rem;
		border: none;
		padding: 0.25rem 0.5rem;
		font-size: 10pt;
	}

	.menu {
		margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
	}
</style>
