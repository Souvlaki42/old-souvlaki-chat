<script lang="ts">
	import { currentUser, pb } from "./pocketbase";
	import Modal from "./Modal.svelte";

	let username = "";
	let email = "";
	let password = "";

	let showLoginModal = false;
	let showSignUpModal = false;
	let signUpCompleted = false;

	async function login() {
		const user = await pb
			.collection("users")
			.authWithPassword(username, password);
		if (!pb.authStore.model.verified) pb.authStore.clear();
		console.log(user);
	}

	async function signUp() {
		try {
			const data = {
				username,
				name: username,
				email: email,
				password,
				passwordConfirm: password,
			};
			await pb.collection("users").create(data);
			await pb.collection("users").requestVerification(email);
		} catch (err) {
			console.error(err);
		}
	}

	function signOut() {
		pb.authStore.clear();
	}
</script>

<div class="header">
	<h1>Souvlaki Chat</h1>
	{#if $currentUser}
		<p class="user-in">
			<span>Signed in as {$currentUser.username}</span>
			<button on:click={signOut} class="btn logout-btn">Sign Out</button>
			<button
				on:click={() => window.scrollTo(0, document.body.scrollHeight)}
				class="btn">Scroll Down</button
			>
		</p>
	{:else}
		<Modal bind:showModal={showLoginModal}>
			<h2 slot="header">Login</h2>
			<form on:submit|preventDefault class="form">
				<input
					placeholder="Username"
					type="text"
					bind:value={username}
				/>
				<input
					placeholder="Password"
					type="password"
					bind:value={password}
				/>
				<button
					on:click={() => {
						login();
						showLoginModal = false;
					}}
					class="btn">Login</button
				>
				<button on:click={() => (showLoginModal = false)} class="btn"
					>Cancel</button
				>
				<form />
			</form></Modal
		>
		<Modal bind:showModal={showSignUpModal}>
			<h2 slot="header">
				Sign Up {#if signUpCompleted}
					- Please verify your email address!
				{/if}
			</h2>
			<form on:submit|preventDefault class="form">
				<input
					placeholder="Username"
					type="text"
					bind:value={username}
				/>
				<input placeholder="Email" type="email" bind:value={email} />
				<input
					placeholder="Password"
					type="password"
					bind:value={password}
				/>
				<button
					on:click={() => {
						signUp();
						signUpCompleted = true;
					}}
					class="btn">Sign Up</button
				>
				<button
					on:click={() => {
						showSignUpModal = false;
						signUpCompleted = false;
					}}
					class="btn">Cancel</button
				>
				<form />
			</form></Modal
		>
		<div class="user-out">
			<button
				on:click={() => {
					showSignUpModal = true;
					username = "";
					email = "";
					password = "";
				}}
				class="btn">Sign Up</button
			>
			<button
				on:click={() => {
					showLoginModal = true;
					username = "";
					email = "";
					password = "";
				}}
				class="btn">Login</button
			>
			<button
				on:click={() => window.scrollTo(0, document.body.scrollHeight)}
				class="btn">Scroll Down</button
			>
		</div>
	{/if}
</div>
