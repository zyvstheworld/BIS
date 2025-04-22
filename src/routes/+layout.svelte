<script lang="ts">
	import '../app.css';
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
		<div class="p-4">
			<h1 class="text-2xl font-bold mb-8">Barangay CMS</h1>
			<nav class="space-y-2">
				<a href="/" class="block py-2 px-4 rounded hover:bg-blue-700">Home</a>
				<a href="/summary" class="block py-2 px-4 rounded hover:bg-blue-700">Summary</a>
			</nav>
		</div>
	</div>

	<!-- Main Content -->
	<div class="ml-64 p-8">
		<slot />
	</div>
</div>
