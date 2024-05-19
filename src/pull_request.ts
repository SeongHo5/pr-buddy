import * as core from '@actions/core'
import { Context } from '@actions/github/lib/context'
import { Client } from './types'

export class PullRequest {

    private readonly client: Client;
    private readonly context: Context;

    constructor(client: Client, context: Context) {
        this.client = client
        this.context = context
    }

    async addReviewers(reviewers: string[]): Promise<void> {
        const { owner, repo, number: pull_number } = this.context.issue;
        const result = await this.client.rest.pulls.requestReviewers({
            owner,
            repo,
            pull_number,
            reviewers,
        });
        core.debug(JSON.stringify(result));
    }

    async addAssignees(assignees: string[]): Promise<void> {
        const { owner, repo, number: issue_number } = this.context.issue;
        const result = await this.client.rest.issues.addAssignees({
            owner,
            repo,
            issue_number,
            assignees,
        });
        core.debug(JSON.stringify(result));
    }

}
