from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: str
    purpose: str
    price: float
    currency: str = "INR"
    city: str
    locality: str
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    built_up_area: Optional[float] = None


class PropertyResponse(PropertyBase):
    id: str
    seller_id: str
    status: str
    created_at: datetime
    updated_at: datetime
