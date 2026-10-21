from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client, create_client

from app.api.deps import get_current_seller
from app.core.config import settings
from app.models.property import PropertyBase, PropertyResponse

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@router.get("/", response_model=List[PropertyResponse])
def get_properties(
    city: Optional[str] = None,
    purpose: Optional[str] = None,
    property_type: Optional[str] = None,
):
    query = supabase.table("properties").select("*").eq("status", "published")
    if city:
        query = query.ilike("city", f"%{city}%")
    if purpose:
        query = query.eq("purpose", purpose)
    if property_type:
        query = query.eq("property_type", property_type)

    response = query.execute()
    return response.data


@router.post("/", response_model=PropertyResponse)
def create_property(
    property_data: PropertyBase,
    current_user: dict = Depends(get_current_seller),
):
    """Create a draft property listing for an authenticated seller."""
    new_property = property_data.model_dump()
    new_property["seller_id"] = current_user["id"]
    new_property["status"] = "draft"

    response = supabase.table("properties").insert(new_property).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create property")

    return response.data[0]
