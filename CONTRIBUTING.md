# Contributing to How do I AI this?

First off, thank you for considering contributing to How do I AI this?! It's people like you that make this extension better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

If you have a suggestion for the extension, we'd love to hear about it. Just create an issue with the enhancement tag and provide the following information:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow our style guides
* End all files with a newline

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

* Use TypeScript for all new code
* Use interfaces over types where possible
* Use explicit type annotations
* Follow the existing code style

### React Style Guide

* Use functional components with hooks
* Keep components small and focused
* Use proper prop types
* Follow the container/presentational pattern where applicable

### CSS/Tailwind Style Guide

* Use Tailwind utility classes
* Follow mobile-first responsive design
* Keep custom CSS to a minimum
* Use semantic class names when custom CSS is needed

## Development Process

1. Fork the repo and create your branch from `main`
2. Run `npm install` to install dependencies
3. Make your changes
4. Run `npm run lint` and `npm run type-check` to ensure your code meets our standards
5. Test your changes thoroughly
6. Push to your fork and submit a pull request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `dist` folder

## Questions?

Feel free to create an issue with the question tag if you have any questions about contributing. 