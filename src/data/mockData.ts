export interface Zone {
  id: string;
  row: number;
  col: number;
  health: number;
  ndvi: number;
  ndre: number;
  moisture: number;
  pestRisk: number;
  stress: string;
  status: 'healthy' | 'moderate' | 'warning' | 'critical';
}

export interface Field {
  id: string;
  name: string;
  crop: string;
  area: number;
  health: number;
  soilMoisture: number;
  pestRisk: number;
  status: 'healthy' | 'moderate' | 'critical';
  growthStage: string;
  lastScan: string;
  imageSource: string;
  zones: Zone[];
  stressLevel?: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  field: string;
  zone: string | null;
  value: string | null;
  description: string;
  timestamp: string;
  action: string;
  resolved: boolean;
}

export const farm = {
  id: 'green-valley',
  name: 'Green Valley Farm',
  location: 'Punjab, India',
  totalArea: 47.6,
  overallHealth: 82,
  fieldsCount: 4,
  activeAlerts: 3,
  highRiskZones: 2,
};

export const healthHistory = [
  { date: 'Jul 01', health: 86, ndvi: 0.69 },
  { date: 'Jul 15', health: 82, ndvi: 0.65 },
  { date: 'Aug 01', health: 76, ndvi: 0.59 },
  { date: 'Aug 15', health: 69, ndvi: 0.51 },
  { date: 'Aug 21', health: 63, ndvi: 0.43 },
];

const fieldDZones: Zone[] = [
  { id: 'A1', row: 0, col: 0, health: 88, ndvi: 0.71, ndre: 0.52, moisture: 45, pestRisk: 18, stress: 'Low', status: 'healthy' },
  { id: 'A2', row: 0, col: 1, health: 91, ndvi: 0.74, ndre: 0.56, moisture: 48, pestRisk: 12, stress: 'Low', status: 'healthy' },
  { id: 'A3', row: 0, col: 2, health: 85, ndvi: 0.68, ndre: 0.49, moisture: 41, pestRisk: 22, stress: 'Low', status: 'healthy' },
  { id: 'A4', row: 0, col: 3, health: 79, ndvi: 0.61, ndre: 0.43, moisture: 38, pestRisk: 31, stress: 'Moderate', status: 'moderate' },
  { id: 'B1', row: 1, col: 0, health: 82, ndvi: 0.65, ndre: 0.46, moisture: 39, pestRisk: 27, stress: 'Low', status: 'healthy' },
  { id: 'B2', row: 1, col: 1, health: 71, ndvi: 0.54, ndre: 0.38, moisture: 33, pestRisk: 46, stress: 'Moderate', status: 'moderate' },
  { id: 'B3', row: 1, col: 2, health: 76, ndvi: 0.58, ndre: 0.41, moisture: 36, pestRisk: 38, stress: 'Moderate', status: 'moderate' },
  { id: 'B4', row: 1, col: 3, health: 68, ndvi: 0.49, ndre: 0.32, moisture: 29, pestRisk: 54, stress: 'Moderate', status: 'moderate' },
  { id: 'C1', row: 2, col: 0, health: 73, ndvi: 0.55, ndre: 0.39, moisture: 34, pestRisk: 42, stress: 'Moderate', status: 'moderate' },
  { id: 'C2', row: 2, col: 1, health: 65, ndvi: 0.46, ndre: 0.29, moisture: 27, pestRisk: 61, stress: 'Moderate', status: 'moderate' },
  { id: 'C3', row: 2, col: 2, health: 58, ndvi: 0.41, ndre: 0.24, moisture: 26, pestRisk: 69, stress: 'High', status: 'warning' },
  { id: 'C4', row: 2, col: 3, health: 42, ndvi: 0.32, ndre: 0.19, moisture: 24, pestRisk: 81, stress: 'High', status: 'critical' },
  { id: 'D1', row: 3, col: 0, health: 76, ndvi: 0.59, ndre: 0.42, moisture: 37, pestRisk: 35, stress: 'Moderate', status: 'moderate' },
  { id: 'D2', row: 3, col: 1, health: 69, ndvi: 0.51, ndre: 0.35, moisture: 31, pestRisk: 52, stress: 'Moderate', status: 'moderate' },
  { id: 'D3', row: 3, col: 2, health: 61, ndvi: 0.43, ndre: 0.27, moisture: 28, pestRisk: 65, stress: 'High', status: 'warning' },
  { id: 'D4', row: 3, col: 3, health: 55, ndvi: 0.38, ndre: 0.22, moisture: 25, pestRisk: 72, stress: 'High', status: 'warning' },
];

const fieldCZones: Zone[] = [
  { id: 'A1', row: 0, col: 0, health: 82, ndvi: 0.65, ndre: 0.46, moisture: 48, pestRisk: 22, stress: 'Low', status: 'healthy' },
  { id: 'A2', row: 0, col: 1, health: 78, ndvi: 0.61, ndre: 0.43, moisture: 44, pestRisk: 29, stress: 'Low', status: 'healthy' },
  { id: 'A3', row: 0, col: 2, health: 74, ndvi: 0.57, ndre: 0.40, moisture: 41, pestRisk: 35, stress: 'Moderate', status: 'moderate' },
  { id: 'A4', row: 0, col: 3, health: 71, ndvi: 0.53, ndre: 0.36, moisture: 38, pestRisk: 41, stress: 'Moderate', status: 'moderate' },
  { id: 'B1', row: 1, col: 0, health: 79, ndvi: 0.62, ndre: 0.44, moisture: 46, pestRisk: 27, stress: 'Low', status: 'healthy' },
  { id: 'B2', row: 1, col: 1, health: 72, ndvi: 0.55, ndre: 0.38, moisture: 40, pestRisk: 44, stress: 'Moderate', status: 'moderate' },
  { id: 'B3', row: 1, col: 2, health: 68, ndvi: 0.50, ndre: 0.33, moisture: 36, pestRisk: 52, stress: 'Moderate', status: 'moderate' },
  { id: 'B4', row: 1, col: 3, health: 65, ndvi: 0.47, ndre: 0.30, moisture: 33, pestRisk: 58, stress: 'High', status: 'warning' },
  { id: 'C1', row: 2, col: 0, health: 77, ndvi: 0.60, ndre: 0.42, moisture: 43, pestRisk: 31, stress: 'Moderate', status: 'moderate' },
  { id: 'C2', row: 2, col: 1, health: 70, ndvi: 0.53, ndre: 0.36, moisture: 38, pestRisk: 46, stress: 'Moderate', status: 'moderate' },
  { id: 'C3', row: 2, col: 2, health: 66, ndvi: 0.48, ndre: 0.31, moisture: 34, pestRisk: 55, stress: 'Moderate', status: 'moderate' },
  { id: 'C4', row: 2, col: 3, health: 62, ndvi: 0.44, ndre: 0.27, moisture: 30, pestRisk: 62, stress: 'High', status: 'warning' },
  { id: 'D1', row: 3, col: 0, health: 80, ndvi: 0.63, ndre: 0.45, moisture: 45, pestRisk: 26, stress: 'Low', status: 'healthy' },
  { id: 'D2', row: 3, col: 1, health: 75, ndvi: 0.58, ndre: 0.41, moisture: 42, pestRisk: 34, stress: 'Moderate', status: 'moderate' },
  { id: 'D3', row: 3, col: 2, health: 71, ndvi: 0.54, ndre: 0.37, moisture: 39, pestRisk: 42, stress: 'Moderate', status: 'moderate' },
  { id: 'D4', row: 3, col: 3, health: 68, ndvi: 0.50, ndre: 0.33, moisture: 36, pestRisk: 48, stress: 'Moderate', status: 'moderate' },
];

export const fields: Field[] = [
  {
    id: 'field-a',
    name: 'Field A',
    crop: 'Wheat',
    area: 14.2,
    health: 91,
    soilMoisture: 58,
    pestRisk: 12,
    status: 'healthy',
    growthStage: 'Flowering',
    lastScan: '21 Aug 2026',
    imageSource: 'Drone Survey',
    stressLevel: 'Low',
    zones: fieldDZones.map(z => ({ ...z, health: Math.min(100, z.health + 10), pestRisk: Math.max(5, z.pestRisk - 15) })),
  },
  {
    id: 'field-b',
    name: 'Field B',
    crop: 'Rice',
    area: 10.8,
    health: 84,
    soilMoisture: 72,
    pestRisk: 24,
    status: 'healthy',
    growthStage: 'Tillering',
    lastScan: '21 Aug 2026',
    imageSource: 'Drone Survey',
    stressLevel: 'Low',
    zones: fieldDZones.map(z => ({ ...z, health: Math.min(100, z.health + 5), moisture: Math.min(80, z.moisture + 20), pestRisk: Math.max(8, z.pestRisk - 10) })),
  },
  {
    id: 'field-c',
    name: 'Field C',
    crop: 'Maize',
    area: 10.2,
    health: 76,
    soilMoisture: 44,
    pestRisk: 38,
    status: 'moderate',
    growthStage: 'Vegetative',
    lastScan: '20 Aug 2026',
    imageSource: 'Satellite',
    stressLevel: 'Moderate',
    zones: fieldCZones,
  },
  {
    id: 'field-d',
    name: 'Field D',
    crop: 'Wheat',
    area: 12.4,
    health: 63,
    soilMoisture: 31,
    pestRisk: 78,
    status: 'critical',
    growthStage: 'Vegetative',
    lastScan: '21 Aug 2026',
    imageSource: 'Drone Survey',
    stressLevel: 'Moderate',
    zones: fieldDZones,
  },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'High Pest Risk Detected',
    field: 'Field D',
    zone: 'Zone C4',
    value: '81%',
    description: 'Potential pest hotspot detected. Vegetation anomaly and spectral inconsistency observed. Localized stress pattern matches known pest-affected signatures.',
    timestamp: '21 Aug 2026, 09:14',
    action: 'Inspect Zone',
    resolved: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Low Soil Moisture',
    field: 'Field D',
    zone: 'Zone C4',
    value: '24%',
    description: 'Soil moisture is below the preferred threshold. Possible water stress conditions developing in the southern section.',
    timestamp: '21 Aug 2026, 08:47',
    action: 'Check Irrigation',
    resolved: false,
  },
  {
    id: 'alert-3',
    type: 'warning',
    title: 'Crop Stress Increasing',
    field: 'Field B',
    zone: 'Zone B2',
    value: '46%',
    description: 'Moderate crop stress detected. NDVI trending downward over the past 2 weeks. No critical threshold reached yet.',
    timestamp: '20 Aug 2026, 16:22',
    action: 'Monitor Field',
    resolved: false,
  },
  {
    id: 'alert-4',
    type: 'info',
    title: 'Drone Survey Complete',
    field: 'Field A',
    zone: null,
    value: null,
    description: 'Multispectral drone survey completed successfully. All 14.2 ha scanned. Data processed and ready for analysis.',
    timestamp: '21 Aug 2026, 07:30',
    action: 'View Report',
    resolved: true,
  },
  {
    id: 'alert-5',
    type: 'warning',
    title: 'NDRE Decline',
    field: 'Field D',
    zone: 'Zone D3',
    value: '0.27',
    description: 'Chlorophyll index declining. May indicate early nutrient deficiency or advancing stress condition.',
    timestamp: '19 Aug 2026, 14:11',
    action: 'Run Soil Test',
    resolved: false,
  },
];

export const soilZones = [
  { label: 'Moist', percentage: 22, color: '#4488FF' },
  { label: 'Optimal', percentage: 35, color: '#39D98A' },
  { label: 'Dry', percentage: 31, color: '#F5B942' },
  { label: 'Critical', percentage: 12, color: '#FF5C6C' },
];

export const pestHotspots = [
  { zone: 'C4', risk: 81, confidence: 78, signals: ['Vegetation anomaly', 'Spectral inconsistency', 'Localized stress pattern'] },
  { zone: 'D3', risk: 65, confidence: 71, signals: ['NDRE decline', 'Mild spectral anomaly'] },
  { zone: 'B4', risk: 54, confidence: 63, signals: ['Moderate stress indicator', 'Moisture imbalance'] },
];

export const cropHealthDistribution = [
  { label: 'Healthy', value: 68, color: '#39D98A' },
  { label: 'Moderate', value: 21, color: '#F5B942' },
  { label: 'Critical', value: 11, color: '#FF5C6C' },
];

export const stressZones = [
  { zone: 'B2', field: 'Field D', level: 'Moderate', ndvi: 0.54 },
  { zone: 'C4', field: 'Field D', level: 'High', ndvi: 0.32 },
  { zone: 'D3', field: 'Field D', level: 'High', ndvi: 0.43 },
];
