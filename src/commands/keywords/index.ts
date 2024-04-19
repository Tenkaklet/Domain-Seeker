import { Command, Args, Flags } from "@oclif/core";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";


export default class Keywords extends Command {

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
    const keywordsArray = await inquirer.prompt(questions);
    const ansewrs = Object.keys(keywordsArray).map(key => keywordsArray[key]);
    this.spinner(chalk.greenBright(`Keywords: ${ansewrs}`));
    return keywordsArray;
  }
}