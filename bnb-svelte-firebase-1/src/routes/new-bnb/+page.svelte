<script lang="ts">
	import { userStore } from 'sveltefire';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { auth, firestore } from '$lib/firebase';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import { addDoc, collection } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	const user = userStore(auth);

	let formData = {
		title: '',
		bathroomCount: '',
		category: '',
		description: '',
		createdAt: new Date(),
		guestCount: '',
		id: crypto.randomUUID(),
		location: '',
		price: '',
		roomCount: '',
		imgSrc: '',
		userId: $user?.uid || '',
		availableFrom: '',
		availableTo: '',
		totalAvailableRooms: ''
	};

	let selectedCategory = '';

	async function onSubmit() {
		if (!selectedCategory) {
			toast.error('Please select a category');
			return;
		}

		try {
			await addDoc(collection(firestore, 'listing'), {
				title: formData.title,
				description: formData.description,
				category: selectedCategory,
				location: formData.location,
				imgSrc: formData.imgSrc,
				userId: $user?.uid || '',
				createdAt: new Date(),
				isAvailable: true,
				price: parseInt(formData.price) || 0,
				guestCount: parseInt(formData.guestCount) || 0,
				roomCount: parseInt(formData.roomCount) || 0,
				bathroomCount: parseInt(formData.bathroomCount) || 0,
				availableFrom: formData.availableFrom,
				availableTo: formData.availableTo,
				totalAvailableRooms: parseInt(formData.totalAvailableRooms) || 0
			});
			toast.success('Listing added successfully');
			goto('/');
		} catch (err: any) {
			toast.error('Failed to add listing', { description: err.message });
		}
	}
</script>

<div class="container mx-auto py-8">
	<h2 class="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">Bnb your home</h2>
	<p class="text-muted-foreground">Fill out this form to list your property</p>

	<form on:submit|preventDefault={onSubmit} class="flex w-full flex-col gap-4 py-6 md:w-3/4">
		<div>
			<Label>Title</Label>
			<Input bind:value={formData.title} placeholder="e.g. Sea View Resort" required />
		</div>
		<div>
			<Label>Description</Label>
			<Textarea bind:value={formData.description} placeholder="Describe your property..." required />
		</div>
		<div>
			<Label>Location</Label>
			<Input bind:value={formData.location} placeholder="e.g. Goa, India" required />
		</div>
		<div>
			<Label>Category</Label>
			<select
				bind:value={selectedCategory}
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				required
			>
				<option value="" disabled>Select a category</option>
				<option value="hotel">Hotel</option>
				<option value="villa">Villa</option>
				<option value="apartment">Apartment</option>
				<option value="resort">Resort</option>
				<option value="beach">Beach</option>
			</select>
		</div>
		<div>
			<Label>Price per night (₹)</Label>
			<Input bind:value={formData.price} placeholder="e.g. 3500" type="number" min="0" required />
		</div>
		<div>
			<Label>Guest count</Label>
			<Input bind:value={formData.guestCount} placeholder="e.g. 4" type="number" min="1" required />
		</div>
		<div>
			<Label>Room count</Label>
			<Input bind:value={formData.roomCount} placeholder="e.g. 2" type="number" min="1" required />
		</div>
		<div>
			<Label>Bathroom count</Label>
			<Input bind:value={formData.bathroomCount} placeholder="e.g. 1" type="number" min="1" required />
		</div>
		<div>
			<Label>Image URL</Label>
			<Input bind:value={formData.imgSrc} placeholder="https://..." type="url" required />
			{#if formData.imgSrc}
				<img src={formData.imgSrc} alt="preview" class="mt-2 h-40 w-full rounded-md object-cover" />
			{/if}
		</div>
		<div>
			<Label>Total Available Rooms</Label>
			<Input bind:value={formData.totalAvailableRooms} placeholder="e.g. 5" type="number" min="1" required />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label>Available From</Label>
				<Input
					bind:value={formData.availableFrom}
					type="date"
					min={new Date().toISOString().split('T')[0]}
					required
				/>
			</div>
			<div>
				<Label>Available To</Label>
				<Input
					bind:value={formData.availableTo}
					type="date"
					min={formData.availableFrom || new Date().toISOString().split('T')[0]}
					required
				/>
			</div>
		</div>
		<Button type="submit" class="mt-2">Create my listing</Button>
	</form>
</div>
