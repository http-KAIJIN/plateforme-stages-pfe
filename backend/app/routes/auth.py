from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.database.session import get_db
from app.schemas.user import Token, UserCreate, UserRead
from app.services.activity_log_service import log_activity
from app.services.auth_service import authenticate_user, create_user, get_user_by_email

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return create_user(db, payload)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    log_activity(db, "login", user.id, "User logged in")
    db.commit()
    return Token(access_token=create_access_token(str(user.id), extra_claims={"role": user.role, "email": user.email}))
