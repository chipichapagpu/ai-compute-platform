// Data Center Infrastructure
export interface DataCenter {
  rank: number;
  owner: string;
  location: string;
  state: string;
  hardware: string;
  chipCount: number;
  currentPower: number;
  maxPlannedPower: number;
  comments: string;
}

export const DATA_CENTERS: DataCenter[] = [
  {
    rank: 1,
    owner: "Google",
    location: "Columbus",
    state: "OH",
    hardware: "TPU (Multi-gen)",
    chipCount: 200000,
    currentPower: 500,
    maxPlannedPower: 1000,
    comments: "Uses multi-datacenter training."
  },
  {
    rank: 2,
    owner: "Google",
    location: "Omaha",
    state: "NE",
    hardware: "TPU (Latest)",
    chipCount: 200000,
    currentPower: 500,
    maxPlannedPower: 1000,
    comments: "Dispersed campus connected by fiber."
  },
  {
    rank: 3,
    owner: "Meta",
    location: "Columbus",
    state: "OH",
    hardware: "Mixed / GPU",
    chipCount: 0,
    currentPower: 500,
    maxPlannedPower: 0,
    comments: "Hybrid site using standard buildings."
  },
  {
    rank: 4,
    owner: "AWS",
    location: "New Carlisle",
    state: "IN",
    hardware: "Trainium 2",
    chipCount: 500000,
    currentPower: 420,
    maxPlannedPower: 2000,
    comments: "Project Rainier scale."
  },
  {
    rank: 5,
    owner: "Microsoft",
    location: "Atlanta",
    state: "GA",
    hardware: "Nvidia GB200",
    chipCount: 150000,
    currentPower: 350,
    maxPlannedPower: 700,
    comments: '"Fairwater" type campus.'
  },
  {
    rank: 6,
    owner: "xAI",
    location: "Memphis",
    state: "TN",
    hardware: "Nvidia GB200",
    chipCount: 110000,
    currentPower: 400,
    maxPlannedPower: 1000,
    comments: "Colossus 2; rapid construction."
  },
  {
    rank: 7,
    owner: "Microsoft",
    location: "Mt. Pleasant",
    state: "WI",
    hardware: "Nvidia GB200",
    chipCount: 150000,
    currentPower: 350,
    maxPlannedPower: 2000,
    comments: "Massive expansion plans."
  },
  {
    rank: 8,
    owner: "AWS",
    location: "Canton",
    state: "MS",
    hardware: "Trainium 2",
    chipCount: 200000,
    currentPower: 300,
    maxPlannedPower: 1000,
    comments: "Located next to fulfillment center."
  },
  {
    rank: 9,
    owner: "OpenAI",
    location: "Abilene",
    state: "TX",
    hardware: "Nvidia GB200",
    chipCount: 100000,
    currentPower: 200,
    maxPlannedPower: 0,
    comments: "Project Stargate ready by 2026."
  },
  {
    rank: 10,
    owner: "xAI",
    location: "Memphis",
    state: "TN",
    hardware: "Hopper / Blackwell",
    chipCount: 230000,
    currentPower: 300,
    maxPlannedPower: 300,
    comments: "Colossus 1 factory conversion."
  }
];

// Cluster Scalability
export interface ClusterScale {
  platform: string;
  chip: string;
  releaseDate: string;
  interconnect: string;
  singleDomainScale: number;
  bandwidth: number;
  hbmMemory: number;
}

export const CLUSTER_SCALE: ClusterScale[] = [
  {
    platform: "Google",
    chip: "TPU v7 (Ironwood)",
    releaseDate: "2026 (Est)",
    interconnect: "ICI",
    singleDomainScale: 9216,
    bandwidth: 1200,
    hbmMemory: 192
  },
  {
    platform: "NVIDIA",
    chip: "GB300 (Blackwell Ultra)",
    releaseDate: "2025 (Late)",
    interconnect: "NVLink 5",
    singleDomainScale: 72,
    bandwidth: 1800,
    hbmMemory: 288
  },
  {
    platform: "AWS",
    chip: "Trainium2",
    releaseDate: "2024 (Dec)",
    interconnect: "NeuronLink v2",
    singleDomainScale: 64,
    bandwidth: 1000,
    hbmMemory: 96
  },
  {
    platform: "Google",
    chip: "TPU v6e (Trillium)",
    releaseDate: "2024 (Late)",
    interconnect: "ICI",
    singleDomainScale: 256,
    bandwidth: 800,
    hbmMemory: 32
  },
  {
    platform: "NVIDIA",
    chip: "GB200 (Blackwell)",
    releaseDate: "2024 (Mar)",
    interconnect: "NVLink 5",
    singleDomainScale: 72,
    bandwidth: 1800,
    hbmMemory: 192
  },
  {
    platform: "Google",
    chip: "TPU v5p",
    releaseDate: "2024 (Feb)",
    interconnect: "ICI",
    singleDomainScale: 8960,
    bandwidth: 1200,
    hbmMemory: 95
  },
  {
    platform: "AMD",
    chip: "MI300X",
    releaseDate: "2023 (Dec)",
    interconnect: "Infinity Fabric",
    singleDomainScale: 8,
    bandwidth: 896,
    hbmMemory: 192
  },
  {
    platform: "NVIDIA",
    chip: "GH200 (Grace Hopper)",
    releaseDate: "2023 (May)",
    interconnect: "NVLink",
    singleDomainScale: 576,
    bandwidth: 900,
    hbmMemory: 144
  },
  {
    platform: "NVIDIA",
    chip: "H100 (SuperPOD)",
    releaseDate: "2022 (Sep)",
    interconnect: "NVLink 4",
    singleDomainScale: 256,
    bandwidth: 900,
    hbmMemory: 80
  },
  {
    platform: "Google",
    chip: "TPU v4",
    releaseDate: "2021 (May)",
    interconnect: "ICI",
    singleDomainScale: 4096,
    bandwidth: 275,
    hbmMemory: 32
  }
];

export const VENDOR_COLORS: Record<string, string> = {
  'Google': '#4285F4',
  'NVIDIA': '#76B900',
  'AWS': '#FF9900',
  'AMD': '#ED1C24'
};

// Cloud Comparison (will be loaded from Google Sheets in production)
export interface CloudComparison {
  metric: string;
  nvidia: string;
  google: string;
  notes: string;
}

// This is a placeholder - in production, this would be fetched from Google Sheets
export const CLOUD_COMPARISON_PLACEHOLDER: CloudComparison[] = [
  {
    metric: "Availability",
    nvidia: "GB200: Q1 2025",
    google: "TPU v6e: Available Now",
    notes: "Google has immediate availability advantage"
  },
  {
    metric: "Single Domain Scale",
    nvidia: "72 chips (GB200/GB300)",
    google: "256-9216 chips (TPU v6e/v7)",
    notes: "Google excels in massive scale-out"
  },
  {
    metric: "Memory per Chip",
    nvidia: "192-288 GB HBM",
    google: "32-192 GB HBM",
    notes: "NVIDIA leads in per-chip memory"
  },
  {
    metric: "FP8 Performance",
    nvidia: "4500-5000 TFLOPS",
    google: "918-4610 TFLOPS",
    notes: "Competitive at high end"
  },
  {
    metric: "Pricing (Estimate)",
    nvidia: "$4-6/chip/hour",
    google: "$2-4/chip/hour",
    notes: "Google typically more cost-efficient"
  }
];

export const GOOGLE_SHEETS_ID = "1mIR77MY66RspGRMRh8oHXGX9oUjFFqspjlAPCdC6qO4";
export const GOOGLE_SHEETS_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/export?format=csv`;
