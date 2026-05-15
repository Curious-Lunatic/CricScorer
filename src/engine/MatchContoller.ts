import { applyBall, createInnings } from './BallEngine';
import type { MatchState, BallEvent, InningsState } from './Types';

export class MatchController {
  
  static processDelivery(state: MatchState, event: BallEvent): MatchState {
    const nextState = JSON.parse(JSON.stringify(state)); // Deep clone 
    let currentInnings = nextState.innings[nextState.currentInnings];
    currentInnings = applyBall(currentInnings, event, nextState.meta.formatConfig);
    nextState.innings[nextState.currentInnings] = currentInnings;
    if (currentInnings.isCompleted) {
      this.handleInningsTransition(nextState);
    }
    return nextState;
  }

  private static handleInningsTransition(state: MatchState) {
    const config = state.meta.formatConfig;
    const completedInnings = state.innings[state.currentInnings];

    if (state.currentInnings + 1 >= config.maxInnings) {
      state.status = 'completed';
      this.calculateMatchResult(state);
      return;
    }

    state.status = 'innings-break';
    const nextBattingTeam = completedInnings.battingTeamId === state.meta.teamA.id 
      ? state.meta.teamB.id 
      : state.meta.teamA.id;
    
    const nextBowlingTeam = completedInnings.battingTeamId; 

    let target = undefined;
    if (config.format === 'T20' || config.format === 'ODI' || config.format === 'Street' || config.format === "Customized") {
        target = completedInnings.runs + 1;
    }

    const newInnings = createInnings(
      state.currentInnings + 2, 
      nextBattingTeam,
      nextBowlingTeam,
      target
    );

    state.innings.push(newInnings);
    state.currentInnings += 1;
  }
  private static calculateMatchResult(state: MatchState) {
  }
}