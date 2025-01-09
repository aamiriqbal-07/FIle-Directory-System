from fastapi import FastAPI
from app.routes import router
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "http://localhost:3000",  # Docker frontend
        "http://frontend:3000"    # Docker internal network
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
