import type { InningsState, BallEvent, FormatConfig, MatchMeta } from './Types';

export class MatchValidator {
  static canBowlerBowl(
    innings: InningsState,
    bowlerId: string,
    config: FormatConfig,
    gullyMaxOvers?: number
  ): { valid: boolean; reason?: string } {
    const bowler = innings.bowlers[bowlerId];
    if (!bowler) return { valid: true }; 
    let maxOvers = 0;
    if (config.format === 'T20') maxOvers = 4;
    if (config.format === 'ODI') maxOvers = 10;
    if (config.format === 'Street' && gullyMaxOvers) maxOvers = gullyMaxOvers;

    if (maxOvers > 0 && bowler.overs >= maxOvers) {
      return { valid: false, reason: 'Bowler has reached maximum allowed overs.' };
    }
    if (innings.previousBowlerId === bowlerId) {
      return { valid: false, reason: 'Bowler cannot bowl two consecutive overs.' };
    }   
    return { valid: true };
  }

  static validateEvent(innings: InningsState, event: BallEvent): { valid: boolean; reason?: string } {
    if (innings.isCompleted) {
      return { valid: false, reason: 'Innings is already completed.' };
    }
    if (event.type === 'runs' && (event.value < 0 || event.value > 6)) {
      return { valid: false, reason: 'Invalid run amount.' };
    }
    return { valid: true };
  }
}