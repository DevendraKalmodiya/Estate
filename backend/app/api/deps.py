from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from app.core.config import settings

security = HTTPBearer()


def verify_supabase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )


def get_current_user(payload: dict = Depends(verify_supabase_token)):
    user_id = payload.get("sub")
    app_metadata = payload.get("app_metadata") or {}
    role = payload.get("user_role") or app_metadata.get("role", "buyer")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    return {"id": user_id, "role": role}


def get_current_seller(user: dict = Depends(get_current_user)):
    if user["role"] not in ["seller", "admin"]:
        raise HTTPException(status_code=403, detail="Seller privileges required")
    return user


def get_current_admin(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Administrator privileges required")
    return user
