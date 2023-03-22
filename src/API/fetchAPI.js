import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

// let page = 1;
const per_page = 12;
let totalPages = 0;
let query = '';

export const fetchQuery = async (userQuery, page) => {
  query = userQuery;
  const options = `q=${query}&key=17568064-fe285d9450a7ecb893916a0ce&image_type=photo&orientation=horizontal&per_page=${per_page}&page=${page}`;
  const { data } = await axios.get(`?${options}`);
  return data;
};

export const calculateTotalPages = total => {
  totalPages = Math.ceil(total / per_page);
  console.log(totalPages);
};

export const resetTotalPages = () => {
  totalPages = 0;
};

export const isShowLoadMore = page => page < totalPages;
