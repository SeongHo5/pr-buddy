import {Config} from "../src/types";
import {
    includesIgnoreKeywordsList,
    selectAssignees,
    selectReviewers,
    selectUsers,
    selectUsersFromGroups
} from "../src/utils";

describe('Utils 테스트', () => {
    const sampleConfig: Config = {
        enableAutoAssignReviewers: true,
        enableAutoAssignAssignees: 'author',
        reviewers: ['reviewer1', 'reviewer2'],
        assignees: ['assignee1', 'assignee2'],
        numberOfAssignees: 0,
        numberOfReviewers: 0,
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

    describe('selectReviewers 함수 테스트', () => {
        it('useReviewGroups가 활성화된 경우, reviewGroups에서 리뷰어를 선택해야 한다.', () => {
            const result = selectReviewers('author', sampleConfig);
            expect(result).toEqual(['reviewer1', 'reviewer3']);
        });

        it('useReviewGroups가 비활성화된 경우, reviewers에서 리뷰어를 선택해야 한다.', () => {
            const config = { ...sampleConfig, useReviewGroups: false };
            const result = selectReviewers('author', config);
            expect(result).toEqual(['reviewer1', 'reviewer2']);
        });
    });

    describe('selectAssignees 함수 테스트', () => {
        it("enableAutoAssignAssignees가 'author'인 경우, PR 생성자를 담당자로 선택해야 한다.", () => {
            const result = selectAssignees('author', sampleConfig);
            expect(result).toEqual(['author']);
        });

        it('enableAutoAssignAssignees가 boolean이 아닌 경우, 에러를 발생시켜야 한다.', () => {
            const config = { ...sampleConfig, enableAutoAssignAssignees: 'invalid' };
            expect(() => selectAssignees('author', config)).toThrow();
        });

        it('useAssigneeGroups가 활성화된 경우, assigneeGroups에서 담당자를 선택해야 한다.', () => {
            const config = { ...sampleConfig, enableAutoAssignAssignees: true };
            const result = selectAssignees('author', config);
            expect(result).toEqual(['assignee1', 'assignee3']);
        });

        it('useAssigneeGroups가 비활성화된 경우, assignees에서 담당자를 선택해야 한다.', () => {
            const config = { ...sampleConfig, enableAutoAssignAssignees: true, useAssigneeGroups: false };
            const result = selectAssignees('author', config);
            expect(result).toEqual(['assignee1', 'assignee2']);
        });
    });

    describe('selectUsersFromGroups 함수 테스트', () => {
        it('PR 생성자를 제외하고 선택된 유저 목록을 반환해야 한다.', () => {
            const groups = {
                group1: ['user1', 'user2','user3', 'user4']
            };
            const result = selectUsersFromGroups('user1', groups, 2);
            expect(result.length).toBe(2);
        });
    });

    describe('selectUsers 함수 테스트', () => {
        it('PR 생성자를 제외하고, desiredNumber만큼의 유저 목록을 반환해야 한다.', () => {
            const candidates = ['user1', 'user2', 'user3', 'user4'];
            const result = selectUsers('user1', candidates, 2);
            expect(result.length).toBe(2);
        });

        it('desiredNumber가 0인 경우, PR 생성자를 제외한 모든 유저 목록을 반환해야 한다.', () => {
            const candidates = ['user1', 'user2', 'user3', 'user4'];
            const result = selectUsers('user1', candidates, 0);
            expect(result).toEqual(['user2', 'user3', 'user4']);
        });
    });

    describe('includesIgnoreKeywordsList 함수 테스트', () => {
        it('제외할 단어 목록에 포함된 단어가 제목에 포함된 경우, true를 반환해야 한다.', () => {
            const result = includesIgnoreKeywordsList('This is a TEST PR', sampleConfig.ignoreKeywords);
            expect(result).toBe(true);
        });

        it('제외할 단어 목록에 포함된 단어가 제목에 포함되지 않은 경우, false를 반환해야 한다.', () => {
            const result = includesIgnoreKeywordsList('This is a completed PR', sampleConfig.ignoreKeywords);
            expect(result).toBe(false);
        });
    });

});
