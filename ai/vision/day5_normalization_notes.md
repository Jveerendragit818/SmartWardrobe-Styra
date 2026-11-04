# Day 5 Vision Normalization Notes

## Vocabulary status

**Provisional — waiting for Member 4 to confirm.**

Draft category values:
- `t_shirt`
- `jeans`
- `jacket`

Draft color values:
- `blue`
- `black`
- `green`

Draft season values:
- `summer`
- `all_season`
- `winter`

Do not treat these draft values as the agreed recommendation vocabulary until Member 4 confirms them.

## Aliases in `normalization.py`

These aliases are provisional and should match the current `ALIASES` dictionary:

| Field | Input alias | Normalized value |
|---|---|---|
| Category | `t shirt` (also matches `t-shirt` and `t_shirt` after cleanup) | `t_shirt` |
| Category | `jean` | `jeans` |
| Category | `jeans` | `jeans` |
| Category | `jacket` | `jacket` |
| Color | `blue` | `blue` |
| Color | `black` | `black` |
| Color | `green` | `green` |
| Season | `summer` | `summer` |
| Season | `winter` | `winter` |
| Season | `all season` (also matches `all-season` and `all_season` after cleanup) | `all_season` |

The normalizer trims spaces, converts text to lowercase, changes hyphens and underscores to spaces, and then checks the alias list. Values that are not in the agreed vocabulary stay unknown.

## Test cases

| Input | Confirmed by user? | Expected result |
|---|---|---|
| `t-shirt` as category | Yes | `t_shirt`, normalized |
| `all-season` as season | Yes | `all_season`, normalized |
| `LABEL_17` as category | No | No category value; needs review |
| `navy` as color, if not in Member 4’s vocabulary | Yes | No normalized value; unknown |
| Missing season | Yes | No value; missing |
| `jeans` guessed by the model but not confirmed | No | No value; needs review |

## Model limitations

- The current model’s category IDs are unmapped, so AI category accuracy cannot be checked.
- The model does not provide color or pattern, and does not predict season or occasion.
- Unknown and unconfirmed values must not be treated as recommendation inputs.
- Keep scores as model scores; they are not guarantees of correctness.