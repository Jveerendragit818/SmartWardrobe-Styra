
# SmartWardrobe - Recommendation API Contract

## 1. Purpose

This document defines communication between the
SmartWardrobe backend and recommendation engine.

The recommendation engine generates personalized
outfits using wardrobe data and user preferences.

## 2. Recommendation Input

The engine accepts:

- Wardrobe items
- Occasion
- Weather information
- User preferences
- Recently worn outfits
- Recommendation limit

## 3. Example Request

{
  "occasion": "college",
  "weather": {
    "season": "summer",
    "condition": "sunny"
  },
  "user_preferences": {
    "styles": ["casual", "minimal"],
    "colors": ["white", "black"]
  },
  "recent_outfits": [
    ["item_001", "item_003", "item_005"]
  ],
  "limit": 5
}

## 4. Example Response

{
  "success": true,
  "recommendations": [
    {
      "item_ids": [
        "item_002",
        "item_004",
        "item_005"
      ],
      "score": 0.855,
      "component_scores": {
        "color": 1.0,
        "occasion": 1.0,
        "weather": 1.0,
        "preference": 0.1667,
        "novelty": 0.8
      },
      "reasons": [
        "Colour compatibility: 1.00",
        "Occasion suitability: 1.00",
        "Weather suitability: 1.00",
        "Style preference: 0.17",
        "Outfit novelty: 0.80"
      ]
    }
  ]
}

## 5. Scoring Method

Total recommendation score:

S = 0.30C + 0.25O + 0.20W + 0.15P + 0.10N

C = Colour compatibility
O = Occasion suitability
W = Weather suitability
P = User preference
N = Outfit novelty

## 6. Python Integration

The backend can call:

recommend_outfits(
    wardrobe,
    occasion="college",
    limit=5,
    weather=weather,
    user_preferences=preferences,
    recent_outfits=history
)

## 7. Responsibilities

Member 2:
- Backend API implementation
- Authenticated wardrobe retrieval
- Request and response handling

Member 4:
- Recommendation algorithm
- Outfit compatibility
- Scoring and ranking
- Recommendation explanations

## 8. Future Enhancements

- Live weather integration
- Feedback-based personalization
- Advanced colour matching
- Outfit history integration
- Generative AI stylist
