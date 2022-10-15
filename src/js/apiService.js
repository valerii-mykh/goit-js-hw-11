
const API_KEY = '28590338-d8bd85ed8cacc4ff76ae71c31';

export default fetchQuery;

function fetchQuery(query, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${pageNumber}&per_page=6&key=${API_KEY}`,
  ).then(response => response.json());
}
import apiService from './apiService';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
apiService.defaults.baseURL = 'https://pixabay.com/api/';


export default class PixabayAPI {
    constructor() {
    this.searchQuery = '';
    this.page = 1;
    }

    async fetchImages() {
    const configPix = {
        URL: 'https://pixabay.com/api/',
        key: '28590338-d8bd85ed8cacc4ff76ae71c31',
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    };

    try {
        const response = await apiService.get(
        `${configPix.URL}?key=${configPix.key}&q=${this.searchQuery}&page=${this.page
        }&per_page=${configPix.per_page}&image_type=${configPix.image_type}&orientation=${configPix.orientation
        }&safesearch=${configPix.safesearch}`
        );

        if (response.data.total === 0) {
        Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
        }

        if (this.page === 1) {
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }

        this.page += 1;

        return response.data;
        
    } catch (error) {
        if (error.response.status === 400) {
        Notify.info(
            `We're sorry, but you've reached the end of search results.`
        );
        }
        console.log(error);
    }
    }
    
resetPage() {
    this.page = 1;
}

get query() {
    return this.searchQuery;
}

set query(newQuery) {
    this.searchQuery = newQuery;
}
}