
const API_KEY = '28590338-d8bd85ed8cacc4ff76ae71c31';

export default fetchQuery;

function fetchQuery(query, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${pageNumber}&per_page=6&key=${API_KEY}`,
  ).then(response => response.json());
}
