import type { FormatConfig } from './Types';
import { STREET_CONFIG } from './FormatConfigs';

export interface GullyRules {
  oneHandCatch: boolean;
  hitTooLong: boolean;
  noLBW: boolean;
  maxBowlerOvers: number; 
}

export const DEFAULT_GULLY_RULES: GullyRules = {
  oneHandCatch: true,
  hitTooLong: true,
  noLBW: true,
  maxBowlerOvers: 0, 
};

export function applyGullyRules(config: FormatConfig, rules: GullyRules): FormatConfig {
  return { ...config, noLBW: rules.noLBW };
}

export function buildStreetConfig(overs: number = 10, rules: GullyRules = DEFAULT_GULLY_RULES): FormatConfig {
  return applyGullyRules({ ...STREET_CONFIG, maxOvers: overs }, rules);
}

export function validDismissals(config: FormatConfig, rules?: GullyRules): string[] {
  const base = [
    'bowled', 'caught', 'runout', 'stumped',
    'hit-wicket', 'obstructing-the-field', 'hit-ball-twice', 'timed-out',
  ];
  if (!config.noLBW) base.push('lbw');
  if (rules?.oneHandCatch) base.push('one-hand-caught');
  if (rules?.hitTooLong)   base.push('hit-too-long');
  return base;
}

export function isBowlerOverLimit(bowlerOversCompleted: number, rules: GullyRules): boolean {
  if (rules.maxBowlerOvers === 0) return false;
  return bowlerOversCompleted >= rules.maxBowlerOvers;
}