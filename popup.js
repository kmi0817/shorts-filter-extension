const fetchData = () => {
	return new Promise((resolve) => {
		chrome.storage.sync.get(['keywords'], (result) => {
			resolve(result['keywords'] ?? []);
		});
	});
};

const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};

const createKeywordNode = (keyword) => {
	const wrapper = document.createElement('div');
	wrapper.classList.add('keyword');
	wrapper.insertAdjacentHTML(
		'beforeend',
		`
    <span>${keyword}</span>
    <button type="button" class="delete-btn">
      <span class="material-symbols-outlined delete-icon"> delete_forever </span>
    </button>`
	);
	return wrapper;
};

const addClickEventOnDeleteBtn = (list, node) => {
	const deleteBtn = node.querySelector('.delete-btn');
	deleteBtn.addEventListener('click', () => {
		list.removeChild(node);
	});
};

const appendKeywordNode = (list, keyword) => {
	const node = createKeywordNode(keyword);
	list.insertAdjacentElement('beforeend', node);
	addClickEventOnDeleteBtn(list, node);
};

document.addEventListener('DOMContentLoaded', async () => {
	const currentTab = await getCurrentTab();
	const currentURL = currentTab.url;

	const form = document.querySelector('form');
	const registerBtn = form.querySelector('#register-btn');

	if (!currentURL.includes('youtube.com/shorts')) {
		const keywordInput = form.querySelector('#input-keyword');
		keywordInput.value = 'Unavailable in this page';
		keywordInput.disabled = true;
		registerBtn.disabled = true;
	} else {
		const keywordList = document.querySelector('#keyword-list');

		const keywords = await fetchData();
		keywords.forEach((word) => {
			appendKeywordNode(keywordList, word);
		});

		registerBtn.addEventListener('click', () => {
			const keywordInput = form.querySelector('#input-keyword');
			const keyword = keywordInput.value;

			if (!!keyword) {
				chrome.tabs.sendMessage(
					currentTab.id,
					{
						type: 'register',
						keyword,
					},
					(response) => {
						const { statusCode } = response;

						if (statusCode == 201) {
							appendKeywordNode(keywordList, keyword);
						} else {
							console.log(`** ${keyword} not registered`);
						}
					}
				);
			}

			keywordInput.value = '';
		});
	}
});
