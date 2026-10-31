# Day 2 Vision Notes

## Agreed clothing vocabulary
Confirm these values with Member 4:
- Category: t_shirt, jeans, jacket
- Color: blue, black, green
- Season: summer, all_season, winter
- Occasion: casual, college, travel

## Sample files
- Sample wardrobe records: day2_sample_records.json
- AI prediction example: day2_prediction_example.json

## Model limitation
The model currently returns labels such as LABEL_17. The category mapping is unresolved, so I have not guessed the clothing category.

## Prediction scope
The current model provides a category label and score. It does not provide color, season, or occasion. Those values need to be provided separately or confirmed by the user.

## Questions for the team
- Member 4: Please confirm the category, color, season, and occasion vocabulary.
- Member 2: Does the prediction example fit the backend?
- Member 5: Do the sample record fields fit the planned clothing_items table?