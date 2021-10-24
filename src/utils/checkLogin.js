export const logged = () => {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem('auth-token') ? true : false;
	}
	return false;
};
