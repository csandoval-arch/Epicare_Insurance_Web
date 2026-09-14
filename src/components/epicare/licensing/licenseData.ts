/**
 * @description All 50 US states + DC + Puerto Rico license data for Epicare.
 * lat/lng are geographic centers used as globe marker coordinates.
 */

export interface StateLicense {
  name: string;
  abbr: string;
  code: string;
  lat: number;
  lng: number;
}

export const STATE_LICENSES: StateLicense[] = [
  { name: 'Alabama',        abbr: 'AL', code: '3003535225',  lat: 32.806671,  lng: -86.791130  },
  { name: 'Alaska',         abbr: 'AK', code: '3003982188',  lat: 61.370716,  lng: -152.404419 },
  { name: 'Arizona',        abbr: 'AZ', code: '3003535260',  lat: 33.729759,  lng: -111.431221 },
  { name: 'Arkansas',       abbr: 'AR', code: '3003443843',  lat: 34.969704,  lng: -92.373123  },
  { name: 'California',     abbr: 'CA', code: '6015054',     lat: 36.116203,  lng: -119.681564 },
  { name: 'Colorado',       abbr: 'CO', code: '885996',      lat: 39.059811,  lng: -105.311104 },
  { name: 'Connecticut',    abbr: 'CT', code: '3003465737',  lat: 41.597782,  lng: -72.755371  },
  { name: 'Delaware',       abbr: 'DE', code: '3003557135',  lat: 39.318523,  lng: -75.507141  },
  { name: 'DC',             abbr: 'DC', code: '3003610803',  lat: 38.897438,  lng: -77.026817  },
  { name: 'Florida',        abbr: 'FL', code: 'L113976',     lat: 27.766279,  lng: -81.686783  },
  { name: 'Georgia',        abbr: 'GA', code: '237842',      lat: 33.040619,  lng: -83.643074  },
  { name: 'Hawaii',         abbr: 'HI', code: '3003976077',  lat: 21.094318,  lng: -157.498337 },
  { name: 'Idaho',          abbr: 'ID', code: '3003538263',  lat: 44.240459,  lng: -114.478828 },
  { name: 'Illinois',       abbr: 'IL', code: '3003322374',  lat: 40.349457,  lng: -88.986137  },
  { name: 'Indiana',        abbr: 'IN', code: '4058571',     lat: 39.849426,  lng: -86.258278  },
  { name: 'Iowa',           abbr: 'IA', code: '3003554793',  lat: 42.011539,  lng: -93.210526  },
  { name: 'Kansas',         abbr: 'KS', code: '19985316',    lat: 38.526600,  lng: -96.726486  },
  { name: 'Kentucky',       abbr: 'KY', code: '1396150',     lat: 37.668140,  lng: -84.670067  },
  { name: 'Louisiana',      abbr: 'LA', code: '1194072',     lat: 31.169960,  lng: -91.867805  },
  { name: 'Maine',          abbr: 'ME', code: 'AGN513449',   lat: 44.693947,  lng: -69.381927  },
  { name: 'Maryland',       abbr: 'MD', code: '3003482216',  lat: 39.063946,  lng: -76.802101  },
  { name: 'Michigan',       abbr: 'MI', code: '151250',      lat: 43.326618,  lng: -84.536095  },
  { name: 'Minnesota',      abbr: 'MN', code: '40966748',    lat: 45.694454,  lng: -93.900192  },
  { name: 'Mississippi',    abbr: 'MS', code: '15050531',    lat: 32.741646,  lng: -89.678696  },
  { name: 'Missouri',       abbr: 'MO', code: '3003426412',  lat: 38.456085,  lng: -92.288368  },
  { name: 'Montana',        abbr: 'MT', code: '3003631333',  lat: 46.921925,  lng: -110.454353 },
  { name: 'Nebraska',       abbr: 'NE', code: '3003606421',  lat: 41.125370,  lng: -98.268082  },
  { name: 'Nevada',         abbr: 'NV', code: '4079187',     lat: 38.313515,  lng: -117.055374 },
  { name: 'New Hampshire',  abbr: 'NH', code: '3003610757',  lat: 43.452492,  lng: -71.563896  },
  { name: 'New Jersey',     abbr: 'NJ', code: '3003440732',  lat: 40.298904,  lng: -74.521011  },
  { name: 'New Mexico',     abbr: 'NM', code: '3003553964',  lat: 34.840515,  lng: -106.248482 },
  { name: 'New York',       abbr: 'NY', code: 'LA-1886859',  lat: 42.165726,  lng: -74.948051  },
  { name: 'North Carolina', abbr: 'NC', code: '3003322317',  lat: 35.630066,  lng: -79.806419  },
  { name: 'North Dakota',   abbr: 'ND', code: '3003606444',  lat: 47.528912,  lng: -99.784012  },
  { name: 'Ohio',           abbr: 'OH', code: '1615011',     lat: 40.388783,  lng: -82.764915  },
  { name: 'Oklahoma',       abbr: 'OK', code: '3003558492',  lat: 35.565342,  lng: -96.928917  },
  { name: 'Oregon',         abbr: 'OR', code: '3003487872',  lat: 44.572021,  lng: -122.070938 },
  { name: 'Pennsylvania',   abbr: 'PA', code: '1225877',     lat: 40.590752,  lng: -77.209755  },
  { name: 'Rhode Island',   abbr: 'RI', code: '3003537579',  lat: 41.680893,  lng: -71.511780  },
  { name: 'South Carolina', abbr: 'SC', code: '3003322515',  lat: 33.856892,  lng: -80.945007  },
  { name: 'South Dakota',   abbr: 'SD', code: '10033145',    lat: 44.299782,  lng: -99.438828  },
  { name: 'Tennessee',      abbr: 'TN', code: '3003322536',  lat: 35.747845,  lng: -86.692345  },
  { name: 'Texas',          abbr: 'TX', code: '2764890',     lat: 31.054487,  lng: -97.563461  },
  { name: 'Utah',           abbr: 'UT', code: '1049851',     lat: 40.150032,  lng: -111.862434 },
  { name: 'Vermont',        abbr: 'VT', code: '3003610788',  lat: 44.045876,  lng: -72.710686  },
  { name: 'Virginia',       abbr: 'VA', code: '161280',      lat: 37.769337,  lng: -78.169968  },
  { name: 'Washington',     abbr: 'WA', code: '1298532',     lat: 47.400902,  lng: -121.490494 },
  { name: 'West Virginia',  abbr: 'WV', code: '3003486410',  lat: 38.491226,  lng: -80.954453  },
  { name: 'Wisconsin',      abbr: 'WI', code: '3003442897',  lat: 44.268543,  lng: -89.616508  },
  { name: 'Wyoming',        abbr: 'WY', code: '628119',      lat: 42.755966,  lng: -107.302490 },
  { name: 'Puerto Rico',    abbr: 'PR', code: '3004132963',  lat: 18.220833,  lng: -66.590149  },
];

export const TOTAL_LICENSES = STATE_LICENSES.length;
