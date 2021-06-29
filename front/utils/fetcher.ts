//도메인이 다르면 원래 쿠키 생성이 안되는데
// withCredentials를 넣으면쿠키가 생긴다.

import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
