import { Command, Args, Flags } from "@oclif/core";

export default class Keywords extends Command {
    static override args = {
        check: Args.string({description: 'Input your keywords', required: true}),
    }

    static override description = "Discover different domains from your keywords";

    async run(): Promise<void> {
        const {args} = await this.parse(Keywords)
        // this.log(args) === that the user must put in check to begin inquirer application.
        this.log(`hello ${args.check}`)
      }  
}