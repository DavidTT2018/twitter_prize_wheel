from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from typing import List, Optional
import os
from datetime import datetime, timedelta
import tweepy
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Twitter API credentials
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
TWITTER_API_KEY = os.getenv('TWITTER_API_KEY')
TWITTER_API_SECRET = os.getenv('TWITTER_API_SECRET')
TWITTER_ACCESS_TOKEN = os.getenv('TWITTER_ACCESS_TOKEN')
TWITTER_ACCESS_TOKEN_SECRET = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

# Initialize Twitter client
twitter_client = tweepy.Client(
    bearer_token=TWITTER_BEARER_TOKEN,
    consumer_key=TWITTER_API_KEY,
    consumer_secret=TWITTER_API_SECRET,
    access_token=TWITTER_ACCESS_TOKEN,
    access_token_secret=TWITTER_ACCESS_TOKEN_SECRET
)

app = FastAPI(title="Twitter Prize Wheel API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class TwitterFollowRequest(BaseModel):
    username: str

class TwitterFollowResponse(BaseModel):
    success: bool
    message: Optional[str] = None

class WheelSpinResponse(BaseModel):
    prize: str

class PrizeAwardRequest(BaseModel):
    user_id: str
    prize: str

class PrizeAwardResponse(BaseModel):
    success: bool
    message: Optional[str] = None

class TwitterFollowerResponse(BaseModel):
    followers: List[str]

# --- Sample Data ---

PRIZES = [
    "10% OFF", 
    "25% OFF", 
    "50% OFF", 
    "FREE TRIAL", 
    "MERCH", 
    "$10 GIFT CARD", 
    "$25 GIFT CARD", 
    "GRAND PRIZE"
]

# In a real app, these would be in a database
followed_users = set()
awarded_prizes = {}

# --- Routes ---

@app.get("/")
async def read_root():
    return {"message": "Twitter Prize Wheel API is running"}

@app.post("/api/verify-twitter-follow", response_model=TwitterFollowResponse)
async def verify_twitter_follow(request: TwitterFollowRequest):
    """
    Verify if a user has followed the specified Twitter account.
    """

@app.post("/api/spin-wheel", response_model=WheelSpinResponse)
async def spin_wheel():
    """
    Spin the wheel and get a random prize.
    """
    # Select a random prize
    prize = random.choice(PRIZES)
    
    return WheelSpinResponse(prize=prize)

@app.post("/api/award-prize", response_model=PrizeAwardResponse)
async def award_prize(request: PrizeAwardRequest):
    """
    Record a prize award for a user.
    """
    # In a real app, this would save to a database
    awarded_prizes[request.user_id] = {
        "prize": request.prize,
        "awarded_at": datetime.now().isoformat()
    }
    
    return PrizeAwardResponse(
        success=True,
        message=f"Prize '{request.prize}' has been awarded successfully"
    )

# --- For testing/demo purposes ---

@app.get("/api/stats")
async def get_stats():
    """
    Get statistics about the app (for admin purposes).
    """
    return {
        "followed_users": len(followed_users),
        "prizes_awarded": len(awarded_prizes),
        "current_time": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)