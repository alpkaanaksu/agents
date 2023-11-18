<script>
	import { AceEditor } from 'svelte-ace';
	import 'brace/mode/javascript';
	import 'brace/theme/chrome';

	import Canvas from '$lib/Canvas.svelte';
	import { Environment, Agent, Thing } from '../agents';

	import { onMount } from 'svelte';
	import LinePlot from '../lib/visualization/LinePlot.svelte';

	let topBar;

	let code = localStorage.getItem('code');
	let githubPath = code ? '' : 'alpkaanaksu/agents/main/models/sheep_basic.js';

	function fetchCode() {
		const url = `https://raw.githubusercontent.com/${githubPath}`;

		fetch(url)
			.then((r) => r.text())
			.then((text) => (code = text));
	}

	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

	let environment;

	let exposed = {};

	function newEnvironment() {
		return new Environment({
			x: visualViewport.width / 2,
			y: visualViewport.height - topBar.clientHeight
		});
	}

	function setup() {
		const setupCode = '(env, Agent, Thing, exposed, utils) => {' + code + '\n}';
		const setupFunction = eval(setupCode);

		setupFunction(environment, Agent, Thing, exposed, environment.utils);
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

	onMount(() => {
		if (!code) {
			fetchCode();
		}
		environment = newEnvironment();
	});
</script>

<div class="main-container">
	<div class="meta">
		<div class="top">
			{#if !running}
				<input bind:value={githubPath} type="text" placeholder="GitHub Path" /><button
					on:click={fetchCode}>Fetch</button
				>

				<button
					on:click={() => {
						githubPath = '';
						code = '';
					}}>New</button
				>
			{:else}
				<p>Information</p>
			{/if}
		</div>
		{#if !running}
			{#if topBar}
				<AceEditor
					value={code}
					width="100%"
					height="{visualViewport.height - topBar.clientHeight}px"
					lang="javascript"
					on:input={(obj) => {
						code = obj.detail;
					}}
				/>
			{/if}
		{:else}
			<div class="data">
				{#key ticks}
					{#each Object.keys(environment.track) as k}
					<div>
						<p class="pill"><b>{k}:</b> {environment.track[k]()}</p><br>
						<LinePlot data={environment.tracked[k]} width={300} height={225}/>
					</div>
					{/each}
				{/key}
			</div>
		{/if}
	</div>

	<div class="simulation-display">
		<div>
			<div class="top" bind:this={topBar}>
				<div class="menu">
					<div>
						<button
							class={running ? 'running' : 'frozen'}
							on:click={() => {
								toggle();
							}}>{running ? 'Stop' : 'Run'}</button
						>
						<button
							on:click={() => {
								reset();
								setup();
								ticks = 0;
							}}>Setup</button
						>
					</div>
					<span class="ticks">{ticks}</span>
				</div>
			</div>

			<div class="simulation-container">
				{#if environment}
					{#key ticks}
						<Canvas {environment} />
					{/key}
				{/if}

				<div class="exposed">
					{#each Object.keys(exposed) as k}
						<div class="pill">
							<label>{k} <input type="number" bind:value={exposed[k]} /></label>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: sans-serif;
		overflow: hidden;
	}

	.main-container {
		display: flex;
	}

	.meta {
		width: 50%;
	}

	.simulation-display {
		width: 50%;
	}

	.simulation-container {
		position: relative;
	}

	.top {
		width: 100%;
		padding: 8px;
		background-color: #333333;
		color: #efefef;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		height: 48px;
	}

	.top input {
		border-radius: 99px;
		padding: 0.5rem 1rem;
		font-size: 11pt;
		border: none;
		background-color: #ffffff22;
		margin-right: 8px;
		color: #efefef;
		box-sizing: border-box;
		flex-grow: 1;
	}

	.top button {
		background-color: transparent;
		color: #efefef;
	}

	.top button:hover {
		background-color: #ffffff22;
		color: #efefef;
	}

	.exposed {
		top: 8px;
		left: 8px;
		position: absolute;
	}

	button {
		border-radius: 99px;
		background-color: #efefef;
		border: none;
		font-weight: bold;
		font-size: 12pt;
		cursor: pointer;
		transition-duration: 200ms;
		padding: 0.125rem 0.5rem;
	}

	button.running {
		background-color: crimson;
		color: white;
	}

	button.running:hover {
		background-color: crimson;
		box-shadow: 0 0 16px crimson;
		color: white;
	}

	button.frozen {
		background-color: mediumseagreen;
		color: white;
	}

	button.frozen:hover {
		background-color: mediumseagreen;
		box-shadow: 0 0 16px mediumseagreen;
		color: white;
	}

	.ticks {
		color: white;
		background-color: #ffffff22;
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 50%;
		margin: 0 auto;
		background-color: #ffffff22;
		border-radius: 99px;
		padding: 6px;
	}

	.data {
		overflow: auto;
		padding: 16px;
		display: flex;
	}

	.data .pill {
		padding: 0.25rem 0.5rem;
	}
</style>
