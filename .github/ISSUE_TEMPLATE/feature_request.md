<!-- Feature Request Template -->
name: ✨ Feature Request
description: Suggest an idea for improving Veritas
labels: [enhancement]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to suggest a feature!

  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: Describe the problem you're trying to solve
      placeholder: I'm always frustrated when...
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen
      placeholder: It would be great if...
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: Other ways to solve the problem
      placeholder: I also thought about...

  - type: textarea
    id: context
    attributes:
      label: Additional context
    attributes:
      description: Any other context or screenshots
      placeholder: Add any other context or examples...
