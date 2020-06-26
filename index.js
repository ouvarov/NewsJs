const input = document.querySelector('.search__input');
const paginationClass = document.querySelector('.pagination').classList;
const checkBox = document.querySelector('.search__check');
const newsBlock = document.querySelector('.news');
let pageCounter = 1;

const fetchNews = (topic) => {
	let url = `http://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&pageSize=10&page=${pageCounter}&apiKey=e694d9cdc2964ac8bd46732096b96936`;
	fetch(url)
		.then(response => response.json())
		.then(data => checkBox.checked === true ? renderNewsWithScroll(data.articles) : renderNews(data.articles));
};

const searchNews = () => {
	newsBlock.innerHTML = '';
	pageCounter = 1;
	fetchNews(input.value);
};

const lazyLoading = () => {
	document.getElementsByTagName('body')[0].onscroll = function () {
		let positionIndicator = document.querySelector('.news__indicator').getBoundingClientRect().top - document.documentElement?.clientHeight;
		if (positionIndicator <= 0 && checkBox.checked === true) {
			pageCounter++;
			fetchNews(input.value);
		}
	};
	checkBox.checked === true ? paginationClass.remove('pagination--active') : paginationClass.add('pagination--active')
};

const pagination = () => {
	for (let counter = 1; counter <= 10; counter++) {
		const newButton = document.createElement('button');
		document.querySelector('.pagination').appendChild(newButton);
		newButton.textContent = counter;
		newButton.className = "pagination__button";
		newButton.onclick = function () {
			pageCounter = counter;
			fetchNews(input.value)
		};
	}
};

const getPublishDate = (date) => {
	const localDate = new Date();
	const publishDate = new Date(date);

	if (localDate.getFullYear() < publishDate.getFullYear()) {
		const differenceYear = publishDate.getFullYear() - localDate.getFullYear();
		return `Published ${differenceYear > 1 ? `${differenceYear} years ago` : `${differenceYear} year ago`}`
	} else if (localDate.getMonth() > publishDate.getMonth()) {
		const differenceMonth = publishDate.getMonth() - localDate.getMonth();
		return `Published ${differenceMonth > 1 ? `${differenceMonth} months ago` : `${differenceMonth} month ago`}`
	} else if (localDate.getDate() > publishDate.getDate()) {
		const differenceDay = localDate.getDate() - publishDate.getDate();
		return `Published ${differenceDay > 1 ? `${differenceDay} days ago` : `${differenceDay} day ago`}`
	} else if (localDate.getHours() > publishDate.getHours()) {
		const differenceHour = localDate.getHours() - publishDate.getHours();
		return `Published ${differenceHour > 1 ? `${differenceHour} hours ago` : `${differenceHour} hour ago`}`
	} else if (localDate.getMinutes() > publishDate.getMinutes()) {
		const differenceMinutes = localDate.getMinutes() - publishDate.getMinutes();
		return `Published ${differenceMinutes > 1 ? `${differenceMinutes} minutes ago` : `${differenceMinutes} minute ago`}`
	} else {
		return 'Published less than a minute'
	}
};

const renderImage = (image) => {
	return image ? `<img class="news__image" src="${image}" alt="img">` : `<i class="news__image news__image--default">Icon not found</i>`
};

const mapNews = (arr) => {
	return arr.map((data) => {
		return `<div class="news__item">
                 <a class="news__link" href=${data.url} target="_blank">
                     ${data.title}
                 </a>
                 <div class="news__inner-wrap">
                     ${renderImage(data.urlToImage)}
                     <div class="news__description">
                         ${data.description}
                     </div>
                 </div>
                 <div class="news__author">
                     Author: ${data.author ? data.author : 'Unknown'}
                 </div>
                 <div class="news__data">
                     ${getPublishDate(data.publishedAt)}
                 </div>
             </div>`;
	});
};

const renderNews = (data) => {
	if (data) {
		paginationClass.add('pagination--active')
	}
	newsBlock.innerHTML = mapNews(data).join('');
};

const renderNewsWithScroll = (data) => {
	newsBlock.insertAdjacentHTML('beforeend', mapNews(data).join(''));
};
pagination();
