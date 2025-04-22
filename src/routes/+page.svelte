<script lang="ts">
    import { onMount } from 'svelte';

    interface Record {
        name: string;
        address: string;
        age: number;
        dateofbirth: string;
        citizenship: string;
    }

    // Mock data
    let records: Record[] = [
        {
            name: "John Doe",
            address: "123 Main St",
            age: 30,
            dateofbirth: "1994-01-15",
            citizenship: "USA"
        },
        {
            name: "Jane Smith",
            address: "456 Oak Ave",
            age: 25,
            dateofbirth: "1999-03-22",
            citizenship: "Canada"
        },
        {
            name: "Bob Johnson",
            address: "789 Pine Rd",
            age: 35,
            dateofbirth: "1989-07-10",
            citizenship: "UK"
        }
    ];

    let formData = {
        name: '',
        address: '',
        age: '',
        dateofbirth: '',
        citizenship: ''
    };

    onMount(async () => {
        await loadRecords();
    });

    async function loadRecords() {
        const response = await fetch('/api/users');
        const result = await response.json();
        records = result.data;
    }

    async function handleSubmit() {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Reset form
            formData = {
                name: '',
                address: '',
                age: '',
                dateofbirth: '',
                citizenship: ''
            };
            // Reload records
            await loadRecords();
        }
    }
</script>

<div class="space-y-8">
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Add New Record</h2>
        <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-2 gap-4">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={formData.name}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                <input
                    id="address"
                    type="text"
                    bind:value={formData.address}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label for="age" class="block text-sm font-medium text-gray-700">Age</label>
                <input
                    id="age"
                    type="number"
                    bind:value={formData.age}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label for="dateofbirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                    id="dateofbirth"
                    type="date"
                    bind:value={formData.dateofbirth}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label for="citizenship" class="block text-sm font-medium text-gray-700">Citizenship</label>
                <input
                    id="citizenship"
                    type="text"
                    bind:value={formData.citizenship}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div class="col-span-2">
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Record
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
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
