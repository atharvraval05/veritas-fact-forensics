<!-- Bug Report Template -->
name: 🐛 Bug Report
description: Report a bug to help us improve Veritas
labels: [bug]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!

  - type: textarea
    id: description
    attributes:
      label: Describe the bug
      description: A clear and concise description of what the bug is.
      placeholder: I encountered an issue when...
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Steps to reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to...
        2. Click on...
        3. See error...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What did you expect to happen?
      placeholder: The application should...
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots or logs
      description: If applicable, add screenshots or error logs
      placeholder: Paste error messages or screenshots here

  - type: input
    id: python-version
    attributes:
      label: Python version
      placeholder: e.g., 3.9, 3.10, 3.11
    validations:
      required: false

  - type: input
    id: os
    attributes:
      label: Operating System
      placeholder: e.g., Windows 10, macOS 12, Ubuntu 22.04
    validations:
      required: false

  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Any other relevant context
      placeholder: Add any other context about the problem...
