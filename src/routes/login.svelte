<script>
	import { goto } from '$app/navigation';
	import { user } from './../stores/apiStore';

	let serverAddress = location.protocol + '//' + location.hostname + ':5000';
	let password;
	let showAddress = false;

	const login = async () => {
		//Login to the server
		const url = serverAddress + '/api/v1/login';

		const loginResponse = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ password })
		});

		if (loginResponse.ok) {
			const response = await loginResponse.json();

			//Add auth data to local storage
			user.set({ token: response.jwt });
			//localStorage.setItem('auth-token', response.jwt);
			localStorage.setItem('auth-serverAddress', serverAddress);

			goto('/', true);
		}

		//Redirect to home
	};
</script>

<div class="login-form">
	<form on:submit|preventDefault={login}>
		<div class="mb-3">
			<label class="form-label" for="app_password">Password</label>
			<input class="form-control" bind:value={password} type="password" name="app_password" />
		</div>
		<div class="d-flex mb-3">
			<input class="showmore-checkbox" type="checkbox" bind:checked={showAddress} />
			<div class="label">Show more options</div>
		</div>
		{#if showAddress}
			<div class="mb-3 ">
				<label class="form-label" for="server_address">Server address</label>
				<input class="form-control" bind:value={serverAddress} type="text" name="server_address" />
			</div>
		{/if}
		<button class="btn btn-primary" type="submit">Login</button>
	</form>
</div>

<style>
	.login-form {
		width: 400px;
		margin: 20px auto;
	}

	.showmore-checkbox{
		margin: auto 10px auto 0;
	}
</style>

