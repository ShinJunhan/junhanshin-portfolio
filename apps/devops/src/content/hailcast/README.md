# hailcast

<!-- TODO: placeholder content. Replace with the real write-up. This project
     has no README.ko.md yet, so the EN/KO toggle does not render for it —
     adding that file is all it takes to turn the toggle on. -->

Predictive autoscaling for an EKS workload: forecast the next window of
demand, provision for it ahead of time, and report the cost difference against
reactive scaling.

## Components

| Piece | Role |
|---|---|
| Forecaster | Produces the demand prediction for the next window |
| Scaler | Turns a prediction into desired capacity |
| Reporter | Compares actual spend against the reactive baseline |

## Notes

- Placeholder section. Add the forecast horizon, how misses are handled, and
  what the fallback to reactive scaling looks like.
