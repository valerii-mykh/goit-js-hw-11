import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import apiService from './js/apiService'
import markupElem from './js/markup';

const api = new apiService();
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0
}
const callback = function(entries, observer) {
    entries.forEach(entry => {
        if(entry.isIntersecting && entry.intersectionRect.bottom > 400) {
            fetchImages();
            hideLoadMoreBtn()
            observer.unobserve(entry.target);
        }
    });
};
const io = new IntersectionObserver(callback, options);

async function onSearchSubmit(event) {
    event.preventDefault();

    refs.galleryEl.innerHTML = '';
    api.resetPage();

    api.query = event.currentTarget.elements.searchQuery.value;
    

    refs.loadMoreBtn.classList.add('is-hidden');
    refs.submitBtn.classList.add('is-hidden');

    await fetchImages();
    await refs.submitBtn.classList.remove('is-hidden');

    if (event.currentTarget) {
        event.currentTarget.reset();
    }
}

refs.formEl.addEventListener('submit', onSearchSubmit);

async function onMoreBtnClick() {
    refs.loadMoreBtn.classList.add('is-hidden');

    await fetchImages();
    await smoothScroll();
}

refs.loadMoreBtn.addEventListener('click', onMoreBtnClick);

async function fetchImages() {
    try {
    const dataFetch = await api.fetchImages();
    await makeMarkup(dataFetch);
    } catch (error) {
    console.log(error);
    }

    await lightbox.refresh();
}


function makeMarkup(data) {
    if (!data) {
    hideLoadMoreBtn();
    return;
    } else if (data.hits.length < 40) {
    markup(data);
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    } else {
    markup(data);
    showLoadMoreBtn();
    const target = document.querySelector('.photo-card:last-child');
    io.observe(target);
    }
}


function smoothScroll() {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
    behavior: 'smooth',
    });
}

function hideLoadMoreBtn() {
    refs.loadMoreBtn.classList.add('visually-hidden');
}

function showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove('visually-hidden');
    refs.loadMoreBtn.classList.remove('is-hidden');
}

function markup(data) {
    const markup = data.hits.map(markupElem).join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}