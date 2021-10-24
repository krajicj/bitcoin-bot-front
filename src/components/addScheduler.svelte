<script>
	import { runningSchedulers } from '../stores/apiStore.js';
	import { onMount } from 'svelte';
	import { prevent_default } from 'svelte/internal';
	import { user } from './../stores/apiStore';

	let products = [];
	let error = '';

	const minutes = Array.from(Array(60).keys());
	const hours = Array.from(Array(24).keys());
	const daysOfMonth = Array.from(Array(31).keys()).map((item) => item + 1);
	const months = Array.from(Array(12).keys()).map((item) => item + 1);

	//Form vars
	let minute, hour, dayOfMonth, month, funds, type, side, product_id;


	let allDaysInWeek = true,
		monday,
		tuesday,
		wednesday,
		thursday,
		friday,
		saturday,
		sunday;

		

	onMount(async () => {
		if (!$user.token) return;

		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/jobs/products';
		const responseRaw = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			}
		});

		if (responseRaw.ok) {
			products = await responseRaw.json();
		}
	});

	const addScheduler = async () => {
		const url = localStorage.getItem('auth-serverAddress') + '/api/v1/jobs/';
		const responseRaw = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': $user.token
			},
			body: JSON.stringify({
				minute,
				hour,
				dayOfMonth,
				month,
				dayOfWeek: parseDayOfWeeks(),
				orderData: {
					funds,
					type,
					side,
					product_id
				}
			})
		});

		if (responseRaw.ok) {
			const response = await responseRaw.json();
			if (response.status !== 'error') {
				runningSchedulers.update((runningSchedulers) => {
					return [...runningSchedulers, response];
				});

				const addModal = document.getElementById('addSchedulerModal');
				const modal = bootstrap.Modal.getInstance(addModal);
				modal.hide();
				error = '';
			} else {
				error = response.msg;
			}
		}
	};

	const parseDayOfWeeks = () => {
		if (allDaysInWeek) return '*';
		let days = [];
		if (monday) days.push(1);
		if (tuesday) days.push(2);
		if (wednesday) days.push(3);
		if (thursday) days.push(4);
		if (friday) days.push(5);
		if (saturday) days.push(6);
		if (sunday) days.push(7);

		if (days.length) {
			return days.join();
		} else {
			return '*';
		}
	};
</script>

<button
	type="button"
	class="btn btn-success mb-3"
	data-bs-toggle="modal"
	data-bs-target="#addSchedulerModal"
>
	Add new scheduler
</button>

<div
	class="modal fade"
	id="addSchedulerModal"
	tabindex="-1"
	aria-labelledby="addSchedulerModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="addSchedulerModalLabel">Add new scheduler</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if error !== ''}
					<div class="alert alert-danger" role="alert">
						{error}
					</div>
				{/if}

				<form on:submit|preventDefault={addScheduler}>
					<div class="row mb-3">
						<div class="col-sm-6">
							<label class="form-label" for="product">Product</label>
							<input
								bind:value={product_id}
								name="product"
								class="form-control"
								list="productDatalistOptions"
								id="productDatalist"
								placeholder="Type to search..."
							/>
							<datalist id="productDatalistOptions">
								{#each products as product}
									<option value={product}>{product}</option>
								{/each}
							</datalist>
						</div>
						<div class="col-sm-6">
							<label class="form-label" for="funds">Funds</label>
							<input class="form-control" bind:value={funds} type="text" name="funds" />
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-2">
							<label class="form-label" for="minute">Minutes</label>
							<select class="form-select" bind:value={minute} name="minute">
								{#each minutes as minute}
									<option value={minute}>{minute}</option>
								{/each}
							</select>
						</div>
						<div class="col-sm-3">
							<label class="form-label" for="hour">Hours</label>
							<select class="form-select" bind:value={hour} name="hour">
								<option value="*">Every hour</option>
								{#each hours as hour}
									<option value={hour}>{hour}</option>
								{/each}
							</select>
						</div>
						<div class="col-sm-4">
							<label class="form-label" for="dayOfMonth">Day of month</label>
							<select class="form-select" bind:value={dayOfMonth} name="dayOfMonth">
								<option value="*">Does not matter</option>

								{#each daysOfMonth as dayOfMonth}
									<option value={dayOfMonth}>{dayOfMonth}</option>
								{/each}
							</select>
						</div>
						<div class="col-sm-3">
							<label class="form-label" for="month">Month</label>
							<select class="form-select" bind:value={month} name="month">
								<option value="*">Every month</option>

								{#each months as month}
									<option value={month}>{month}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-12">
							<label class="form-label" for="dayOfWeek">Day of week</label>
							<div class="days-inputs">
								<div class="day-block">
									<div class="label">All days in week</div>
									<input type="checkbox" bind:checked={allDaysInWeek} />
								</div>
								<div class="day-block">
									<div class="label">Mon</div>
									<input type="checkbox" bind:checked={monday} />
								</div>
								<div class="day-block">
									<div class="label">Tue</div>
									<input type="checkbox" bind:checked={tuesday} />
								</div>
								<div class="day-block">
									<div class="label">Wed</div>
									<input type="checkbox" bind:checked={wednesday} />
								</div>
								<div class="day-block">
									<div class="label">Thu</div>
									<input type="checkbox" bind:checked={thursday} />
								</div>
								<div class="day-block">
									<div class="label">Fri</div>
									<input type="checkbox" bind:checked={friday} />
								</div>
								<div class="day-block">
									<div class="label">Sat</div>
									<input type="checkbox" bind:checked={saturday} />
								</div>
								<div class="day-block">
									<div class="label">Sun</div>
									<input type="checkbox" bind:checked={sunday} />
								</div>
							</div>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-6">
							<label class="form-label" for="type">Type</label>
							<select class="form-select" bind:value={type} name="type">
								<option value="market">Market</option>
							</select>
						</div>
						<div class="col-sm-6">
							<label class="form-label" for="side">Side</label>
							<select class="form-select" bind:value={side} name="side">
								<option value="buy">Buy</option>
								<option value="sell">Sell</option>
							</select>
						</div>
					</div>

					<button class="btn btn-primary" type="submit">Save</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.days-inputs {
		display: flex;
		justify-content: space-between;
	}

	.day-block input {
		margin: auto;
	}
</style>
