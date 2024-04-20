import { Command, Args, Flags } from "@oclif/core";
import { fetchWord } from "../../api.js";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";
import { DomainWords } from "../../interfaces.js";
import { iterateArrayWords } from "../../helpers.js";
import TtyTable from "tty-table";

export default class Keywords extends Command {
  domainKeywords: string = '';
  suggestedWords: string[] = [];

  // NOTE: domain-seeker keywords check is to instantiate inquirer and the main application.
  // We Begin with some welcome message and then run the inquirer application.

  static readonly description = "Discover different domains from your keywords";

  async run(): Promise<void> {
    await this.ask();
  }

  spinner(message: string) {
    const spinner = ora(message).start();
    spinner.color = 'green';
    spinner.text = message;
    setTimeout(() => {
      spinner.succeed(message);
    }, 500);

    spinner.stop();
  }

  /**
* Prompts the user to enter their keywords.
* @returns The user's keywords.
*/
  async ask() {
    const questions = [
      {
        type: 'input',
        name: 'keywords',
        message: 'Enter your keywords',
        validate: (value: string) => {
          if (value.length < 1) {
            return 'Please enter some keywords';
          }
          return true;
        }
      }
    ];
    const keywordsObject = await inquirer.prompt(questions);
    let keywords: unknown;
    for (const word of Object.values(keywordsObject)) {
      if (typeof word === 'string') {
        keywords = word;
        // replace commas with spaces
        keywords = word.replace(/,/g, ' ');
      }
    }

    for (let key in keywordsObject) {
      if (keywordsObject.hasOwnProperty(key)) {
        keywordsObject[key] = keywordsObject[key].trim();
        let words: string = keywordsObject[key].replace(/,/g, '+');
        this.log(chalk.green(words));
        this.domainKeywords = words;
      }
    }

    this.getDomainKeywords(this.domainKeywords);
    
  }

  getDomainKeywords(keywords: string) {
    fetchWord(keywords).then((data: DomainWords[]) => {
      const array = iterateArrayWords(data);
      this.suggestedWords = array;
      this.chooseWords(this.suggestedWords);
    });
  }

  chooseWords(words: string[]) {
    
  }
}