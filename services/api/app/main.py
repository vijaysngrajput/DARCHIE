from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.sql import router as sql_router


app = FastAPI(
    title="DARCHIE API",
    description="Backend service for DARCHIE practice modules.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sql_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
