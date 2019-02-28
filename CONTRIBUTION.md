
# How to Contribute

Tees is one of RingCentral's open source projects that is both under very active development and is also being used to ship code to some projects on RingCentral Integration. We're still working out the kinks to make contributing to this project as easy and transparent as possible, but we're not quite there yet. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

### Open Development

All work on `tees` happens directly on [GitHub](/). Both core team members and external contributors send pull requests which go through the same review process.

### Contribution Prerequisites

- You have Node installed at v8.0.0+/v9.0.0+ and Yarn at v1.2.0+.
- You are familiar with Git.

### Workflow and Pull Requests

We will do our best to keep `master` in good shape, with tests passing at all times. But in order to move fast, we will make API changes that your application might not be compatible with. We will do our best to communicate these changes and always version appropriately so you can lock into a specific version if need be.

Submitting a pull request, please make sure the following is done:

1.  Fork the [tees](https://github.com/unadlib/tees) repo and create your branch from `master`. A guide on how to fork a repository: https://help.github.com/articles/fork-a-repo/

    Open terminal (e.g. Terminal, iTerm, Git Bash or Git Shell) and type:

    ```sh
    git clone https://github.com/<username>/tees
    cd tees
    git checkout -b new_branch
    ```

    Note: Replace `<username>` with your GitHub username.

2.  Tees uses [Yarn](https://yarnpkg.com) for running development scripts. If you haven't already done so, please [install yarn](https://yarnpkg.com/en/docs/install).

3.  Run `yarn install`.

    ```sh
    yarn install
    ```

4.  If you've added code that should be tested, add tests. You can use watch mode that continuously transforms changed files to make your coding easier.

    ```sh
    yarn watch
    ```

5.  If you've implemented some feature or fixed some bugs. You must use `yarn commit` to make your new commit more normative.

  ```sh
  yarn commit
  ```

Other commands:

- `yarn lint` checks the code style.
- `yarn test` runs the complete test suite.
- `yarn build` creates a build folder with all the packages.
- `yarn prettier` format opinionated code with Prettier. 

##### Unit tests

Some of the packages within `tees` have a `__tests__` directory. This is where unit tests reside in. If the scope of your work only requires a unit test, this is where you will write it in. Tests here usually don't require much if any setup.

### Dealing with Bugs

We are using GitHub Issues for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.
