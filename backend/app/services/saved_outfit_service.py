
from fastapi import HTTPException, status

from app.api.v1.routes.wardrobe import supabase_request


async def create_saved_outfit(current_user, title, item_ids):
    user_id = current_user["user_id"]
    item_ids = [str(item_id) for item_id in item_ids]

    wardrobe_items = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": "id",
            "user_id": f"eq.{user_id}",
            "id": f"in.({','.join(item_ids)})",
        },
    )

    if len(wardrobe_items or []) != len(item_ids):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="One or more clothing items do not belong to your wardrobe.",
        )

    outfits = await supabase_request(
        "POST",
        "saved_outfits",
        current_user,
        params={"select": "*"},
        payload={"user_id": user_id, "title": title},
        prefer="return=representation",
    )

    if not outfits:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not create the saved outfit.",
        )

    outfit = outfits[0]

    item_payload = [
        {
            "saved_outfit_id": outfit["id"],
            "clothing_item_id": item_id,
        }
        for item_id in item_ids
    ]

    try:
        await supabase_request(
            "POST",
            "saved_outfit_items",
            current_user,
            payload=item_payload,
            prefer="return=minimal",
        )
    except HTTPException:
        await supabase_request(
            "DELETE",
            "saved_outfits",
            current_user,
            params={
                "id": f"eq.{outfit['id']}",
                "user_id": f"eq.{user_id}",
            },
            prefer="return=minimal",
        )
        raise

    return outfit


async def list_saved_outfits(current_user):
    user_id = current_user["user_id"]

    outfits = await supabase_request(
        "GET",
        "saved_outfits",
        current_user,
        params={
            "select": "*",
            "user_id": f"eq.{user_id}",
            "order": "created_at.desc",
        },
    )

    if not outfits:
        return []

    outfit_ids = [str(outfit["id"]) for outfit in outfits]

    links = await supabase_request(
        "GET",
        "saved_outfit_items",
        current_user,
        params={
            "select": "saved_outfit_id,clothing_item_id",
            "saved_outfit_id": f"in.({','.join(outfit_ids)})",
        },
    )

    item_ids = list({
        str(link["clothing_item_id"])
        for link in (links or [])
    })

    items_by_id = {}

    if item_ids:
        wardrobe_items = await supabase_request(
            "GET",
            "clothing_items",
            current_user,
            params={
                "select": "*",
                "user_id": f"eq.{user_id}",
                "id": f"in.({','.join(item_ids)})",
            },
        )

        items_by_id = {
            str(item["id"]): item
            for item in (wardrobe_items or [])
        }

    links_by_outfit = {}

    for link in links or []:
        outfit_id = str(link["saved_outfit_id"])
        item_id = str(link["clothing_item_id"])
        item = items_by_id.get(item_id)

        if item is not None:
            links_by_outfit.setdefault(outfit_id, []).append(item)

    return [
        {
            **outfit,
            "items": links_by_outfit.get(str(outfit["id"]), []),
        }
        for outfit in outfits
    ]


async def delete_saved_outfit(current_user, outfit_id):
    rows = await supabase_request(
        "DELETE",
        "saved_outfits",
        current_user,
        params={
            "id": f"eq.{outfit_id}",
            "user_id": f"eq.{current_user['user_id']}",
            "select": "id",
        },
        prefer="return=representation",
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved outfit not found.",
        )

    return {"deleted": True, "id": outfit_id}
