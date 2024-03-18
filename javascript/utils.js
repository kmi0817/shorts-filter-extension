export const createKeywordNode = (keyword) => {
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

export const addClickEventOnDeleteBtn = (list, node) => {
	const deleteBtn = node.querySelector('.delete-btn');
	deleteBtn.addEventListener('click', () => {
		list.removeChild(node);
	});
};
