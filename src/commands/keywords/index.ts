import { Command, Args, Flags } from "@oclif/core";
import { fetchWord, searchDomains } from "../../api.js";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";
import { DomainWords } from "../../interfaces.js";
import { iterateArrayWords } from "../../helpers.js";
import TtyTable from "tty-table";
import cliProgress from "cli-progress";

export default class Keywords extends Command {
  domainKeywords: string = '';
  suggestedWords: string[] = [];
  suggestedAvailableWords: string = '';
  chosenKeywords: string = '';
  

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
    inquirer.prompt({ type: 'checkbox', message: 'Choose your keywords that best fit your domain', name: 'chosen-keywords', choices: words }).then((answers) => {
      const chosenKeywords = answers['chosen-keywords'];

      // Ora spinner
      const spinner = ora('Checking domains').start();
      spinner.color = 'green';
      spinner.succeed('Suggestions saved!');
      this.checkIfWordsAreCorrect(chosenKeywords);
    });
  }
  

  // Creates CLI progress bar and checks if the domain is available.

  // !NOTE: the user can only choose one word to then be able to retrieve the domain endings of .com or .org etc.




  // TODO: check if domain name is avaiable.
  // TODO: if domain is available, show the cost of the domain.
  checkIfWordsAreCorrect(domain: string[]) {
    // loading spinner of org domains
    inquirer.prompt({ type: 'list', message: 'Are these keywords correct?', name: 'correct-keywords', choices: domain }).then((answers) => {
      console.log('correct keywords:', answers['correct-keywords']);
      this.log('Ready to go');
    });
    // searchDomains(this.domainKeywords).then((data: string[]) => {
    //   const array = iterateArrayWords(data);
    //   this.suggestedWords = array;
    //   console.log('domain ok', this.suggestedWords);
    // });
  }

  createTable(words: DomainWords[]) {
    // console.log('words', words);

    // check words against API to see if they are available.
    // TODO: CLI progress bar to check available domains

    const header = [
      { value: 'Domain' },
      { value: 'Cost' },
      { value: 'Available', header: 'available', formatter: (value: string) => chalk.greenBright(value) },
    ];
    // map through each item so a single word can be shown in item
    const rows = words.map((word: DomainWords) => {
      const array = [word];
      return array;
    });

    const options = {
      borderStyle: "solid",
      borderColor: "green",
      paddingBottom: 0,
      headerAlign: "center",
      headerColor: "green",
      align: "center",
      color: "white",
      width: "80%",
    };

    const table = TtyTable(header, rows, [], options).render();
    console.log(table);
  }




}