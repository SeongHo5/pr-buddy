import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'
import * as utils from './utils'
import {PullRequest} from './pull_request'
import {Client, Config} from './types'
import {PullRequestEvent} from '@octokit/webhooks-types'

export async function doAutoAssign(client: Client, context: Context, config: Config) {
    if (!context.payload.pull_request) {
        throw new Error('the webhook payload is not exist');
    }

    const {pull_request: event} = context.payload as PullRequestEvent;
    const {title, draft, user, number} = event;
    const {
        ignoreKeywords,
        useReviewGroups,
        useAssigneeGroups,
        reviewGroups,
        assigneeGroups,
        enableAutoAssignReviewers,
        enableAutoAssignAssignees,
        numberOfReviewers,
        runOnDraft,
    } = config;
    const owner = user.login;
    const pr = new PullRequest(client, context);
    const currentReviewers = await pr.getReviewers();

    if (ignoreKeywords && utils.includesIgnoreKeywordsList(title, ignoreKeywords)) {
        core.info('PR 제목에 제외 설정한 단어가 포함되어 워크플로우를 건너뜁니다.');
        return;
    }
    if (!runOnDraft && draft) {
        core.info('PR 타입이 Draft이므로 워크플로우를 건너뜁니다.');
        return;
    }
    if (currentReviewers.length > numberOfReviewers) {
        core.info('이미 리뷰어가 지정되어 있으므로 워크플로우를 건너뜁니다.');
        return;
    }
    if (useReviewGroups && !reviewGroups) {
        throw new Error("[설정 오류]'useReviewGrups'가 true로 설정되어 있으므로 리뷰 그룹을 사용하려면 'reviewGroups' 변수를 설정해야 합니다.");
    }
    if (useAssigneeGroups && !assigneeGroups) {
        throw new Error("[설정 오류]'useAssigneeGroups'가 true로 설정되어 있으므로 담당자 그룹을 사용하려면 'assigneeGroups' 변수를 설정해야 합니다.");
    }


    if (enableAutoAssignReviewers) {
        try {
            config.numberOfReviewers -= currentReviewers.length;
            const reviewers: string[] = utils.selectReviewers(owner, config);

            if (reviewers.length > 0) {
                await pr.assignReviewers(reviewers);
                core.info(`PR #${number}에 다음 리뷰어를 자동으로 추가했습니다: ${reviewers.join(', ')}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                core.warning(error.message);
            }
        }
    }
    if (enableAutoAssignAssignees) {
        try {
            const assignees: string[] = utils.selectAssignees(owner, config);

            if (assignees.length > 0) {
                await pr.assignAssignees(assignees);
                core.info(`PR #${number}에 다음 담당자를 자동으로 추가했습니다: ${assignees.join(', ')}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                core.warning(error.message);
            }
        }
    }
}
