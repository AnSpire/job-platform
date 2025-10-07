from fastapi import FastAPI, APIRouter
from app.api.v1.hello_world import hello_world_router


app = FastAPI()
app.include_router(hello_world_router)