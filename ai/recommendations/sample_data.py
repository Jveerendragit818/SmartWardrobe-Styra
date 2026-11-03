
# SmartWardrobe - Sample Wardrobe Dataset

WARDROBE = [
    {
        "id": "item_001",
        "user_id": "user_001",
        "name": "White Cotton T-Shirt",
        "category": "tshirt",
        "color": "white",
        "season": "summer",
        "occasion": ["college", "casual"],
        "style": ["minimal", "casual"],
        "image_path": "user_001/item_001/white_tshirt.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed",
            "season": "ai_predicted",
            "occasion": "user_confirmed"
        }
    },
    {
        "id": "item_002",
        "user_id": "user_001",
        "name": "Blue Formal Shirt",
        "category": "shirt",
        "color": "blue",
        "season": "all_season",
        "occasion": ["formal", "college"],
        "style": ["formal"],
        "image_path": "user_001/item_002/blue_shirt.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "ai_predicted",
            "season": "user_confirmed",
            "occasion": "user_confirmed"
        }
    },
    {
        "id": "item_003",
        "user_id": "user_001",
        "name": "Blue Denim Jeans",
        "category": "jeans",
        "color": "blue",
        "season": "all_season",
        "occasion": ["college", "casual"],
        "style": ["casual", "streetwear"],
        "image_path": "user_001/item_003/blue_jeans.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed",
            "season": "ai_predicted",
            "occasion": "user_confirmed"
        }
    },
    {
        "id": "item_004",
        "user_id": "user_001",
        "name": "Black Formal Trousers",
        "category": "trousers",
        "color": "black",
        "season": "all_season",
        "occasion": ["formal", "college"],
        "style": ["formal"],
        "image_path": "user_001/item_004/black_trousers.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed",
            "season": "user_confirmed",
            "occasion": "user_confirmed"
        }
    },
    {
        "id": "item_005",
        "user_id": "user_001",
        "name": "White Sneakers",
        "category": "shoes",
        "color": "white",
        "season": "all_season",
        "occasion": ["college", "casual"],
        "style": ["casual", "sporty"],
        "image_path": "user_001/item_005/white_shoes.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed"
        }
    },
    {
        "id": "item_006",
        "user_id": "user_001",
        "name": "Black Jacket",
        "category": "jacket",
        "color": "black",
        "season": "winter",
        "occasion": ["casual", "college"],
        "style": ["streetwear", "casual"],
        "image_path": "user_001/item_006/black_jacket.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "ai_predicted",
            "season": "user_confirmed"
        }
    },
    {
        "id": "item_007",
        "user_id": "user_001",
        "name": "Black Party Dress",
        "category": "dress",
        "color": "black",
        "season": "all_season",
        "occasion": ["party", "formal"],
        "style": ["minimal", "formal"],
        "image_path": "user_001/item_007/black_dress.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed"
        }
    },
    {
        "id": "item_008",
        "user_id": "user_001",
        "name": "Beige Casual Shirt",
        "category": "shirt",
        "color": "beige",
        "season": None,
        "occasion": ["college", "casual"],
        "style": ["minimal", "casual"],
        "image_path": "user_001/item_008/beige_shirt.jpg",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_corrected",
            "season": "unknown"
        }
    }
]
