const fetchData = () => {
	return new Promise((resolve) => {
		chrome.storage.sync.get(['keywords'], (result) => {
			resolve(result['keywords'] ?? []);
		});
	});
};

const register = async (keyword) => {
	const keywords = await fetchData();
	const isDuplicated = keywords.some((word) => word === keyword);

	if (isDuplicated) {
		return { statusCode: 409, message: 'Conflict' };
	}

	chrome.storage.sync.set({ keywords: [keyword, ...keywords] });
	return { statusCode: 201, message: 'Created' };
};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	const { type, keyword } = message;

	if (type === 'register') {
		const result = await register(keyword);
		sendResponse(result);
	}
});
