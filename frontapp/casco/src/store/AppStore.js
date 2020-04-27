const AppStore = {
	data: {
		token: "",
	},
	methods: {
		addToken(valor){
			AppStore.data.token=valor;
		}
	}
};

export default AppStore;