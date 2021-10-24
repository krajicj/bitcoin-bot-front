<script>
	import { prevent_default } from 'svelte/internal';
	import {user, keys} from './../stores/apiStore';


	let KEY = '';
	let PASS = '';
	let SECRET = '';

    let error = '';



	const setKeys = async () => {
		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/keys/';
		const responseRaw = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			},
			body: JSON.stringify({
                KEY,
                PASS,
                SECRET
			})
		});

		if (responseRaw.ok) {
			const response = await responseRaw.json();
			if (response.status !== 'error') {
				keys.set(response.keys);
				const addModal = document.getElementById('setKeysModal');
				const modal = bootstrap.Modal.getInstance(addModal);
				modal.hide();
				error = '';
			} else {
				error = response.msg;
			}
		}
	};
</script>

<button
	type="button"
	class="btn btn-success mb-3"
	data-bs-toggle="modal"
	data-bs-target="#setKeysModal"
>
	Set keys
</button>

<div
	class="modal fade"
	id="setKeysModal"
	tabindex="-1"
	aria-labelledby="setKeysModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="setKeysModalLabel">Set API keys</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if error !== ''}
					<div class="alert alert-danger" role="alert">
						{error}
					</div>
				{/if}

				<form on:submit|preventDefault={setKeys}>
					<div class="row mb-3">						
						<div class="col-sm-12">
							<label class="form-label" for="key">KEY</label>
							<input class="form-control" bind:value={KEY} type="text" name="key" />
						</div>
					</div>
				
					<div class="row mb-3">						
						<div class="col-sm-12">
							<label class="form-label" for="pass">PASS</label>
							<input class="form-control" bind:value={PASS} type="text" name="pass" />
						</div>
					</div>
				
					<div class="row mb-3">						
						<div class="col-sm-12">
							<label class="form-label" for="secret">SECRET</label>
							<input class="form-control" bind:value={SECRET} type="text" name="secret" />
						</div>
					</div>
				

					<button class="btn btn-primary" type="submit">Save</button>
				</form>
			</div>
		</div>
	</div>
</div>
