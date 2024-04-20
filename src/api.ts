import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

// Dictionary
const wordAPIURL:string = 'https://api.datamuse.com/words?ml=';
// if of selected keywords are available
const searchAPIURL: string = `https://domainr.p.rapidapi.com/v2/search?mashape-key=${process.env.SMASH_KEY}&query=`;
// if domain is available
const checkAvailableURL: string = `https://domainr.p.rapidapi.com/v2/status?mashape-key=${process.env.SMASH_KEY}&domain=`;
/**
 * Fetches a word from the API and returns the response data.
 *
 * @param {string} word - The word to fetch from the API.
 * @return {Promise<any>} A promise that resolves to the response data.
 */
export const fetchWord = async ( word: string):Promise<any> => {
    try {
        const response = await fetch('https://api.datamuse.com/words?ml=' + word + '&max=22');
        if(!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error',error);
        throw error;
    }
}

fetchWord(wordAPIURL);