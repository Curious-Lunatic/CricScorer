export type RunValue = 0 | 1 | 2 | 3 | 4 | 5 | 6; 
export type HowWicket =
| 'bowled'
| 'caught'
| 'lbw'
| 'runout'
| 'stumped'
| 'hit-wicket'
| 'obstructing-the-field'
| 'hit-ball-twice'
| 'timed-out'
| 'one-hand-caught' // gully
| 'hit-too-long'    // gully
export type BallEvent = 
| { type: 'runs'; value: RunValue}
| { type: 'wicket';  how: HowWicket; batsmanOut: string; fielder?: string; runs?: RunValue }
| { type: 'wide'; runs: number}
| { type: 'noball'; runs: number}
| { type: 'legbye'; runs: number}
| { type: 'bye'; runs: number}
| { type: 'penalty'; runs: 5; team: 'batting' | 'fielding' } 
| { type: 'retired'; batsman: string; voluntary: boolean };

export type PlayerRole = 'batsmen' | 'bowler' | 'all-rounder' | 'wicketkeeper'
export type BattingStyle = 'right-hand' | 'left-hand';
export type BowlingStyle =
| 'right-arm-fast' | 'right-arm-medium' | 'right-arm-offbreak'| 'right-arm-legbreak' 
| 'left-arm-fast' | 'left-arm-medium' | 'left-arm-orthodox' | 'left-arm-wristpin' | 'none';

export interface Player {
  id: string;
  name: string;
  imageUri?: string; // TODO: to able to add local file path or remote URL
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  jerseyNumber?: number;
  isPreset: boolean; // TODO: inorder to have some of the current teams in as preset
}
 
export interface Team {
  id: string;
  name: string;
  shortName: string; 
  logoUri?: string;
  primaryColor: string;   
  secondaryColor: string;
  players: Player[];
  isPreset: boolean;
}

export type Format = 'T20' | 'ODI' | 'Test' | 'Street' | 'Customized';
export type BallType = 'leather' | 'tennis' | 'hot-tennis' | 'tape-ball' | 'other';
export type PitchType = 'grass' | 'concrete' | 'matting' | 'astroturf' | 'dirt';

export interface FormatConfig {
    format: Format;
    maxOvers: number;
    maxWickets: number;
    maxInnings: number;
    ppOvers?: number;
    superoverEnabled: boolean;
    drsEnabled: boolean;
    noLBW: boolean; // gully customized
    followonRuns?: number; // test customized
    declerationAllowed?: boolean; // test customized
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  imageUri?: string;
  capacity?: number;
  isPreset: boolean;
}

export interface BatsmanInnings {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  wicketHow?: HowWicket;
  wicketBowler?: string;
  wicketFielder?: string;
  isOnStrike: boolean;
  didNotBat: boolean;
}
 
export interface BowlerInnings {
  playerId: string;
  overs: number; // completed overs
  balls: number; // balls in current over 
  runs: number;
  wickets: number;
  maidens: number;
  wides: number;
  noballs: number;
}
 
export interface FallOfWicket {
  wicketNumber: number;
  runs: number;
  balls: number;
  batsmanId: string;
  over: string;          
}
 
export interface InningsState {
  inningsNumber: number;
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  balls: number; // legal deliveries only
  totalDeliveries: number; // including wides/noballs
  extras: { wides: number; noballs: number; byes: number; legbyes: number; penalties: number };
  batsmen: Record<string, BatsmanInnings>;
  bowlers: Record<string, BowlerInnings>;
  fallOfWickets: FallOfWicket[];
  onStrikeId: string;
  nonStrikeId: string;
  currentBowlerId: string;
  target?: number;
  isCompleted: boolean;
  completionReason?: 'all-out' | 'overs' | 'target-chased' | 'declared' | 'retired' | 'abandoned';
  events: BallEvent[]; // full ball-by-ball log
  overLog: BallEvent[][]; // grouped by over for display
}
 
export interface MatchMeta {
  id: string;
  title?: string; // optional custom name
  format: Format;
  formatConfig: FormatConfig;
  teamA: Team;
  teamB: Team;
  venue?: Venue;
  ballType: BallType;
  pitchType?: PitchType;
  matchDate: string;     
  matchTime?: string;      
  isLegacy: boolean;  // so true will be it is done, if false it is live
  legacyNotes?: string; // match notes u can add
  weatherConditions?: string;
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  result?: MatchResult;
  createdBy: string;       
  createdAt: string;       
  updatedAt: string;
}
 
export interface MatchResult {
  winnerId?: string;      
  resultType: 'win-runs' | 'win-wickets' | 'tie' | 'draw' | 'no-result' | 'super-over';
  margin?: number;         
  playerOfMatch?: string;  
}
 
export interface MatchState {
  meta: MatchMeta;
  currentInnings: number;  // note: (TO-DO) 0-indexed
  innings: InningsState[];
  status: 'setup' | 'toss' | 'live' | 'innings-break' | 'completed' | 'abandoned';
}