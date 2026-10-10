---
description: 将当前 worktree 成果合并到主工作区并刷新主服务
argument-hint: "[worktree-slug]"
---

请执行 pmCloud worktree promote 流程。

目标：${1:-从当前对话历史上下文推断对应 worktree；如果没有可识别 worktree，则只刷新主工作区服务}

要求：
- 这不是默认动作，只有本命令触发时才执行。
- 用户通常在项目根目录与 agent 对话，不会进入具体 worktree；不要把当前 shell 目录等同于目标 worktree。
- 如果命令带了参数，优先使用参数作为 `.worktrees/<slug>`。
- 如果没有参数，先结合当前对话历史、最近创建或操作的 `.worktrees/<slug>/module.yaml`、分支名、端口、规划产物和已修改文件，推断本轮对话对应的 worktree。
- 如果只能推断出一个明确 worktree，继续执行 promote；如果存在多个候选且无法确定，先停下列出候选并说明需要用户指定，不要猜测合并。
- 如果当前对话历史中没有 worktree，或没有任何可信的 worktree 线索，则不要执行合并；只重启主工作区前后端服务，使用主工作区端口 `8000/8001`，并做最小 smoke test。
- 执行 promote 时，读取目标 `.worktrees/<slug>/module.yaml`，再读取并遵守相关仓库规则，确认影响的前端、后端、specs 仓库。
- 执行 promote 时，检查 worktree 和主工作区对应仓库的 git 状态。
- 如果主工作区存在未提交变更、合并冲突、测试失败、迁移风险或不清楚的覆盖风险，先停下并报告，不要强行覆盖。
- 将 worktree 中已完成的业务代码同步或合并到主工作区对应仓库。
- 如依赖文件变化，执行必要的依赖同步。
- 合并后重启主工作区对应服务，使用主工作区端口 `8000/8001`。
- 在主工作区端口做最小 smoke test。
- 最终说明：worktree 识别依据、影响仓库、合并方式、服务状态、验证结果、未处理风险；如果只是刷新服务，也要说明没有识别到 worktree。
