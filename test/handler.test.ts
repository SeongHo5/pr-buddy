import {Client, Config} from "../src/types";
import {Context} from "@actions/github/lib/context";
import {doAutoAssign} from "../src/handler";

const mockClient: Client = {} as Client;
const mockContext: Context = {
    payload: {
        pull_request: {
            title: 'Mock PR',
            draft: false,
            user: {
                login: 'SeongHo5'
            },
            number: 1
        }
    },
    eventName: 'pull_request',
    sha: 'mock_sha',
    ref: 'mock_ref',
    workflow: 'mock_workflow',
    action: 'mock_action',
    actor: 'SeongHo5',
    job: 'mock_job',
    runNumber: 1,
    runId: 1,
    apiUrl: 'mock_api_url',
    serverUrl: 'mock_server_url',
    graphqlUrl: 'mock_graphql_url',
    issue: {
        owner: 'SeongHo5',
        repo: 'mock_repo',
        number: 1
    },
    repo: {
        owner: 'SeongHo5',
        repo: 'mock_repo'
    }
} as Context;
const mockConfig: Config = {
    enableAutoAssignReviewers: true,
    enableAutoAssignAssignees: 'author',
    reviewers: ['reviewer1', 'reviewer2'],
    assignees: ['assignee1', 'assignee2'],
    numberOfAssignees: 1,
    numberOfReviewers: 3,
    ignoreKeywords: ['TEST', 'Draft'],
    useReviewGroups: true,
    useAssigneeGroups: true,
    reviewGroups: {
        'devTeam1': ['reviewer1', 'reviewer3']
    },
    assigneeGroups: {
        'devTeam1': ['assignee1', 'assignee3']
    },
    runOnDraft: false,
};

jest.mock('../src/utils', () => ({
    includesIgnoreKeywordsList: jest.fn(),
    selectReviewers: jest.fn().mockReturnValue(['reviewer1', 'reviewer3']),
    selectAssignees: jest.fn().mockReturnValue(['author']),
}));

describe('Handler 테스트', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('PR이 존재하지 않는 경우, 에러를 발생시켜야 한다.', async () => {
        const context = {payload: {undefined}, ...mockContext} as Context;

        await expect(doAutoAssign(mockClient, context, mockConfig)).rejects.toThrow();
    });
    it('IgnoreKeywords가 포함된 PR의 경우, 워크플로우를 건너뛰어야 한다.', async () => {
        jest.mock('../src/utils', () => ({
            includesIgnoreKeywordsList: jest.fn().mockReturnValue(true)
        }));

        await expect(doAutoAssign(mockClient, mockContext, mockConfig)).rejects.toThrow(Error);
    });

    it('PR 타입이 Draft라면, 워크플로우를 건너뛰어야 한다.', async () => {
        const context = {payload: {pull_request: {draft: true}}, ...mockContext} as Context;

        await expect(doAutoAssign(mockClient, context, mockConfig)).rejects.toThrow();
    });
});

