const fetchData = async () => {
	return (await chrome.storage.sync.get('keywords')).keywords ?? [];
};

const register = async (keyword) => {
	const keywords = await fetchData();
	chrome.storage.sync.set({ keywords: [keyword, ...keywords] });
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	const { type, keyword } = message;

	if (type === 'register') {
		await register(keyword);
	}
});
