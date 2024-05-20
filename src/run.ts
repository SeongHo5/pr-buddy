import * as core from '@actions/core'
import * as github from '@actions/github'
import * as utils from './utils'
import * as handler from './handler'
import {Config, ConfigOption} from "./types";

export async function run() {
    try {
        const token: string = core.getInput('repo-token', {required: true})
        const configPath: string = core.getInput(
            'config',
            {required: true,}
        );

        const client = github.getOctokit(token);
        const {repo, sha} = github.context;
        const option: ConfigOption = {
            owner: repo.owner,
            repo: repo.repo,
            path: configPath,
            ref: sha
        };
        const config: Config = await utils.fetchConfigFileFrom(client, option);

        await handler.startPRAutoAssign(client, github.context, config);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
