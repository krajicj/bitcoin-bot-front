<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { runningSchedulers, runningProducts } from '../stores/apiStore.js';
	import AddForm from '../components/addScheduler.svelte';
	import {user} from './../stores/apiStore';


	onMount(async () => {
		//Todo stop access this page in layout
		if(!$user.token) return

		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/jobs/running';
		const schedulerResponse = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			}
		});

		if (schedulerResponse.ok) {
			const response = await schedulerResponse.json();
			runningSchedulers.set(response);
			console.log(response);
		} else if (schedulerResponse.status === 401) {
			goto(`/login`);
			return false;
		}
	});

	const deleteScheduler = async (schedulerId) => {
		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/jobs/' + schedulerId;
		const schedulerResponse = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			}
		});

		if (schedulerResponse.ok) {
			const response = await schedulerResponse.json();
			if (response.status === 'success') {
				runningSchedulers.update((running) => {
					return running.filter((scheduler) => {
						return scheduler.id !== schedulerId;
					});
				});
			}
		}
	};
</script>

<div class="schedulers-wrapper">
	<div class="schedulers">
		{#each $runningSchedulers as scheduler}
			<div class="scheduler-item">
				<div class="item-data">
					<i class="fas fa-robot scheduler-icon" />
					<div class="scheduler-main-info">
						<span class="data-side text-capitalize">
							{scheduler.orderData.side}
						</span>
						<span class="data-product">
							{scheduler.orderData.product_id.replace('-', ` for ${scheduler.orderData.funds} `)}
						</span>
					</div>
				</div>
				<div class="item-settings">
					<div class="scheduler-repeat-info">
						<div class="repeat-item-icon">
							<i class="fas fa-history" />
						</div>
						<div class="repeat-item"> 
							<div ><small>m</small></div>
							<div class="repeat-data">{scheduler.minute}</div>
						</div>
						<div class="repeat-item">
							<div><small>h</small></div>
							<div class="repeat-data">{scheduler.hour}</div>
						</div>
						<div class="repeat-item">
							<div><small>DoW</small></div>
							<div class="repeat-data">{scheduler.dayOfWeek}</div>
						</div>
						<div class="repeat-item"> 
							<div><small>DoM</small></div>
							<div class="repeat-data">{scheduler.dayOfMonth}</div>
						</div>
						<div class="repeat-item">
							<div><small>month</small></div>
							<div class="repeat-data">{scheduler.month}</div>
						</div>
						
					</div>
					<div class="item-controls">
						<i
							title="Delete scheduler"
							on:click={deleteScheduler(scheduler.id)}
							class="fas fa-trash danger"
						/>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<AddForm />
</div>

<style>
	.schedulers-wrapper {
		padding: 20px;
	}

	.scheduler-item {
		display: flex;
		padding: 10px;
		margin-bottom: 15px;
		background-color: #fff;
		color: black;
		border-radius: 15px;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.scheduler-item .item-data {
		justify-content: space-between;
	}

	.scheduler-item .item-data i.scheduler-icon {
		font-size: 2rem;
		margin-right: 10px;
	}
	.scheduler-item .item-data .scheduler-main-info {
		display: inline-flex;
		line-height: 2rem;
		gap: 0.25rem;
		vertical-align: bottom;
	}
	.scheduler-item .item-settings .scheduler-repeat-info {
		display: inline-flex;
		vertical-align: bottom;
		gap: .5rem;
	}

	.scheduler-item .item-settings {
		display: inline-flex;
		justify-content: space-between;
		line-height: 1rem;
		font-size: .8rem;
	}
	.scheduler-item .item-settings .repeat-item-icon {
		line-height: 2rem;
		margin-right: .5rem;
	}
	.scheduler-item .item-controls {
		display: inline-flex;
		margin-left: 2rem;
	}
	.scheduler-item .item-controls i {
		line-height: 2rem;
		vertical-align: text-top;
		opacity: 0.5;
	}

	.repeat-item div{
		width: fit-content;
		margin: auto;
	}

	.scheduler-item .item-controls i:hover {
		opacity: 1;
		cursor: pointer;
	}

	.scheduler-item .item-controls i.danger {
		color: #ff0000;
	}
</style>
