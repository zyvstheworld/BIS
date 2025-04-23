<script lang="ts">
	import { onMount } from 'svelte';

	interface Record {
		id: number;
		name: string;
		address: string;
		age: number;
		dateofbirth: string;
		citizenship: string;
	}

	let records: Record[] = [];

	let formData = {
		name: '',
		address: '',
		age: '',
		dateofbirth: '',
		citizenship: ''
	};

	let editId: number | null = null;

	onMount(async () => {
		await loadRecords();
	});

	async function loadRecords() {
		const response = await fetch('/api/users');
		const result = await response.json();
		records = result.data;
	}

	async function handleSubmit() {
		const method = editId ? 'PUT' : 'POST';
		const body = editId ? { id: editId, ...formData } : formData;

		const response = await fetch('/api/users', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (response.ok) {
			resetForm();
			await loadRecords();
		}
	}

	function handleEdit(record: Record) {
		formData = {
			name: record.name,
			address: record.address,
			age: String(record.age),
			dateofbirth: record.dateofbirth,
			citizenship: record.citizenship
		};
		editId = record.id;
	}

	async function handleDelete(id: number) {
		if (confirm('Are you sure you want to delete this record?')) {
			await fetch('/api/users', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			await loadRecords();
		}
	}

	function resetForm() {
		formData = {
			name: '',
			address: '',
			age: '',
			dateofbirth: '',
			citizenship: ''
		};
		editId = null;
	}
</script>

<div class="space-y-8">
	<div class="bg-white p-6 rounded-lg shadow">
		<h2 class="text-2xl font-bold mb-4">{editId ? 'Edit Record' : 'Add New Record'}</h2>
		<form on:submit|preventDefault={handleSubmit} class="grid grid-cols-2 gap-4">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
				<input id="name" type="text" bind:value={formData.name} required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			</div>
			<div>
				<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
				<input id="address" type="text" bind:value={formData.address} required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			</div>
			<div>
				<label for="age" class="block text-sm font-medium text-gray-700">Age</label>
				<input id="age" type="number" bind:value={formData.age} required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			</div>
			<div>
				<label for="dateofbirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
				<input id="dateofbirth" type="date" bind:value={formData.dateofbirth} required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			</div>
			<div>
				<label for="citizenship" class="block text-sm font-medium text-gray-700">Citizenship</label>
				<input id="citizenship" type="text" bind:value={formData.citizenship} required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			</div>
			<div class="col-span-2 flex justify-end gap-4">
				{#if editId !== null}
					<button type="button" on:click={resetForm}
						class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">
						Cancel
					</button>
				{/if}
				<button type="submit"
					class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
					{editId !== null ? 'Update Record' : 'Add Record'}
				</button>
			</div>
		</form>
	</div>

	<div class="bg-white p-6 rounded-lg shadow">
		<h2 class="text-2xl font-bold mb-4">Records</h2>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizenship</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each records as record}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">{record.name}</td>
							<td class="px-6 py-4 whitespace-nowrap">{record.address}</td>
							<td class="px-6 py-4 whitespace-nowrap">{record.age}</td>
							<td class="px-6 py-4 whitespace-nowrap">{record.dateofbirth}</td>
							<td class="px-6 py-4 whitespace-nowrap">{record.citizenship}</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<button on:click={() => handleEdit(record)} class="text-blue-500 hover:underline mr-2">Edit</button>
								<button on:click={() => handleDelete(record.id)} class="text-red-500 hover:underline">Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
