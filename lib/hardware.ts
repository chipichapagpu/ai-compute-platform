// Hardware database
export interface Hardware {
  hardware: string;
  manufacturer: string;
  type: string;
  primaryWorkload: string;
  secondaryWorkload: string;
  releaseDate: string;
  petaflops16: number;
  petaflops8: number;
  memory: number;
  bandwidth: number;
  power: number;
  foundry: string;
}

export const HARDWARE_DATA: Hardware[] = [
  {
    hardware: "Google TPU v7",
    manufacturer: "Google",
    type: "TPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2025-11-06",
    petaflops16: 2.5,
    petaflops8: 4.61,
    memory: 192,
    bandwidth: 7.37,
    power: 960,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI355X",
    manufacturer: "AMD",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2025-06-12",
    petaflops16: 2.25,
    petaflops8: 4.6,
    memory: 288,
    bandwidth: 8,
    power: 1400,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI350X",
    manufacturer: "AMD",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2025-06-12",
    petaflops16: 2.25,
    petaflops8: 4.6,
    memory: 288,
    bandwidth: 8,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B300",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2025-08-22",
    petaflops16: 2.31,
    petaflops8: 4.5,
    memory: 288,
    bandwidth: 8,
    power: 1400,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B200",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2024-11-15",
    petaflops16: 2.25,
    petaflops8: 4.5,
    memory: 192,
    bandwidth: 8,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B100",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2024-11-15",
    petaflops16: 1.31,
    petaflops8: 3.5,
    memory: 192,
    bandwidth: 8,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "Amazon Trainium3",
    manufacturer: "Amazon AWS",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2025-12-02",
    petaflops16: 1.26,
    petaflops8: 2.52,
    memory: 155,
    bandwidth: 4.9,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H200",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "Training",
    releaseDate: "2024-11-18",
    petaflops16: 0.99,
    petaflops8: 1.98,
    memory: 141,
    bandwidth: 4.8,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "Amazon Trainium2",
    manufacturer: "Amazon AWS",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2024-12-03",
    petaflops16: 0.65,
    petaflops8: 1.3,
    memory: 96,
    bandwidth: 2.9,
    power: 500,
    foundry: "TSMC"
  },
  {
    hardware: "Google TPU v6e",
    manufacturer: "Google",
    type: "TPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2024-05-14",
    petaflops16: 0.92,
    petaflops8: 1.84,
    memory: 32,
    bandwidth: 1.6,
    power: 0,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI325X",
    manufacturer: "AMD",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "Training",
    releaseDate: "2024-10-10",
    petaflops16: 1.3,
    petaflops8: 2.61,
    memory: 256,
    bandwidth: 6,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "Google TPU v5e",
    manufacturer: "Google",
    type: "TPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "—",
    releaseDate: "2023-08-29",
    petaflops16: 0.2,
    petaflops8: 0.39,
    memory: 16,
    bandwidth: 0.8,
    power: 0,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI300X",
    manufacturer: "AMD",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2023-12-06",
    petaflops16: 1.3,
    petaflops8: 2.61,
    memory: 192,
    bandwidth: 5.3,
    power: 750,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H100 SXM5",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2022-09-20",
    petaflops16: 0.99,
    petaflops8: 1.98,
    memory: 80,
    bandwidth: 3.35,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H100 PCIe",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "Training",
    releaseDate: "2022-10-05",
    petaflops16: 0.76,
    petaflops8: 1.51,
    memory: 80,
    bandwidth: 2,
    power: 400,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA A100",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Training",
    secondaryWorkload: "Inference",
    releaseDate: "2020-05-14",
    petaflops16: 0.31,
    petaflops8: 0,
    memory: 80,
    bandwidth: 2,
    power: 400,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA L40",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "—",
    releaseDate: "2022-10-13",
    petaflops16: 0.18,
    petaflops8: 0.36,
    memory: 48,
    bandwidth: 0.86,
    power: 300,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA L40S",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "—",
    releaseDate: "2023-08-08",
    petaflops16: 0.37,
    petaflops8: 0.73,
    memory: 48,
    bandwidth: 0.86,
    power: 350,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA L4",
    manufacturer: "NVIDIA",
    type: "GPU",
    primaryWorkload: "Inference",
    secondaryWorkload: "—",
    releaseDate: "2023-03-21",
    petaflops16: 0.12,
    petaflops8: 0.24,
    memory: 24,
    bandwidth: 0.3,
    power: 72,
    foundry: "TSMC"
  }
];

export const MANUFACTURERS = Array.from(new Set(HARDWARE_DATA.map(h => h.manufacturer))).sort();

export type SortField = keyof Hardware;

export function sortHardware(data: Hardware[], field: SortField, asc: boolean = false): Hardware[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    const dir = asc ? 1 : -1;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * dir;
    }
    return ((aVal as number) - (bVal as number)) * dir;
  });
}

export function filterByManufacturers(data: Hardware[], manufacturers: string[]): Hardware[] {
  if (manufacturers.length === 0) return data;
  return data.filter(h => manufacturers.includes(h.manufacturer));
}

export function getTopValues(data: Hardware[], field: keyof Hardware, count: number = 3): Set<any> {
  const sorted = [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    return (bVal as number) - (aVal as number);
  });
  return new Set(sorted.slice(0, count).map(h => h[field]));
}
