import fetch from 'node-fetch';
// Dictionary
const wordAPIURL:string = 'https://api.datamuse.com/words?';
// if of selected keywords are available
const searchAPIURL: string = `https://domainr.p.rapidapi.com/v2/search?mashape-key=g5EmMklvTxmshaeUxb08554AxZkep10CmVYjsn79N8yPZgem0B&query=`;
// if domain is available
const checkAvailableURL: string = `https://domainr.p.rapidapi.com/v2/status?mashape-key=g5EmMklvTxmshaeUxb08554AxZkep10CmVYjsn79N8yPZgem0B&domain=`;

export const fetchWord = async (url: string, word: string):Promise<any> => {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.log('error',error);
        throw error;
    }
}

fetchWord(wordAPIURL+ 'ml=', 'word');