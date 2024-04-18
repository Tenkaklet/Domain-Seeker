import { Command, Args, Flags } from "@oclif/core";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";


export default class Keywords extends Command {

  // NOTE: domain-seeker keywords check is to instantiate inquirer and the main application.
  // We Begin with some welcome message and then run the inquirer application.

  static readonly description = "Discover different domains from your keywords";

  async run(): Promise<void> {
    this.spinner('Welcome to Domain Seeker.');
    this.ask();
 }

  spinner(message: string) {
    const spinner = ora(message).start();
    spinner.color = 'green';
    spinner.text = message;
    setTimeout(() => {
      spinner.succeed(message);
    }, 500);

    spinner.stop();
    this.note('Working');
  }

  note(msg:string) {
    this.log(`${chalk.red('Welcome to ') } ${chalk.green('Domain') } ${chalk.yellow('Seeker') }`);
  }

  // Inquier array of keywords.
  a
  async ask() {
    const questions = [
      {
        type: 'input',
        name: 'keywords',
        message: 'Enter your keywords',
        validate: (value: string) => {
          if (value.length < 1) {
            return 'Please enter keywords';
          }
          return true;
        }
      }
    ];
    const answers = await inquirer.prompt(questions);
    return answers;
  }
}