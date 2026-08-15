"""
FloodGuard AI — FastAPI Flood Risk Engine
==========================================

Prototype explainable weighted-risk model.
This is NOT a scientifically validated flood-prediction model.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from risk_model import calculate_risk

app = FastAPI(
    title="FloodGuard AI — Risk Engine",
    description="Prototype explainable flood-risk calculation API.",
    version="1.0.0",
)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}


class SimulationInput(BaseModel):
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")
    elevation: float = Field(..., ge=0, description="Elevation in meters")
    slope: float = Field(..., ge=0, description="Slope in degrees")
    drainage: float = Field(..., ge=0, le=100, description="Drainage capacity 0-100")


@app.middleware("http")
async def cors_handler(request, call_next):
    if request.method == "OPTIONS":
        from starlette.responses import Response
        return Response(status_code=200, headers=CORS_HEADERS)
    response = await call_next(request)
    response.headers.update(CORS_HEADERS)
    return response


@app.get("/health")
async def health():
    return {"status": "operational", "engine": "prototype-v1"}


@app.post("/calculate-risk")
async def calculate_risk_endpoint(data: SimulationInput):
    try:
        result = calculate_risk(
            rainfall=data.rainfall,
            elevation=data.elevation,
            slope=data.slope,
            drainage=data.drainage,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
