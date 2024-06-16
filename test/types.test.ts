import {Config, ConfigOption} from "../src/types";

const sampleConfig: Config = {
    enableAutoAssignReviewers: true,
    enableAutoAssignAssignees: 'author',
    reviewers: ['reviewer1', 'reviewer2'],
    assignees: ['assignee1', 'assignee2'],
    numberOfAssignees: 2,
    numberOfReviewers: 2,
    ignoreKeywords: ['WIP', 'Draft'],
    useReviewGroups: true,
    useAssigneeGroups: true,
    reviewGroups: {
        'devTeam1': ['reviewer1', 'reviewer3']
    },
    assigneeGroups: {
        'devTeam1': ['assignee1', 'assignee3']
    },
    runOnDraft: false
};

// 샘플 ConfigOption 객체
const sampleConfigOption: ConfigOption = {
    owner: 'owner',
    repo: 'repo',
    path: '.github/auto-assign.yml',
    ref: 'pjt-01-develop'
};

describe('Config 인터페이스 테스트', () => {
    it('동일한 Config 객체가 생성되어야 한다.', () => {
        // Given
        const expectedConfig: Config = {
            enableAutoAssignReviewers: true,
            enableAutoAssignAssignees: 'author',
            reviewers: ['reviewer1', 'reviewer2'],
            assignees: ['assignee1', 'assignee2'],
            numberOfAssignees: 2,
            numberOfReviewers: 2,
            ignoreKeywords: ['WIP', 'Draft'],
            useReviewGroups: true,
            useAssigneeGroups: true,
            reviewGroups: {
                'devTeam1': ['reviewer1', 'reviewer3']
            },
            assigneeGroups: {
                'devTeam1': ['assignee1', 'assignee3']
            },
            runOnDraft: false
        };

        // When & Then
        expect(sampleConfig).toEqual(expectedConfig);
    });

    it('동일한 ConfigOption 객체가 생성되어야 한다.', () => {
        // Given
        const expectedConfigOption: ConfigOption = {
            owner: 'owner',
            repo: 'repo',
            path: '.github/auto-assign.yml',
            ref: 'pjt-01-develop'
        };

        // When & Then
        expect(sampleConfigOption).toEqual(expectedConfigOption);
    });
});
