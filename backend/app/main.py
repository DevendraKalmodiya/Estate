from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import properties

app = FastAPI(title="Real Estate Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    properties.router,
    prefix="/api/v1/properties",
    tags=["Properties"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Real Estate API is running"}