from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the database engine and Base for table creation
from app.database.session import engine
from app.models import user as user_models

# Import all the routers from your application
from app.routers import auth, admin, locker, webhooks
from app.websockets import vision_ws

# This command instructs SQLAlchemy to create all the database tables
# based on the models defined in user_models.py. It will only create
# tables that do not already exist.
user_models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application
app = FastAPI(
    title="LockSafe API",
    description="The backend API for the Smart Bank Locker System with Face Authentication.",
    version="1.0.0"
)

# --- Middleware Setup ---
# CORS (Cross-Origin Resource Sharing) allows your React frontend
# (running on a different origin, e.g., localhost:5173) to communicate with this backend.
origins = [
    "http://localhost:5173", # The default URL for a Vite React app
    "http://localhost:3000", # A common URL for a Create React App
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# --- Include API Routers ---
# This makes your API modular. Each file in 'routers' handles a specific feature.
# The prefix="/api" ensures all these endpoints start with /api/...
app.include_router(auth.router, prefix="/api", tags=["1. Authentication & Registration"])
app.include_router(admin.router, prefix="/api", tags=["2. Admin"])
app.include_router(locker.router, prefix="/api", tags=["3. Locker Management"])
app.include_router(webhooks.router, prefix="/api", tags=["4. External Webhooks"])

# WebSocket routers don't typically use the /api prefix
app.include_router(vision_ws.router, tags=["5. Real-time Vision (WebSockets)"])


# --- Root Endpoint ---
# A simple endpoint to confirm that the API is running.
@app.get("/", tags=["Root"])
def read_root():
    """
    Welcome endpoint for the LockSafe API.
    """

    return {
        "message": "Welcome to the LockSafe API",
        "project_status": "active",
        "documentation": "/docs" # Link to the auto-generated Swagger UI
    }