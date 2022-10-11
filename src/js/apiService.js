
const API_KEY = '21800674-819b02d10e21d1802ff230ab2';

export default fetchQuery;

function fetchQuery(query, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${pageNumber}&per_page=6&key=${API_KEY}`,
  ).then(response => response.json());
}
