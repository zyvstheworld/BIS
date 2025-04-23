<script lang="ts">
	import { onMount } from 'svelte';

	let summary = 'Loading...';

	onMount(async () => {
		const res = await fetch('/summary');
		const data = await res.json();
		summary = data.summary || 'No summary available.';
	});
</script>

<div class="bg-white p-6 rounded-lg shadow">
	<h2 class="text-2xl font-bold mb-4">Summary of Records</h2>
	<p class="text-gray-800 whitespace-pre-line">{summary}</p>
</div>
