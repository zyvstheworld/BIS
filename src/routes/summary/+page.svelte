<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend} from 'chart.js';
	import type { ChartConfiguration } from 'chart.js';

	let canvas: HTMLCanvasElement | null = null;
	let summary = '';
	let stats = {
		totalResidents: 0,
		averageAge: 0,
		ageGroups: {
			youth: 0,
			adult: 0,
			senior: 0
		}
	};
	let loading = false;

	onMount(() => {
		if(!canvas) return;

	
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        datasets: [{
        	data: [stats.ageGroups.youth, stats.ageGroups.adult, stats.ageGroups.senior],
          backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    new Chart(canvas, config);
  });
	async function generateSummary() {
		loading = true;
		try {
			const res = await fetch('/api/summary');
			const data = await res.json();
			// uodate both stats and summary together
			stats = data.stats;
			summary = data.summary;
		} catch (error) {
			console.error('Error:', error);
			summary = 'Failed to generate summary';
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-8">
	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="bg-blue-100 p-6 rounded-lg shadow">
			<h3 class="text-xl font-semibold text-blue-800">Total Residents</h3>
			<p class="text-3xl font-bold text-blue-600">{stats.totalResidents}</p>
		</div>

		<div class="bg-green-100 p-6 rounded-lg shadow">
			<h3 class="text-xl font-semibold text-green-800">Average Age</h3>
			<p class="text-3xl font-bold text-green-600">{stats.averageAge}</p>
		</div>

		<div class="bg-purple-100 p-6 rounded-lg shadow">
			<h3 class="text-xl font-semibold text-purple-800">Age Distribution</h3>
			<div class="text-sm mt-2">
				<p>Youth (0-19): {stats.ageGroups.youth}</p>
				<p>Adult (20-59): {stats.ageGroups.adult}</p>
				<p>Senior (60+): {stats.ageGroups.senior}</p>
			</div>
		</div>
	</div>

	<!-- Doughnut -->
	<div class="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
		<!-- Doughnut Chart -->
		<div class="w-full h-25">
		  <canvas bind:this={canvas} class="w-full h-full"></canvas>
		</div>

	 <!-- Age Group Legend -->
	 <div class="space-y-4">
		<h3 class="text-xl font-bold text-gray-700">Age Group Breakdown</h3>
		<ul class="space-y-2">
		  <li class="flex items-center">
			<span class="w-4 h-4 rounded-full bg-blue-400 mr-2"></span>
			<span class="text-gray-800 font-medium">Youth (0-19): {stats.ageGroups.youth}</span>
		  </li>
		  <li class="flex items-center">
			<span class="w-4 h-4 rounded-full bg-green-400 mr-2"></span>
			<span class="text-gray-800 font-medium">Adult (20-59): {stats.ageGroups.adult}</span>
		  </li>
		  <li class="flex items-center">
			<span class="w-4 h-4 rounded-full bg-yellow-400 mr-2"></span>
			<span class="text-gray-800 font-medium">Senior (60+): {stats.ageGroups.senior}</span>
		  </li>
		</ul>
	  </div>
	</div>

		

	<!-- AI Summary -->
	<div class="bg-white p-6 rounded-lg shadow">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold">AI Summary</h2>
			<button
				on:click={generateSummary}
				class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Generating...' : 'Generate Summary'}
			</button>
		</div>
		{#if summary}
			<p class="text-gray-800 whitespace-pre-line">{summary}</p>
		{:else}
			<p class="text-gray-500">Click generate to create an AI summary and view statistics.</p>
		{/if}
	</div>
</div>
