const fetchData = async () => {
	return (await chrome.storage.sync.get('keywords')).keywords ?? [];
};

const register = async (keyword) => {
	const keywords = await fetchData();
	chrome.storage.sync.set({ keywords: [...keywords, keyword] });
};

const remove = async (keyword) => {
	const keywords = await fetchData();
	const index = keywords.indexOf(keyword);
	keywords.splice(index, 1);
	chrome.storage.sync.set({ keywords: keywords });
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	const { type, keyword } = message;

	if (type === 'register') {
		await register(keyword);
	} else if (type === 'remove') {
		await remove(keyword);
	}
});
