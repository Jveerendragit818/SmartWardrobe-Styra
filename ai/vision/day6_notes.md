# Day 6 Vision Context Notes

## Selected vocabulary for Member 4 review

Categories: `t_shirt`, `shirt`, `jeans`, `dress`, `jacket`

Colors: `black`, `blue`, `light_blue`, `green`, `navy`, `red`, `multicolor`

## Context safety rules

- Include only user-confirmed, normalized category and color values.
- Ignore raw model labels such as `LABEL_17`, model guesses, and model scores.
- If a model guess conflicts with the user's confirmed value, use the user's value.
- Omit an item if its category is missing, unknown, or unconfirmed.
- Omit a color if it is missing, unknown, or unconfirmed.
- An empty usable wardrobe returns an empty `wardrobe_items` list.
- The backend must build context from the signed-in user's own saved wardrobe.

## Check result

`day6_test_context.py` passed: All Day 6 context checks passed.

## Handoff

Share the context format, vocabulary, and safety rules with Members 2 and 4. Member 4's vocabulary confirmation is still pending.