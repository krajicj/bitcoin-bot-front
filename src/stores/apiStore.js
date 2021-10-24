import { writable, derived } from 'svelte/store';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const runningSchedulers = writable([]);


/** Data transformation.
**/
export const runningProducts = derived(runningSchedulers, ($runningSchedulers) => {
    return $runningSchedulers.map(scheduleItem => scheduleItem.orderData.product_id);   
});

export const keys = writable({});


//Create persistent store with local storage
// https://stackoverflow.com/a/61300826/2933427
export const createWritableStore = (key, startValue) => {
    const { subscribe, set } = writable(startValue);
  
    return {
      subscribe,
      set,
      useLocalStorage: () => {
        const json = localStorage.getItem(key);
        if (json) {
          set(JSON.parse(json));
        }
  
        subscribe(current => {
          localStorage.setItem(key, JSON.stringify(current));
        });
      }
    };
  }
  
  export const user = createWritableStore('user', {});


