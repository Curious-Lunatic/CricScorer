import type { Player, Team } from './Types';

let _id = 1;
function uid(prefix: string): string {
  return `${prefix}_${String(_id++).padStart(4, '0')}`;
}

function makePlayer(
  name: string,
  role: Player['role'],
  batting: Player['battingStyle'],
  bowling: Player['bowlingStyle'],
  jersey?: number
): Player {
  return {
    id: uid('p'),
    name,
    role,
    battingStyle: batting,
    bowlingStyle: bowling,
    jerseyNumber: jersey,
    isPreset: true,
  };
}

export const PRESET_INDIA: Team = {
  id: 'preset_team_india',
  name: 'India',
  shortName: 'IND',
  primaryColor: '#0033A0',
  secondaryColor: '#FF9933',
  isPreset: true,
  players: [
    makePlayer('Rohit Sharma',       'batsman',      'right-hand', 'none', 45),
    makePlayer('Shubman Gill',       'batsman',      'right-hand', 'none', 77),
    makePlayer('Virat Kohli',        'batsman',      'right-hand', 'right-arm-medium', 18),
    makePlayer('Suryakumar Yadav',   'batsman',      'right-hand', 'none', 63),
    makePlayer('KL Rahul',           'wicketkeeper', 'right-hand', 'none', 1),
    makePlayer('Hardik Pandya',      'all-rounder',  'right-hand', 'right-arm-fast', 33),
    makePlayer('Ravindra Jadeja',    'all-rounder',  'left-hand',  'left-arm-orthodox', 8),
    makePlayer('Axar Patel',         'all-rounder',  'left-hand',  'left-arm-orthodox', 20),
    makePlayer('Jasprit Bumrah',     'bowler',       'right-hand', 'right-arm-fast', 93),
    makePlayer('Mohammed Siraj',     'bowler',       'right-hand', 'right-arm-fast', 13),
    makePlayer('Kuldeep Yadav',      'bowler',       'right-hand', 'left-arm-wristpin', 23),
    makePlayer('Arshdeep Singh',     'bowler',       'left-hand',  'left-arm-fast', 2),
    makePlayer('Rishabh Pant',       'wicketkeeper', 'left-hand',  'none', 17),
    makePlayer('Yashasvi Jaiswal',   'batsman',      'left-hand',  'right-arm-legbreak', 34),
    makePlayer('Washington Sundar',  'all-rounder',  'right-hand', 'right-arm-offbreak', 19),
  ],
};

export const PRESET_AUSTRALIA: Team = {
  id: 'preset_team_australia',
  name: 'Australia',
  shortName: 'AUS',
  primaryColor: '#FFD700',
  secondaryColor: '#006400',
  isPreset: true,
  players: [
    makePlayer('David Warner',       'batsman',      'left-hand',  'right-arm-legbreak', 31),
    makePlayer('Travis Head',        'batsman',      'left-hand',  'right-arm-offbreak', 35),
    makePlayer('Steve Smith',        'batsman',      'right-hand', 'right-arm-legbreak', 49),
    makePlayer('Marnus Labuschagne', 'batsman',      'right-hand', 'right-arm-legbreak', 44),
    makePlayer('Glenn Maxwell',      'all-rounder',  'right-hand', 'right-arm-offbreak', 32),
    makePlayer('Matthew Wade',       'wicketkeeper', 'left-hand',  'none', 9),
    makePlayer('Pat Cummins',        'all-rounder',  'right-hand', 'right-arm-fast', 30),
    makePlayer('Mitchell Starc',     'bowler',       'left-hand',  'left-arm-fast', 56),
    makePlayer('Josh Hazlewood',     'bowler',       'right-hand', 'right-arm-fast', 38),
    makePlayer('Adam Zampa',         'bowler',       'right-hand', 'right-arm-legbreak', 45),
    makePlayer('Mitchell Marsh',     'all-rounder',  'right-hand', 'right-arm-fast', 8),
    makePlayer('Alex Carey',         'wicketkeeper', 'left-hand',  'none', 25),
    makePlayer('Cameron Green',      'all-rounder',  'right-hand', 'right-arm-fast', 12),
    makePlayer('Nathan Lyon',        'bowler',       'right-hand', 'right-arm-offbreak', 67),
    makePlayer('Sean Abbott',        'bowler',       'right-hand', 'right-arm-fast', 11),
  ],
};

export const PRESET_ENGLAND: Team = {
  id: 'preset_team_england',
  name: 'England',
  shortName: 'ENG',
  primaryColor: '#003087',
  secondaryColor: '#CF142B',
  isPreset: true,
  players: [
    makePlayer('Jos Buttler',        'wicketkeeper', 'right-hand', 'none', 63),
    makePlayer('Jonny Bairstow',     'wicketkeeper', 'right-hand', 'none', 51),
    makePlayer('Ben Stokes',         'all-rounder',  'left-hand',  'right-arm-fast', 55),
    makePlayer('Joe Root',           'batsman',      'right-hand', 'right-arm-offbreak', 66),
    makePlayer('Harry Brook',        'batsman',      'right-hand', 'right-arm-offbreak', 88),
    makePlayer('Dawid Malan',        'batsman',      'left-hand',  'right-arm-legbreak', 29),
    makePlayer('Moeen Ali',          'all-rounder',  'left-hand',  'right-arm-offbreak', 18),
    makePlayer('Adil Rashid',        'bowler',       'right-hand', 'right-arm-legbreak', 23),
    makePlayer('Jofra Archer',       'bowler',       'right-hand', 'right-arm-fast', 22),
    makePlayer('Mark Wood',          'bowler',       'right-hand', 'right-arm-fast', 33),
    makePlayer('Reece Topley',       'bowler',       'left-hand',  'left-arm-fast', 78),
    makePlayer('Phil Salt',          'batsman',      'right-hand', 'none', 28),
    makePlayer('Liam Livingstone',   'all-rounder',  'right-hand', 'right-arm-legbreak', 41),
    makePlayer('Sam Curran',         'all-rounder',  'left-hand',  'left-arm-fast', 58),
    makePlayer('Chris Woakes',       'all-rounder',  'right-hand', 'right-arm-fast', 19),
  ],
};

export const PRESET_PAKISTAN: Team = {
  id: 'preset_team_pakistan',
  name: 'Pakistan',
  shortName: 'PAK',
  primaryColor: '#01411C',
  secondaryColor: '#FFFFFF',
  isPreset: true,
  players: [
    makePlayer('Babar Azam',         'batsman',      'right-hand', 'none', 56),
    makePlayer('Mohammad Rizwan',    'wicketkeeper', 'right-hand', 'none', 16),
    makePlayer('Fakhar Zaman',       'batsman',      'left-hand',  'none', 44),
    makePlayer('Imam-ul-Haq',        'batsman',      'left-hand',  'none', 14),
    makePlayer('Shadab Khan',        'all-rounder',  'right-hand', 'right-arm-legbreak', 16),
    makePlayer('Imad Wasim',         'all-rounder',  'left-hand',  'left-arm-orthodox', 18),
    makePlayer('Mohammad Nawaz',     'all-rounder',  'left-hand',  'left-arm-orthodox', 21),
    makePlayer('Shaheen Afridi',     'bowler',       'left-hand',  'left-arm-fast', 10),
    makePlayer('Haris Rauf',         'bowler',       'right-hand', 'right-arm-fast', 29),
    makePlayer('Naseem Shah',        'bowler',       'right-hand', 'right-arm-fast', 27),
    makePlayer('Usman Khan',         'bowler',       'right-hand', 'right-arm-fast', 19),
    makePlayer('Saim Ayub',          'batsman',      'left-hand',  'right-arm-offbreak', 88),
    makePlayer('Iftikhar Ahmed',     'all-rounder',  'right-hand', 'right-arm-offbreak', 54),
    makePlayer('Mohammad Haris',     'wicketkeeper', 'right-hand', 'none', 33),
    makePlayer('Abbas Afridi',       'bowler',       'right-hand', 'right-arm-fast', 12),
  ],
};

export const PRESET_SOUTH_AFRICA: Team = {
  id: 'preset_team_sa',
  name: 'South Africa',
  shortName: 'SA',
  primaryColor: '#007749',
  secondaryColor: '#FFB81C',
  isPreset: true,
  players: [
    makePlayer('Temba Bavuma',       'batsman',      'right-hand', 'none', 17),
    makePlayer('Quinton de Kock',    'wicketkeeper', 'left-hand',  'none', 12),
    makePlayer('Aiden Markram',      'batsman',      'right-hand', 'right-arm-offbreak', 9),
    makePlayer('Rassie van der Dussen','batsman',    'right-hand', 'right-arm-offbreak', 50),
    makePlayer('Heinrich Klaasen',   'wicketkeeper', 'right-hand', 'none', 52),
    makePlayer('David Miller',       'batsman',      'left-hand',  'none', 10),
    makePlayer('Marco Jansen',       'all-rounder',  'left-hand',  'left-arm-fast', 21),
    makePlayer('Keshav Maharaj',     'bowler',       'left-hand',  'left-arm-orthodox', 16),
    makePlayer('Kagiso Rabada',      'bowler',       'right-hand', 'right-arm-fast', 25),
    makePlayer('Anrich Nortje',      'bowler',       'right-hand', 'right-arm-fast', 95),
    makePlayer('Tabraiz Shamsi',     'bowler',       'left-hand',  'left-arm-wristpin', 20),
    makePlayer('Gerald Coetzee',     'bowler',       'right-hand', 'right-arm-fast', 97),
    makePlayer('Ryan Rickelton',     'batsman',      'left-hand',  'none', 47),
    makePlayer('Tristan Stubbs',     'batsman',      'right-hand', 'none', 36),
    makePlayer('Wayne Parnell',      'all-rounder',  'left-hand',  'left-arm-fast', 88),
  ],
};


export const PRESET_CSK: Team = {
  id: 'preset_team_csk',
  name: 'Chennai Super Kings',
  shortName: 'CSK',
  primaryColor: '#F9CD05',
  secondaryColor: '#0082CA',
  isPreset: true,
  players: [
    makePlayer('Ruturaj Gaikwad',    'batsman',      'right-hand', 'none', 31),
    makePlayer('Devon Conway',       'wicketkeeper', 'left-hand',  'none', 88),
    makePlayer('MS Dhoni',           'wicketkeeper', 'right-hand', 'right-arm-medium', 7),
    makePlayer('Shivam Dube',        'all-rounder',  'left-hand',  'right-arm-medium', 32),
    makePlayer('Ravindra Jadeja',    'all-rounder',  'left-hand',  'left-arm-orthodox', 8),
    makePlayer('Moeen Ali',          'all-rounder',  'left-hand',  'right-arm-offbreak', 18),
    makePlayer('Deepak Chahar',      'bowler',       'right-hand', 'right-arm-medium', 90),
    makePlayer('Tushar Deshpande',   'bowler',       'right-hand', 'right-arm-fast', 45),
    makePlayer('Matheesha Pathirana','bowler',       'right-hand', 'right-arm-fast', 70),
    makePlayer('Shardul Thakur',     'all-rounder',  'right-hand', 'right-arm-fast', 54),
    makePlayer('Rachin Ravindra',    'all-rounder',  'left-hand',  'right-arm-offbreak', 14),
  ],
};

export const PRESET_MI: Team = {
  id: 'preset_team_mi',
  name: 'Mumbai Indians',
  shortName: 'MI',
  primaryColor: '#004BA0',
  secondaryColor: '#D1AB3E',
  isPreset: true,
  players: [
    makePlayer('Rohit Sharma',       'batsman',      'right-hand', 'none', 45),
    makePlayer('Ishan Kishan',       'wicketkeeper', 'left-hand',  'none', 32),
    makePlayer('Suryakumar Yadav',   'batsman',      'right-hand', 'none', 63),
    makePlayer('Tilak Varma',        'batsman',      'left-hand',  'right-arm-offbreak', 9),
    makePlayer('Hardik Pandya',      'all-rounder',  'right-hand', 'right-arm-fast', 33),
    makePlayer('Tim David',          'batsman',      'right-hand', 'right-arm-offbreak', 8),
    makePlayer('Jasprit Bumrah',     'bowler',       'right-hand', 'right-arm-fast', 93),
    makePlayer('Gerald Coetzee',     'bowler',       'right-hand', 'right-arm-fast', 97),
    makePlayer('Piyush Chawla',      'bowler',       'right-hand', 'right-arm-legbreak', 22),
    makePlayer('Naman Dhir',         'all-rounder',  'right-hand', 'right-arm-offbreak', 47),
    makePlayer('Romario Shepherd',   'all-rounder',  'right-hand', 'right-arm-fast', 15),
  ],
};

export const PRESET_RCB: Team = {
  id: 'preset_team_rcb',
  name: 'Royal Challengers Bengaluru',
  shortName: 'RCB',
  primaryColor: '#EC1C24',
  secondaryColor: '#000000',
  isPreset: true,
  players: [
    makePlayer('Virat Kohli',        'batsman',      'right-hand', 'right-arm-medium', 18),
    makePlayer('Faf du Plessis',     'batsman',      'right-hand', 'right-arm-medium', 13),
    makePlayer('Glenn Maxwell',      'all-rounder',  'right-hand', 'right-arm-offbreak', 32),
    makePlayer('Rajat Patidar',      'batsman',      'right-hand', 'right-arm-offbreak', 71),
    makePlayer('Dinesh Karthik',     'wicketkeeper', 'right-hand', 'none', 5),
    makePlayer('Cameron Green',      'all-rounder',  'right-hand', 'right-arm-fast', 12),
    makePlayer('Mahipal Lomror',     'all-rounder',  'left-hand',  'left-arm-orthodox', 61),
    makePlayer('Mohammed Siraj',     'bowler',       'right-hand', 'right-arm-fast', 73),
    makePlayer('Reece Topley',       'bowler',       'left-hand',  'left-arm-fast', 78),
    makePlayer('Wanindu Hasaranga',  'all-rounder',  'right-hand', 'right-arm-legbreak', 40),
    makePlayer('Yash Dayal',         'bowler',       'left-hand',  'left-arm-fast', 22),
  ],
};


export const GULLY_TEMPLATE_TAPE_BALL: Omit<Team, 'id' | 'players'> = {
  name: 'Tape-ball Warriors',
  shortName: 'TBW',
  primaryColor: '#2ECC71',
  secondaryColor: '#ECF0F1',
  isPreset: false,  
};

export const GULLY_TEMPLATE_STREET: Omit<Team, 'id' | 'players'> = {
  name: 'Street Kings',
  shortName: 'SKG',
  primaryColor: '#E74C3C',
  secondaryColor: '#F39C12',
  isPreset: false,
};


export const ALL_PRESET_TEAMS: Team[] = [
  PRESET_INDIA,
  PRESET_AUSTRALIA,
  PRESET_ENGLAND,
  PRESET_PAKISTAN,
  PRESET_SOUTH_AFRICA,
  PRESET_CSK,
  PRESET_MI,
  PRESET_RCB,
];

export const PRESET_TEAM_CATEGORIES = {
  international: ['preset_team_india','preset_team_australia','preset_team_england','preset_team_pakistan','preset_team_sa'],
  ipl: ['preset_team_csk','preset_team_mi','preset_team_rcb'],
};


import type { Venue } from './Types';

export const PRESET_VENUES: Venue[] = [
  { id:'v001', name:'Narendra Modi Stadium',        city:'Ahmedabad',    country:'India',     capacity:132000, isPreset:true },
  { id:'v002', name:'Eden Gardens',                 city:'Kolkata',      country:'India',     capacity:66000,  isPreset:true },
  { id:'v003', name:'Wankhede Stadium',             city:'Mumbai',       country:'India',     capacity:33000,  isPreset:true },
  { id:'v004', name:'M. Chinnaswamy Stadium',       city:'Bengaluru',    country:'India',     capacity:35000,  isPreset:true },
  { id:'v005', name:'MA Chidambaram Stadium',       city:'Chennai',      country:'India',     capacity:50000,  isPreset:true },
  { id:'v006', name:'Rajiv Gandhi Int. Stadium',    city:'Hyderabad',    country:'India',     capacity:55000,  isPreset:true },
  { id:'v007', name:'Lords Cricket Ground',         city:'London',       country:'England',   capacity:30000,  isPreset:true },
  { id:'v008', name:'MCG',                          city:'Melbourne',    country:'Australia', capacity:100024, isPreset:true },
  { id:'v009', name:'SCG',                          city:'Sydney',       country:'Australia', capacity:48000,  isPreset:true },
  { id:'v010', name:'Old Trafford',                 city:'Manchester',   country:'England',   capacity:26000,  isPreset:true },
  { id:'v011', name:'Gaddafi Stadium',              city:'Lahore',       country:'Pakistan',  capacity:27000,  isPreset:true },
  { id:'v012', name:'Newlands Cricket Ground',      city:'Cape Town',    country:'S. Africa', capacity:25000,  isPreset:true },
  { id:'v013', name:'Dubai International Stadium',  city:'Dubai',        country:'UAE',       capacity:25000,  isPreset:true },
  { id:'v100', name:'Local Ground',                 city:'',             country:'',          isPreset:true },
  { id:'v101', name:'School Ground',                city:'',             country:'',          isPreset:true },
  { id:'v102', name:'Society Compound',             city:'',             country:'',          isPreset:true },
  { id:'v103', name:'Terrace / Rooftop',            city:'',             country:'',          isPreset:true },
  { id:'v104', name:'Street / Road',                city:'',             country:'',          isPreset:true },
  { id:'v105', name:'Box Cricket Arena',            city:'',             country:'',          isPreset:true },
];