import type { GullyRules } from './GullyRules';

export type RunValue = 0 | 1 | 2 | 3 | 4 | 5 | 6; 
export type HowWicket =
| 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped' | 'hit-wicket'
| 'obstructing-the-field' | 'hit-ball-twice' | 'timed-out'
| 'one-hand-caught' | 'hit-too-long';

export type BallEvent = 
| { type: 'runs'; value: RunValue}
| { type: 'wicket';  how: HowWicket; batsmanOut: string; fielder?: string; runs?: RunValue }
| { type: 'wide'; runs: number}
| { type: 'noball'; runs: number}
| { type: 'legbye'; runs: number}
| { type: 'bye'; runs: number}
| { type: 'penalty'; runs: 5; team: 'batting' | 'fielding' } 
| { type: 'retired'; batsman: string; voluntary: boolean };

export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper'
export type BattingStyle = 'right-hand' | 'left-hand';
export type BowlingStyle =
| 'right-arm-fast' | 'right-arm-medium' | 'right-arm-offbreak'| 'right-arm-legbreak' 
| 'left-arm-fast' | 'left-arm-medium' | 'left-arm-orthodox' | 'left-arm-wristpin' | 'none';

export interface Player {
  id: string;
  name: string;
  imageUri?: string; 
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  jerseyNumber?: number;
  isPreset: boolean; 
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
    noLBW: boolean; 
    followonRuns?: number; 
    declarationAllowed?: boolean; 
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
  overs: number; 
  balls: number; 
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
  balls: number; 
  totalDeliveries: number; 
  extras: { 
    wides: number; 
    noballs: number; 
    byes: number; 
    legbyes: number; 
    penalties: number 
  };
  batsmen: Record<string, BatsmanInnings>; 
  bowlers: Record<string, BowlerInnings>;
  fallOfWickets: FallOfWicket[]; 
  onStrikeId: string; 
  nonStrikeId: string; 
  currentBowlerId: string;
  previousBowlerId?: string;
  openers: { strikerId: string; nonStrikerId: string; bowlerId: string; };
  target?: number; 
  isCompleted: boolean;
  completionReason?: 'all-out' | 'overs' | 'target-chased' | 'declared' | 'retired' | 'abandoned';
  events: BallEvent[]; 
  overLog: BallEvent[][]; 
}

export interface MatchMeta {
  id: string; 
  title?: string; 
  format: Format; 
  formatConfig: FormatConfig;
  teamA: Team; 
  teamB: Team;
  venue?: Venue; 
  ballType: BallType; 
  pitchType?: PitchType;
  matchDate: string; 
  matchTime?: string; 
  isLegacy: boolean; // true = entered after the fact (history), false = scored live
  legacyNotes?: string; 
  weatherConditions?: string;
  gullyRules?: GullyRules; // only will be true if we need to make it into a gully
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
  currentInnings: number; 
  innings: InningsState[];
  status: 'setup' | 'toss' | 'live' | 'innings-break' | 'completed' | 'abandoned';
  battingOrder: string[][]; // battingOrder[i] = playerIds for innings i
}