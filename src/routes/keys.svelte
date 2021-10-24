<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user, keys} from './../stores/apiStore';
    import SetKeys from './../components/setKeys.svelte'



	onMount(async () => {
		if (!$user.token) return;

		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/keys/';
		const responseRaw = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			}
		});

		if (responseRaw.ok) {
			const keysData = await responseRaw.json();
			keys.set(keysData);
		}
	});
</script>

<div class="keys-container">
	<div class="keys">
		<div class="key-record">
			<div class="key-label">KEY:</div>
			<div class="key">{$keys.key}...</div>
		</div>
		<div class="key-record">
			<div class="key-label">PASS:</div>
			<div class="key">{$keys.pass}...</div>
		</div>
		<div class="key-record">
			<div class="key-label">SECRET:</div>
			<div class="key">{$keys.secret}...</div>
		</div>
	</div>
    <SetKeys />
</div>

<style>
	.keys-container {
		width: 400px;
		margin: 20px auto;
	}

	.key-record {
		display: flex;
		padding: 10px;
		background: #fff;
        margin-bottom: 10px;
        color: black;
        border-radius: 10px;
	}

    .key-label{
        flex: 0.4;
    }

    .key{
        flex: 0.6
    }

</style>
