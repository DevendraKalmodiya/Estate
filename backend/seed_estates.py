import json
import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parent / ".env")


def seed_estates_data(filepath="Estates.json"):
    """Read Estates JSON and upload its properties to Supabase."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in backend/.env.")

    filepath = Path(filepath)
    if not filepath.is_absolute():
        filepath = Path(__file__).resolve().parent / filepath

    with filepath.open("r", encoding="utf-8") as file:
        estates_data = json.load(file)

    if not isinstance(estates_data, list):
        raise ValueError("Estates.json must contain a JSON array of properties.")

    formatted_data = [
        {
            "title": item.get("title", "Untitled Property"),
            "property_type": item.get("property_type", "apartment"),
            "purpose": item.get("purpose", "sale"),
            "price": item.get("price", 0),
            "city": item.get("city", "Unknown"),
            "locality": item.get("locality", "Unknown"),
            "status": "published",
            # Add seller_id here when seeding for a specific seller.
        }
        for item in estates_data
    ]

    supabase: Client = create_client(url, key)
    response = supabase.table("properties").insert(formatted_data).execute()
    print(f"Successfully inserted {len(response.data)} properties from {filepath.name}.")


if __name__ == "__main__":
    seed_estates_data()
