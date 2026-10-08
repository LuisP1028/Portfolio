---
name: system-glossary-evaluation-parameters
hostname: local-workspace
description: A comprehensive glossary defining the strict evaluation parameters used for assessing code errors, correctness, functionality, and documentation sufficiency within the system.
---

# Evaluation Parameters

## {errors}
- Explicit failure states surfaced during the execution of a component.
- **Qualifiers:** Stack traces, syntax errors, unhandled exceptions, compilation failures, non-zero exit codes, fatal timeouts, or severe warnings that halt execution.

## {correctness}
- The precise, local execution of a specific component, verifying that it performs its designated task without logical flaws, even if no explicit `{errors}` are thrown.
- **Qualifiers:** The code processes data properly, math is accurate, loops terminate as expected, and data types are respected.

## {functionality}
- The broader, global objective or business logic the component is meant to achieve within the larger system.
- **Qualifiers:** Does the outcome solve the user's initial problem? Does it integrate seamlessly with the rest of the app?

## {correct required outputs}
- The exact, literal expected state after a component executes successfully. This must be objectively measurable.
- **Qualifiers:** Specific terminal log messages, exact return values (e.g., true, null), precise file state changes (e.g., "generates a file named data.json containing 5 specific keys"), or specific API response codes (e.g., 200 OK).

## {sufficient}
- The state of documentation where absolutely no ambiguity remains, and the coding assistant can proceed to implementation without guessing or hallucinating context.
- **Qualifiers:** All necessary file structures are provided, dependencies are listed, step-by-step logic is clearly outlined, edge cases are defined, and the `{correct required outputs}` are established.

## {insufficient}
- The state of documentation where critical context is missing, ambiguous, or contradictory, requiring the assistant to make assumptions to write code.
- **Qualifiers:** Missing file schemas, undefined variables, vague instructions (e.g., "make it look better"), missing error-handling parameters, or lack of context regarding how a component interacts with the broader codebase.

# Copy-Trading Glossary

## {Proxy (leader)}
- A tracked wallet whose positions the system is authorized to copy.

## {Operator (system / bot)}
- The deposit / trading wallet whose capital is sized and whose orders are placed.

## {conditionId}
- Polymarket market condition identifier for a binary (or parent) market. Relative conviction is keyed at least to `conditionId` and **outcome** (or equivalent token identity for that outcome).

## {Outcome / token leg}
- The specific tradeable side (e.g. Yes/No or named outcome) within or associated with a condition.

## {Proxy condition inventory}
- Proxy’s current holdings on that conditionId + outcome, in shares and/or mark or cost notional as defined by the product’s consistent inventory unit.

## {Proxy equity}
- Proxy’s total equity (or agreed capital base) used as the denominator for relative conviction.

## {Relative conviction (stock)}
- Fraction of proxy equity represented by proxy condition inventory: conceptually \(c = S_{proxy\_condition} / E_{proxy}\).

## {Relative conviction (trade / delta)}
- Fraction of proxy equity (or of proxy condition inventory) represented by a **change** in proxy condition inventory on an event: e.g. \(\Delta S / E_{proxy}\) or \(\Delta S / S_{proxy\_total\_on\_condition}\), as fixed in §5.

## {Operator capital base}
- Operator free bankroll and/or total equity used as the base to which relative conviction is applied (must be defined consistently; see §5.3).

## {Target operator notional}
- Dollar amount the operator **should hold or should add** on the condition/outcome after applying relative conviction.

## {Held operator notional}
- Dollar amount (or share-equivalent) the operator **already holds** on that condition/outcome.

## {Buy gap notional}
- \(\max(0,\ \text{target} - \text{held})\) — the only quantity that becomes a buy size under residual relative copy.

## {Fixed bankroll fraction}
- A constant or config fraction \(f\) of operator bankroll (e.g. \(f = 0.10\)) applied **without** reference to proxy condition inventory ratio. This is **not** acceptable as the effective entry size under this specification.

## {Copy-trading entry path}
- Any path that, in response to proxy trading or position change, produces a **BUY** intended to mirror proxy exposure.