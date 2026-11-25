# Lab environment monitoring station (Week 12 example)

Object-Oriented Analysis and Design × AI-assisted development. No hardware is needed: the example runs with simulated sensors.

The documents, code comments, and program messages are in Traditional Chinese. The English Week 12 slides explain every file and step used in class.

## Setup

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -e ".[dev]"
```

## Run

```bash
python -m lab_monitor     # demo: 8 sampling rounds
pytest                    # tests for the main program (all should pass)
mypy src                  # type checking
```

## Files

| Path | Contents |
|---|---|
| `docs/requirements.md` | Requirements, clarifying questions, user stories, use cases, out of scope |
| `docs/design.md` | Domain model, class diagram, sequence diagrams, responsibilities, design decisions |
| `docs/crc-cards.md` | CRC cards and scenario role-play |
| `docs/prompts.md` | Prompt templates for each stage |
| `docs/review-checklist.md` | Review checklist for AI output |
| `docs/ai-log-template.md` | AI usage log (material for the final project reflection) |
| `AGENTS.md` | Project rules for AI assistants |
| `src/lab_monitor/` | Main program |
| `tests/` | Tests for the main program |
| `exercises/a_rate_rule/` | Exercise A: rate-of-change alert |
| `exercises/b_cooldown/` | Exercise B: alert cooldown |
| `exercises/flawed_design/` | Spot the flaws in an AI design |

## Class exercises

```bash
pytest exercises/a_rate_rule   # fails at first; should pass when you finish
pytest exercises/b_cooldown
```

Rule: **do not modify the test files**. The tests are the contract between you and the AI.
