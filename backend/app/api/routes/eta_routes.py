"""
FastAPI Routes for RailPulse-X Dynamic ETA Forecasting (SIH26028)
"""

from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import logging

from app.services.eta_engine import get_eta_engine
from app.services.backtest_engine import get_backtest_engine

router = APIRouter(prefix="/api/eta", tags=["eta"])
logger = logging.getLogger(__name__)

class WhatIfRequest(BaseModel):
    train_no: str = Field(default="20841", description="Train number to disrupt or analyze")
    extra_delay_min: float = Field(default=20.0, ge=1.0, le=180.0, description="Additional delay to inject (minutes)")
    disruption_type: str = Field(default="Preceding Train Breakdown", description="Type of disruption")
    location_station: str = Field(default="CPP", description="Station location of disruption")

class TelemetryUpdateRequest(BaseModel):
    train_no: str
    current_station: Optional[str] = None
    next_station: Optional[str] = None
    current_km: Optional[float] = None
    current_speed_kmph: Optional[float] = None
    current_delay_min: Optional[float] = None
    telemetry_age_sec: Optional[int] = 0

@router.get("/overview")
async def get_overview() -> Dict[str, Any]:
    """Get corridor status, active trains, and model health."""
    try:
        engine = get_eta_engine()
        return engine.get_corridor_overview()
    except Exception as e:
        logger.error(f"Error fetching corridor overview: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/live-trains")
async def get_live_trains() -> List[Dict[str, Any]]:
    """Get all active coaching trains running on the corridor with live delay and preceding train headway."""
    try:
        engine = get_eta_engine()
        return engine.get_live_trains()
    except Exception as e:
        logger.error(f"Error fetching live trains: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict/{train_no}")
async def get_eta_prediction(
    train_no: str = Path(..., description="Train number (e.g. 20841, 12844, 18463)"),
    staleness_sec: Optional[int] = Query(None, description="Override telemetry staleness in seconds to test graceful degradation")
) -> Dict[str, Any]:
    """
    Get dynamic ETA forecast distribution (P10, P50, P90) for all remaining stations,
    along with side-by-side Official NTES baseline comparison, uncertainty bands, and delay driver attributions.
    """
    try:
        engine = get_eta_engine()
        return engine.predict_eta_distribution(train_no, staleness_override_sec=staleness_sec)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error predicting ETA for train {train_no}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/benchmark")
async def get_backtest_benchmark() -> Dict[str, Any]:
    """
    Get held-out backtest verification data proving RailPulse-X beats
    the Schedule-Plus-Delay baseline by ~66% MAE reduction across 450 runs.
    """
    try:
        engine = get_backtest_engine()
        return engine.get_benchmarks()
    except Exception as e:
        logger.error(f"Error fetching backtest benchmarks: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/what-if")
async def simulate_what_if_disruption(payload: WhatIfRequest) -> Dict[str, Any]:
    """
    Simulate a disruption (e.g. preceding train delayed, signal failure, bad weather)
    and compute dynamic cascading downstream arrival time updates.
    """
    try:
        engine = get_eta_engine()
        return engine.simulate_what_if(payload.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error executing what-if simulation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/telemetry-update")
async def update_train_telemetry(payload: TelemetryUpdateRequest) -> Dict[str, Any]:
    """
    Ingest live GPS/block telemetry update for an active train and dynamically refresh predictions.
    """
    try:
        engine = get_eta_engine()
        t = engine.active_trains.get(payload.train_no)
        if not t:
            raise HTTPException(status_code=404, detail=f"Train {payload.train_no} not found")

        if payload.current_station is not None:
            t["current_station"] = payload.current_station
        if payload.next_station is not None:
            t["next_station"] = payload.next_station
        if payload.current_km is not None:
            t["current_km"] = payload.current_km
        if payload.current_speed_kmph is not None:
            t["current_speed_kmph"] = payload.current_speed_kmph
        if payload.current_delay_min is not None:
            t["current_delay_min"] = payload.current_delay_min
        if payload.telemetry_age_sec is not None:
            t["telemetry_age_sec"] = payload.telemetry_age_sec

        return {
            "status": "success",
            "message": f"Telemetry updated for train {payload.train_no}",
            "train_no": payload.train_no,
            "current_delay_min": t["current_delay_min"],
            "current_km": t["current_km"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating telemetry: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
