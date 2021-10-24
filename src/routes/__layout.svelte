<script>
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { user } from './../stores/apiStore';

	let loading = true;

	onMount(() => {		
		user.useLocalStorage();
		loading = false;
	});



	//TODO onMount functions in component are called anyway
	afterUpdate(() => {		
		if (!$user.token && location.pathname !== "/login") {
			goto('/login');
		}
	});

	//Logout function
	const logout = () => {
	  goto("/");
      user.set({});
	};
</script>

<nav class="navbar navbar-expand-md navbar-light bg-light">
	<div class="container-fluid">
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link" href="/">Home</a>
				</li>
				{#if $user.token && !loading}
					<li class="nav-item">
						<a class="nav-link" href="/keys">Keys</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/login" on:click={logout}>Logout</a>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="/login">Login</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

{#if !loading}
<div class="container"><slot /></div>
{/if}
