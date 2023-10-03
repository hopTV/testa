export interface Team {
  name: string
  nameApi: string
  win: number
  draw: number
  lose: number
  score: number
  flag: string
}

export interface League {
  name: string
  teams: Team[]
}

export interface TabLeagueViewProps {
  leagues: League[]
}

export interface Game {
  groupName: string
  team1: any
  team2: any
  date: string
  time: string
  timedf: string
  dateOfWeek: string
  prediction: any
}
