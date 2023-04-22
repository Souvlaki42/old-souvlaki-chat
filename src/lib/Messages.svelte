<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { currentUser, pb } from "./pocketbase";
	import Message from "./Message.svelte";

	let currentMessage: string;
	let messages = [];
	let unsubscribe: () => void;
	let messageEdit = { now: false, id: "" };

	onMount(async () => {
		// Get initial messages
		const resultList = await pb.collection("messages").getList(1, 50, {
			sort: "created",
			expand: "user",
		});
		messages = resultList.items;

		// Subscribe to realtime messages
		unsubscribe = await pb
			.collection("messages")
			.subscribe("*", async ({ action, record }) => {
				if (action === "create") {
					// Fetch associated user
					const user = await pb
						.collection("users")
						.getOne(record.user);
					record.expand = { user };
					messages = [...messages, record];
				} else if (action === "update") {
          const user = await pb
						.collection("users")
						.getOne(record.user);
					record.expand = { user };
          let msgId = messages.findIndex(msg => msg.id === record.id);
          messages[msgId] = record;
				} else if (action === "delete") {
					messages = messages.filter((m) => m.id !== record.id);
				}
			});
	});

	// Unsubscribe from realtime messages
	onDestroy(() => {
		unsubscribe?.();
	});

	async function sendMessage() {
		const data = {
			text: currentMessage,
			user: $currentUser.id,
		};
		const createdMessage = await pb.collection("messages").create(data);
		currentMessage = "";
	}

	async function editMessage(id: string) {
		const message = await pb.collection("messages").getOne(id);
		await pb.collection("messages").update(message.id, {
			...message,
			text: currentMessage,
		});
		messageEdit = { now: false, id: "" };
		currentMessage = "";
	}

	async function onUpdateMessage(id: string) {
		const message = await pb.collection("messages").getOne(id);
		if (message == null) return;
		currentMessage = message.text;
		messageEdit = { now: true, id: id };
	}
</script>

<div class="messages">
	{#each messages as message (message.id)}
		<Message bind:message onUpdate={onUpdateMessage} />
	{/each}
</div>

<form
	on:submit|preventDefault={messageEdit.now === false
		? () => sendMessage()
		: () => editMessage(messageEdit.id)}
	class="chat-input"
>
	<input
		placeholder={messageEdit.now === false
			? "Send a message..."
			: "Edit a message..."}
		type="text"
		bind:value={currentMessage}
	/>
	<button disabled={!$currentUser} type="submit"
		>{messageEdit.now === false ? "Send" : "Update"}</button
	>
</form>
