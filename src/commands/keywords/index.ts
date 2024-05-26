import { Command, Args, Flags } from "@oclif/core";
import { fetchWord, searchDomains, checkDomain } from "../../api.js";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";
import { DomainWords, Domain } from "../../interfaces.js";
import { iterateArrayWords } from "../../helpers.js";
import TtyTable from "tty-table";
import cliProgress from "cli-progress";
import ansiColors from "ansi-colors";
const colors = ansiColors;

export default class Keywords extends Command {
  domainKeywords: string = '';
  suggestedWords: string[] = [];
  suggestedAvailableWords: string = '';
  chosenDomain: string = '';


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

  checkIfWordsAreCorrect(domain: string[]) {
    // loading spinner of org domains
    inquirer.prompt({ type: 'list', message: 'Please choose a suitable domain name', name: 'correct-keywords', choices: domain }).then((answers) => {
      const goodAnswers = answers['correct-keywords'];
      this.getDomainNames(goodAnswers);
    });
  }

  getDomainNames(domain: string) {
    searchDomains(domain).then((data: any) => {
      // create new progress bar
      const b1 = new cliProgress.SingleBar({
        format: 'Collecting potential domains |' + colors.cyan('{bar}') + '| {percentage}%',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });

      // start the progress bar
      b1.start(100, 0, {
        speed: '50'
      });

      // update the progress bar
      b1.increment();
      b1.update(100);

      // stop the progress bar
      this.spinner('Search is complete');
      b1.stop();

      const domainNames = data.results.flatMap((result: Domain) => [{ domain: result.domain, url: result.registerURL }]);
      this.checkIfDomainNameIsAvailable(domainNames);

    });
  }
  async checkIfDomainNameIsAvailable(domain: string[]) {
    const domaminMap = domain.map((d: any) => d.domain);

    for (const individualDomain of domaminMap) {
      const domainStatus = await checkDomain(individualDomain);
      console.log('domainStatus', domainStatus);
      if (domainStatus.status[0].summary === 'active') {
        this.spinner('Domain is available');
        this.chosenDomain = individualDomain;
        // !Fix: this needs to put the entire domain object into the method below.
        // this.createTable(this.chosenDomain);
        
      }
    }
  }

  createTable(words: DomainWords[]) {
    console.log('words', words);

    // check words against API to see if they are available.
    // TODO: CLI progress bar to check available domains

    const header = [
      { value: 'Domain' },
      { value: 'Status' },
      { value: 'Available', header: 'available', formatter: (value: string) => chalk.greenBright(value) },
    ];
    // map through each item so a single word can be shown in item
    const rows = words.map((word: Domain) => {

      const array = [word];


      return array;
    });

    this.log('rows', rows);

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