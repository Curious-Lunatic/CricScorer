import type {
  BallEvent, BatsmanInnings, BowlerInnings,
  FallOfWicket, FormatConfig, InningsState
} from './Types';

export function formatOvers(balls: number): string { return `${Math.floor(balls / 6)}.${balls % 6}`; }
export function currentRunRate(runs: number, balls: number): number { return balls === 0 ? 0 : parseFloat(((runs / balls) * 6).toFixed(2)); }
export function requiredRunRate(target: number, runs: number, ballsLeft: number): number {
  const needed = target - runs;
  return (ballsLeft <= 0 || needed <= 0) ? 0 : parseFloat(((needed / ballsLeft) * 6).toFixed(2));
}
export function projectedScore(runs: number, balls: number, maxBalls: number): number { return balls === 0 ? 0 : Math.round((runs / balls) * maxBalls); }

function isLegalDelivery(event: BallEvent): boolean {
  return event.type !== 'wide' && event.type !== 'noball' && event.type !== 'penalty' && event.type !== 'retired';
}

function shouldSwapStrike(event: BallEvent, balls: number, isEndOfOver: boolean): boolean {
  if (isEndOfOver) return true; 
  if (event.type === 'runs') return event.value % 2 === 1;
  if (event.type === 'wicket') return (event.runs ?? 0) % 2 === 1;
  if (event.type === 'legbye' || event.type === 'bye') return event.runs % 2 === 1;
  return false;
}

export function createInnings(inningsNumber: number, battingTeamId: string, bowlingTeamId: string, target?: number): InningsState {
  return {
    inningsNumber, battingTeamId, bowlingTeamId, runs: 0, wickets: 0, balls: 0, totalDeliveries: 0,
    extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0, penalties: 0 },
    batsmen: {}, bowlers: {}, fallOfWickets: [], onStrikeId: '', nonStrikeId: '', currentBowlerId: '',
    target, isCompleted: false, events: [], overLog: [[]],
  };
}

function ensureBatsman(innings: InningsState, id: string): BatsmanInnings {
  if (!innings.batsmen[id]) {
    innings.batsmen[id] = { playerId: id, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isOnStrike: false, didNotBat: true };
  }
  return innings.batsmen[id];
}
 
function ensureBowler(innings: InningsState, id: string): BowlerInnings {
  if (!innings.bowlers[id]) {
    innings.bowlers[id] = { playerId: id, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0, wides: 0, noballs: 0 };
  }
  return innings.bowlers[id];
}

export function applyBall(innings: InningsState, event: BallEvent, config: FormatConfig): InningsState{
  const next: InningsState = JSON.parse(JSON.stringify(innings));
  const bowler = ensureBowler(next, next.currentBowlerId);
  const striker = ensureBatsman(next, next.onStrikeId);
  ensureBatsman(next, next.nonStrikeId); // Just initialize if missing
  striker.didNotBat = false;
  next.events.push(event);
  next.totalDeliveries += 1;

  switch (event.type) {
    case 'runs': {
      const r = event.value; next.runs += r; next.balls += 1; striker.runs += r; striker.balls += 1;
      if (r === 4) striker.fours += 1; if (r === 6) striker.sixes += 1;
      bowler.runs += r; bowler.balls += 1; addToOverLog(next, event);
      break;
    }
    case 'wicket': {
      const runScored = event.runs ?? 0; next.runs += runScored; next.balls += 1; next.wickets += 1;
      striker.runs += runScored; striker.balls += 1;
      if (runScored === 4) striker.fours += 1; if (runScored === 6) striker.sixes += 1;
      striker.isOut = true; striker.wicketHow = event.how; striker.wicketBowler = next.currentBowlerId; striker.wicketFielder = event.fielder;
      const bowlerGetsCredit = event.how !== 'runout' && event.how !== 'obstructing-the-field';
      if (bowlerGetsCredit) bowler.wickets += 1;
      bowler.runs += runScored; bowler.balls += 1;
      next.fallOfWickets.push({ wicketNumber: next.wickets, runs: next.runs, balls: next.balls, batsmanId: next.onStrikeId, over: formatOvers(next.balls) });
      addToOverLog(next, event);
      break;
    }
    case 'wide': {
      const r = 1 + event.runs; next.runs += r; next.extras.wides += r; bowler.runs += r; bowler.wides += 1; addToOverLog(next, event); break;
    }
    case 'noball': {
      const r = 1 + event.runs; next.runs += r; next.extras.noballs += 1; striker.runs += event.runs;
      if (event.runs === 4) striker.fours += 1; if (event.runs === 6) striker.sixes += 1;
      bowler.runs += r; bowler.noballs += 1; addToOverLog(next, event); break;
    }
    case 'legbye': {
      next.runs += event.runs; next.extras.legbyes += event.runs; next.balls += 1; striker.balls += 1; bowler.balls += 1; addToOverLog(next, event); break;
    }
    case 'bye': {
      next.runs += event.runs; next.extras.byes += event.runs; next.balls += 1; striker.balls += 1; bowler.balls += 1; addToOverLog(next, event); break;
    }
    case 'penalty': {
      if (event.team === 'batting') next.runs += event.runs; next.extras.penalties += event.runs; addToOverLog(next, event); break;
    }
    case 'retired': {
      const bat = ensureBatsman(next, event.batsman);
      if (event.voluntary) { bat.isOut = true; bat.wicketHow = undefined; next.wickets += 1; }
      addToOverLog(next, event); break;
    }
  }

  const legal = isLegalDelivery(event);
  const isEndOfOver = legal && next.balls % 6 === 0 && next.balls > 0;
  
  if (isEndOfOver) {
    bowler.overs += 1;
    bowler.balls = 0;
    if (isMaiden(next.overLog[next.overLog.length - 1])) bowler.maidens += 1;
    next.overLog.push([]);
  } else if (legal) {
    bowler.balls += 0;
  }

  const swap = shouldSwapStrike(event, next.balls, isEndOfOver);
  if (swap && !striker.isOut) {
    [next.onStrikeId, next.nonStrikeId] = [next.nonStrikeId, next.onStrikeId];
  }

  Object.values(next.batsmen).forEach(b => { b.isOnStrike = false; });
  if (next.batsmen[next.onStrikeId]) next.batsmen[next.onStrikeId].isOnStrike = true;
  
  checkCompletion(next, config);
  return next;
}

function addToOverLog(innings: InningsState, event: BallEvent) {
  if (!innings.overLog.length) innings.overLog.push([]);
  innings.overLog[innings.overLog.length - 1].push(event);
}

export function isMaiden(overEvents: BallEvent[]): boolean {
  const bowlerRuns = overEvents.reduce((sum, e) => {
    if (e.type === 'runs')   return sum + e.value;
    if (e.type === 'wide')   return sum + 1 + e.runs;
    if (e.type === 'noball') return sum + 1 + e.runs;
    return sum;
  }, 0);
  return bowlerRuns === 0;
}

function checkCompletion(innings: InningsState, config: FormatConfig): void {
  if (innings.wickets >= config.maxWickets) {
    innings.isCompleted = true; innings.completionReason = 'all-out'; return;
  }
  if (config.maxOvers > 0 && innings.balls >= config.maxOvers * 6) {
    innings.isCompleted = true; innings.completionReason = 'overs'; return;
  }
  if (innings.target !== undefined && innings.runs >= innings.target) {
    innings.isCompleted = true; innings.completionReason = 'target-chased';
  }
}

export function undoLast(initial: InningsState, config: FormatConfig): InningsState {
  const events = [...initial.events];
  if (events.length === 0) return initial; 
  events.pop();

  let state = createInnings(initial.inningsNumber, initial.battingTeamId, initial.bowlingTeamId, initial.target);
  state.onStrikeId = initial.onStrikeId;
  state.nonStrikeId = initial.nonStrikeId;
  state.currentBowlerId = initial.currentBowlerId;

  for (const [id, b] of Object.entries(initial.batsmen)) {
    state.batsmen[id] = {
      ...b, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, didNotBat: true, isOnStrike: false,
      wicketHow: undefined, wicketBowler: undefined, wicketFielder: undefined,
    };
  }
  for (const [id, b] of Object.entries(initial.bowlers)) {
    state.bowlers[id] = { ...b, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0, wides: 0, noballs: 0 };
  }

  for (const event of events) {
    state = applyBall(state, event, config);
  }
  return state;
}

export function strikeRate(runs: number, balls: number): number { return balls === 0 ? 0 : parseFloat(((runs / balls) * 100).toFixed(1)); }
export function economy(runs: number, overs: number, balls: number): number {
  const totalOvers = overs + balls / 6; return totalOvers === 0 ? 0 : parseFloat((runs / totalOvers).toFixed(2));
}
export function partnership(innings: InningsState): { runs: number; balls: number } {
  const fowCount = innings.fallOfWickets.length;
  const sinceLastWicket = fowCount > 0 ? innings.balls - innings.fallOfWickets[fowCount - 1].balls : innings.balls;
  const runsSinceLastWicket = fowCount > 0 ? innings.runs - innings.fallOfWickets[fowCount - 1].runs : innings.runs;
  return { runs: runsSinceLastWicket, balls: sinceLastWicket };
}