import { createKeywordNode, addClickEventOnDeleteBtn, getCurrentURL } from './javascript/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
	const currentURL = await getCurrentURL();
	const form = document.querySelector('form');
	const registerBtn = form.querySelector('#register-btn');

	if (!currentURL.includes('youtube.com/shorts')) {
		const keywordInput = form.querySelector('#input-keyword');
		keywordInput.value = 'Unavailable in this page';
		keywordInput.disabled = true;
		registerBtn.disabled = true;
	} else {
		registerBtn.addEventListener('click', () => {
			const keywordList = document.querySelector('#keyword-list');

			const keywordInput = form.querySelector('#input-keyword');
			const keyword = keywordInput.value;

			if (!!keyword) {
				const node = createKeywordNode(keyword);
				keywordList.insertAdjacentElement('beforeend', node);
				addClickEventOnDeleteBtn(keywordList, node);
			}

			keywordInput.value = '';
		});
	}
});
