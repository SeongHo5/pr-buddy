import * as core from '@actions/core'
import { Context } from '@actions/github/lib/context'
import { Client } from './types'

export class PullRequest {

    private readonly client: Client;
    private readonly context: Context;

    constructor(client: Client, context: Context) {
        this.client = client;
        this.context = context;
    }

    /**
     * PR Reviewers를 지정합니다.
     * @param reviewers 지정할 리뷰어 목록
     */
    async assignReviewers(reviewers: string[]): Promise<void> {
        const { owner, repo, number: pull_number } = this.context.issue;
        const result = await this.client.rest.pulls.requestReviewers({
            owner,
            repo,
            pull_number,
            reviewers,
        });
        core.debug(JSON.stringify(result));
    }

    /**
     * PR Assignees를 지정합니다.
     * @param assignees 지정할 담당자 목록
     */
    async assignAssignees(assignees: string[]): Promise<void> {
        const { owner, repo, number: issue_number } = this.context.issue;
        const result = await this.client.rest.issues.addAssignees({
            owner,
            repo,
            issue_number,
            assignees,
        });
        core.debug(JSON.stringify(result));
    }

    /**
     * 현재 리뷰가 요청된 Reviewers 목록을 가져옵니다.
     */
    async getReviewers(): Promise<string[]> {
        const { owner, repo, number: pull_number } = this.context.issue;
        const result = await this.client.rest.pulls.listRequestedReviewers({
            owner,
            repo,
            pull_number,
        });
        return result.data.users.map((user) => user.login);
    }

}
