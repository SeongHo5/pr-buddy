## Auto-Assign-PR

GitHub Actions Workflow 작성 Template

```yaml
name: Assign PR Reviewer & Assignee

on:
  pull_request:
    branches:
      - develop
      - pjt-01-develop
    types: [ opened, ready_for_review ]

  jobs:
    auto-assign:
      runs-on: ubuntu-latest
      steps:
        - name: Assign PR Reviewer & Assignee
          uses: SeongHo5/auto-assign-pr@{target_version}
          with:
            configuration-path: .github/auto-assign.yml # (상대)경로를 정확하게 지정해주세요.
```

Configuration 파일 작성 Template

```yaml
# ===== Reviwers 관련 설정 =====
# 리뷰어 자동 지정 활성화 여부
enableAutoAssignReviewers: boolean

# Reviewer로 지정할 인원 수
# 지정한 인원 수 만큼 후보 목록에서 랜덤으로 선택합니다.
# 0인 경우 reviewers 목록 또는 reviewersGroups 목록에서 전체 인원을 지정합니다.
numberOfReviewers: number

# Reviewer로 지정될 수 있는 후보 목록
reviewers: string[]

# ===== Assignees 관련 설정 =====
# 담당자 자동 지정 활성화 여부 / boolean 또는 'author'만 가능
# 'author'로 설정 시 PR 작성자를 담당자로 지정합니다.
enableAutoAssignAssignees: boolean | string

# Assignee로 지정될 수 있는 후보 목록 (Optional)
# enableAutoAssignAssignees가 'author'로 설정된 경우 작성할 필요 없음
numberOfAssignees: number

# Assignee로 지정될 수 있는 후보 목록 (Optional)
# enableAutoAssignAssignees가 'author'로 설정된 경우 작성할 필요 없음
assignees: string[]
  
# ===== 기타 =====
# Auto-Assign에서 제외할 키워드 목록
# 이 키워드가 PR 제목에 포함되어 있으면 Auto-Assign이 적용되지 않습니다.
ignoreKeywords: string[]

# Draft PR에도 Auto-Assign을 적용할지 여부
runOnDraft?: boolean
```
