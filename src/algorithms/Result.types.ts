export interface SimulationTimePoint {
  time: number
  susceptible: Record<string, number>
  exposed: Record<string, number>
  infectious: Record<string, number>
  hospitalized: Record<string, number>
  recovered: Record<string, number>
  discharged: Record<string, number>
  critical: Record<string, number>
  dead: Record<string, number>
}

export interface ModelParams {
  ageDistribution: Record<string, number>
  infectionSeverityRatio: Record<string, number>
  infectionFatality: Record<string, number>
  infectionCritical: Record<string, number>
  hospitalizedRate: Record<string, number>
  recoveryRate: Record<string, number>
  dischargeRate: Record<string, number>
  stabilizationRate: Record<string, number>
  criticalRate: Record<string, number>
  deathRate: Record<string, number>
  avgInfectionRate: number
  timeDeltaDays: number
  infectionRate: (t: Date) => number
  timeDelta: number
  populationServed: number
  numberStochasticRuns: number
}

export interface AlgorithmResult {
  deterministicTrajectory: SimulationTimePoint[]
  stochasticTrajectories: SimulationTimePoint[][]
  params: ModelParams
}

export interface UserResult {
  trajectory: SimulationTimePoint[]
}
