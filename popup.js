import { createKeywordNode, addClickEventOnDeleteBtn } from './javascript/utils.js';

const keywordList = document.querySelector('#keyword-list');
const form = document.querySelector('form');
const registerBtn = form.querySelector('#register-btn');

registerBtn.addEventListener('click', () => {
	const keywordInput = form.querySelector('#input-keyword');
	const keyword = keywordInput.value;

	if (!!keyword) {
		const node = createKeywordNode(keyword);
		keywordList.insertAdjacentElement('beforeend', node);
		addClickEventOnDeleteBtn(keywordList, node);
	}

	keywordInput.value = '';
});
