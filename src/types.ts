import * as github from '@actions/github'

export type Client = ReturnType<typeof github.getOctokit>

/**
 * Auto Assign의 설정 정보
 * @property enableAutoAssignReviewers 리뷰어 자동 지정 활성화 여부
 * @property enableAutoAssignAssignees 담당자 자동 지정 활성화 여부 / boolean 또는 'author'만 가능
 * @property reviewers 리뷰어 목록
 * @property assignees 담당자 목록
 * @property numberOfAssignees 할당할 담당자 수
 * @property numberOfReviewers 할당할 리뷰어 수
 * @property ignoreKeywords 제외할 단어 목록
 * @property useReviewGroups 리뷰 그룹 사용 여부
 * @property useAssigneeGroups 담당자 그룹 사용 여부
 * @property reviewGroups 리뷰어 그룹 목록
 * @property assigneeGroups 담당자 그룹 목록
 * @property runOnDraft Draft PR에도 워크플로우를 실행할지 여부
 */
export interface Config {
    enableAutoAssignReviewers: boolean
    enableAutoAssignAssignees: boolean | string
    reviewers: string[]
    assignees: string[]
    numberOfAssignees: number
    numberOfReviewers: number
    ignoreKeywords: string[]
    useReviewGroups: boolean
    useAssigneeGroups: boolean
    reviewGroups: { [key: string]: string[] }
    assigneeGroups: { [key: string]: string[] }
    runOnDraft?: boolean
}

export interface ConfigOption {
    owner: string;
    repo: string;
    path: string;
    ref: string;
}
