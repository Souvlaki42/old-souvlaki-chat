<script lang="ts">
	import { format } from "./formatter";
	import { currentUser, pb } from "./pocketbase";

	export let message;
  export let onUpdate;

	if (message.expand.user == null)
		message = {
			...message,
			expand: {
				...message.expand,
				user: {
					avatar: "",
					collectionId: "_pb_users_auth_",
					collectionName: "users",
					created: "2023-04-19 14:27:24.665Z",
					emailVisibility: false,
					id: "5252288728",
					name: "Deleted User",
					updated: "2023-04-19 14:47:18.088Z",
					username: "Deleted User",
					verified: true,
					expand: {},
				},
			},
		};

    async function onDelete() {
      await pb.collection("messages").delete(message.id);
    }
</script>

<div class="msg">
	<div class="msg-header">
		<img
			class="avatar"
			src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
			alt="avatar"
			width="40px"
		/>
		<small>
			Sent by @{message.expand?.user?.username}
		</small>
		<div
			class={`msg-icons ${
				!$currentUser ||
				!message.expand.user.id ||
				$currentUser.id !== message.expand.user.id
					? "hidden"
					: ""
			}`}
		>
			<i class="fas fa-edit edit-icon" on:click={() => onUpdate(message.id)} />
			<i class="fas fa-trash delete-icon" on:click={() => onDelete()} />
		</div>
	</div>
	<div>
		<p class="msg-text">{@html format(message.text)}</p>
	</div>
</div>
