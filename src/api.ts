import fetch from 'node-fetch';
// Dictionary
export const wordAPIURL = 'https://api.datamuse.com/words?';
// if of selected keywords are available
export const searchAPIURL = `https://domainr.p.rapidapi.com/v2/search?mashape-key=g5EmMklvTxmshaeUxb08554AxZkep10CmVYjsn79N8yPZgem0B&query=`;
// if domain is available
export const checkAvailableURL = `https://domainr.p.rapidapi.com/v2/status?mashape-key=g5EmMklvTxmshaeUxb08554AxZkep10CmVYjsn79N8yPZgem0B&domain=`;

export default (url: string) => fetch(url).then(res => res.json());