import type { FormatConfig } from './Types';
 
export const T20_CONFIG: FormatConfig = {
  format: 'T20',
  maxOvers: 20,
  maxWickets: 10,
  maxInnings: 2,
  ppOvers: 6,
  superoverEnabled: true,
  drsEnabled: true,
  noLBW: false,
};
 
export const ODI_CONFIG: FormatConfig = {
  format: 'ODI',
  maxOvers: 50,
  maxWickets: 10,
  maxInnings: 2,
  ppOvers: 10,
  superoverEnabled: true,
  drsEnabled: true,
  noLBW: false,
};
 
export const TEST_CONFIG: FormatConfig = {
  format: 'Test',
  maxOvers: 0, // 0 = unlimited
  maxWickets: 10,
  maxInnings: 4,  // 2 innings per side
  superoverEnabled: false,
  drsEnabled: true,
  noLBW: false,
  followonRuns: 200,
  declarationAllowed: true,
};

export function buildCustomConfig(opts: {
  overs: number;          
  wickets?: number;      
  innings?: number;  
  noLBW?: boolean;
  superover?: boolean;
  decleration?: boolean;
}): FormatConfig {
  return {
    format: 'Customized',
    maxOvers: opts.overs,
    maxWickets: opts.wickets ?? 10,
    maxInnings: opts.innings ?? 2,
    superoverEnabled: opts.superover ?? false,
    drsEnabled: false,
    noLBW: opts.noLBW ?? false,
    declarationAllowed: opts.decleration ?? (opts.overs === 0),
  };
}

export function buildStreetConfig(overs: number): FormatConfig {
  return { ...STREET_CONFIG, maxOvers: overs };
}

export const STREET_CONFIG: FormatConfig = {
  format: 'Street',
  maxOvers: 0, 
  maxWickets: 10, 
  maxInnings: 2,
  superoverEnabled: false,
  drsEnabled: false,
  noLBW: true, 
};