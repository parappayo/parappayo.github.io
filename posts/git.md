# Philosophy on Git

My take in summary,

* Git is a sharp tool
* Keep the repo config simple
* Prefer merge over rebase
* Use short-lived feature branches (aka Trunk-Based Development)
* Back-merge to keep merge requests clean
* Follow continuous intergration and clean code best practices

## Helpful Commands

* Create a local branch and check it out at the same time: `git branch -b my-branch-name`
* Pushing a local branch for the first time: `git push --set-upstream origin HEAD`
* Updating recursive submodules: `git submodule update --init --recursive`
* Discard unstaged changes: `git checkout -- .` (warning: destructive)
* Remove untracked files: `git clean -f` (warning: destructive)
* Forcefully revert local changes: `git reset --hard` (warning: destructive)
* Undo last local commit, keeping changes: `git reset HEAD^`

## Difficulty Multipliers

If more than one or two of these multipliers applies, reconsider your approach.

* Non-technical staff need write access to the repo
* Project members are not comfortable with CLI tools
* Project tracks revisions of un-mergeable assets
* Repo uses submodules, especially nested submodules
* Repo contains large files (eg. larger than 5 MB)
* Repo contains many files (eg. more than 1k files by count)
* Pace of commits is high (eg. more than 100 commits per day)
* CI/CD pipeline does not build & test feature branches
* Devs typically do not read their own diffs before committing
* Project members cannot be trusted with the ability to rewrite the project history

Note that if your project is a video game, you typically have at least three of these multipliers.

## Common Stumbling Points

* Project member has not pushed their commits and others need them
* File is checked into the repo and then added to gitignore
* Rebase causes a botched rewrite of repo history
* GUI tool uses unexpected git command flags, or is opaque about the commands used
* User is in detached head state and needs support to get back to a good state
* Project has nested submodules and user doesn't know how to update or init them

## Adult Bullying Playground

In my experience with git, the power that it affords comes with greater potential for abuse. Team members who are not considerate can inadvertantly make life difficult for their colleagues; in more extreme cases, bullies will study git esoterica and weaponize it against their colleagues. The git history can be re-written at will, the repo configuration can get complex, and the consequences of committing many large, un-mergeable asset files are more drastic with git than with tools such as Subversion or Perforce. These consequences are felt more keenly when some project members are less familiar with revision control best practices and see the repo as a glorified file-sharing site.

The benefits of using git are best realized with a mature continuous integration pipeline, code review process, and short-lived feature branches. Some teams may try to capture project management workflow in git by creating branches for Scrum epics or releases (where tags might be more appropriate), thereby encouraging long-lived feature branches. Code reviews are challenging in general and may turn toxic when the team culture is weak or if their purpose and limitations are not well understood by project management. If you are practicing [Dark Scrum](https://ronjeffries.com/articles/016-09ff/defense/) or [Faux-Agile](https://martinfowler.com/articles/agile-aus-2018.html) then adopting git may slow your team down rather than speeding it up.

There is some debate about merge-based versus rebased-based workflows. My preference is toward an accurate history rather than a clean history. Good tooling can make sense out of a tangled history of merges, and short-lived feature branches keep the history manageable.

# References

* [Oh shit, git!](http://ohshitgit.com/)
* [Git team workflows: merge or rebase](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase)
* [Git in Practice](https://github.com/GitInPractice)
* [Pro Git](https://git-scm.com/book/en/v2)
