# Scaling Decision Engine — the core business logic of this project.
# Reads the predicted demand and works out how many replicas are needed (G1).
# The AI only predicts; the decision is made here and nowhere else.
#
# Formula: predicted demand == 0 → 1 pod (no buffer). Otherwise →
#          ceil(predicted demand / capacity per pod) + buffer (n+1).
# If we predict one pod handles 500 and the real figure turns out to be 1000,
# two pods is tight — so one spare is always added on top. Except in the small
# hours, where there is no demand at all and no buffer is needed either.
import math

from common.core.logger import get_logger
from common.models.scaling import ScalingDecision, ScalingSignals

logger = get_logger("decision_engine")


class ScalingDecisionEngine:
    def __init__(self, demand_per_pod: float, buffer_pods: int, min_replicas: int, max_replicas: int):
        self._demand_per_pod = demand_per_pod
        self._buffer = buffer_pods
        self._min = min_replicas
        self._max = max_replicas

    def decide(self, signals: ScalingSignals) -> ScalingDecision:
        demand = signals.predicted_demand
        if demand <= 0:
            desired = 1
            matched = "demand=0 -> 1 (no buffer)"
        else:
            base = math.ceil(demand / self._demand_per_pod)
            desired = base + self._buffer
            matched = f"ceil({demand:g}/{self._demand_per_pod:g})+{self._buffer} -> {desired}"
        clamped = max(self._min, min(self._max, desired))
        return ScalingDecision(
            desired_replicas=clamped,
            matched_rule=matched,
            reason=f"predicted_demand={demand:g}, rule[{matched}]"
            + (f", clamped to [{self._min},{self._max}]" if clamped != desired else ""),
        )
