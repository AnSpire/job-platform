from fastapi import APIRouter


hello_world_router = APIRouter()


@hello_world_router.get("/")
async def hello_world():
    return {"hello": "world"}