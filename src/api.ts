import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

// Dictionary
const wordAPIURL:string = 'https://api.datamuse.com/words?';
// if of selected keywords are available
const searchAPIURL: string = `https://domainr.p.rapidapi.com/v2/search?mashape-key=${process.env.SMASH_KEY}&query=`;
// if domain is available
const checkAvailableURL: string = `https://domainr.p.rapidapi.com/v2/status?mashape-key=${process.env.SMASH_KEY}&domain=`;

export const fetchWord = async (url: string, word: string):Promise<any> => {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        const data = await response.json();
        console.log('data',data);
        
        return data;
    } catch (error) {
        console.log('error',error);
        throw error;
    }
}

fetchWord(wordAPIURL+ 'ml=', 'fuzzy');