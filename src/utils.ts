import _ from 'lodash'
import * as yaml from 'js-yaml'
import {Client, Config, ConfigOption} from './types'

/**
 * PR Reviewers를 지정합니다.
 * @param owner PR을 생성한 유저
 * @param config Config 정보
 * @return 선택된 리뷰어 목록
 */
export function selectReviewers(owner: string, config: Config): string[] {
    const {
        useReviewGroups,
        reviewGroups,
        numberOfReviewers,
        reviewers,
    } = config;
    const useGroups: boolean = useReviewGroups && Object.keys(reviewGroups).length > 0;
    return useGroups
        ? selectUsersFromGroups(owner, reviewGroups, numberOfReviewers)
        : selectUsers(owner, reviewers, numberOfReviewers);
}

/**
 * PR Assignees를 지정합니다.
 * @param owner PR을 생성한 유저
 * @param config Config 정보
 */
export function selectAssignees(owner: string, config: Config): string[] {
    const {
        useAssigneeGroups,
        assigneeGroups,
        enableAutoAssignAssignees,
        numberOfAssignees,
        numberOfReviewers,
        assignees,
        reviewers,
    } = config
    const useGroups: boolean = useAssigneeGroups && Object.keys(assigneeGroups).length > 0;
    const desiredNumber: number = numberOfAssignees || numberOfReviewers;

    if (enableAutoAssignAssignees === 'author') {
        return [owner];
    } else if (typeof enableAutoAssignAssignees !== 'boolean') {
        throw new Error("설정 파일에서 addAssignees를 적용하는데 오류가 발생했습니다. 'addAssignees' 변수는 boolean 또는 'author'만 가능합니다.");
    }

    const candidates: string[] = assignees ? assignees : reviewers; // assignees가 없으면 reviewers를 사용
    return useGroups
        ? selectUsersFromGroups(owner, assigneeGroups, desiredNumber)
        : selectUsers(owner, candidates, desiredNumber);

}

/**
 * 그룹에서 유저를 선택합니다.
 * @param owner 제외할 유저
 * @param groups 그룹 목록
 * @param desiredNumber 선택할 유저 수
 * @returns 선택된 유저 목록
 */
export function selectUsersFromGroups(
    owner: string,
    groups: { [key: string]: string[] } | undefined,
    desiredNumber: number
): string[] {
    return Object.values(groups).flatMap((group: string[]) => selectUsers(owner, group, desiredNumber));
}

/**
 * 후보자 목록 중에서 원하는 수만큼 선택합니다.
 * @param filterUser 제외할 유저
 * @param candidates 후보자 목록
 * @param desiredNumber 선택할 유저 수(0이면 모두 선택)
 */
export function selectUsers(filterUser: string = '', candidates: string[], desiredNumber: number): string[] {
    // PR을 생성한 유저는 후보자 목록에서 제외합니다.
    const filteredCandidates: string[] = candidates.filter((reviewer: string): boolean => reviewer.toLowerCase() !== filterUser.toLowerCase());

    if (desiredNumber === 0) {
        return filteredCandidates;
    }

    return _.sampleSize(filteredCandidates, desiredNumber);
}

/**
 * PR 제목에 skipKeywords가 포함되어 있는지 검사합니다.
 * @param title PR 제목
 * @param skipKeywords 제외할 단어 목록
 */
export function includesIgnoreKeywordsList(title: string, skipKeywords: string[]): boolean {
    return skipKeywords.some((skipKeyword: string): boolean => title.toLowerCase().includes(skipKeyword.toLowerCase()));
}


/**
 * Client에게서 설정 파일을 읽어옵니다.
 * @param client Client
 * @param options 설정 파일 경로
 */
export async function fetchConfigFileFrom(client: Client, options: ConfigOption) {
    const {owner, repo, path, ref} = options;
    const result = await client.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
    });
    const data: any = result.data;

    if (!data.content) {
        throw new Error('설정 파일을 찾을 수 없습니다.');
    }

    const configString: string = Buffer.from(data.content, 'base64').toString();
    const parsedConfig = yaml.load(configString) as Partial<Config>;

    // parsedConfig로 config를 덮어써 기본값을 설정합니다.
    const config: Config = {
        enableAutoAssignReviewers: false,
        enableAutoAssignAssignees: false,
        reviewers: [],
        assignees: [],
        numberOfAssignees: 0,
        numberOfReviewers: 0,
        ignoreKeywords: [],
        useReviewGroups: false,
        useAssigneeGroups: false,
        keywordLists: {},
        keywordGroups: {},
        reviewGroups: {},
        assigneeGroups: {},
        runOnDraft: false,
        ...parsedConfig,
    };

    return config;
}
