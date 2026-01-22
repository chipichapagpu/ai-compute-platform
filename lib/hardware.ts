// Hardware database
export interface Hardware {
  hardware: string;
  manufacturer: string;
  type: string;
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
    hardware: "Amazon Trainium3",
    manufacturer: "Amazon AWS",
    type: "GPU",
    releaseDate: "2025-12-02",
    petaflops16: 2520,
    petaflops8: 2520,
    memory: 155,
    bandwidth: 4.9,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "Google TPU v7 Ironwood",
    manufacturer: "Google",
    type: "TPU",
    releaseDate: "2025-11-06",
    petaflops16: 2500,
    petaflops8: 4610,
    memory: 192,
    bandwidth: 7.37,
    power: 960,
    foundry: "TSMC"
  },
  {
    hardware: "Huawei Ascend 920",
    manufacturer: "Huawei",
    type: "NPU",
    releaseDate: "2025-10-01",
    petaflops16: 2500,
    petaflops8: 0,
    memory: 144,
    bandwidth: 4,
    power: 0,
    foundry: "SMIC"
  },
  {
    hardware: "NVIDIA GB300 (Blackwell Ultra)",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2025-08-22",
    petaflops16: 2310,
    petaflops8: 5000,
    memory: 288,
    bandwidth: 8,
    power: 1400,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B300 (Blackwell Ultra)",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2025-08-22",
    petaflops16: 2310,
    petaflops8: 4500,
    memory: 270,
    bandwidth: 7.7,
    power: 1100,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI355X",
    manufacturer: "AMD",
    type: "GPU",
    releaseDate: "2025-06-12",
    petaflops16: 2250,
    petaflops8: 4600,
    memory: 288,
    bandwidth: 8,
    power: 1400,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI350X",
    manufacturer: "AMD",
    type: "GPU",
    releaseDate: "2025-06-12",
    petaflops16: 2250,
    petaflops8: 4600,
    memory: 288,
    bandwidth: 8,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA GB200",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2025-02-15",
    petaflops16: 1750,
    petaflops8: 5000,
    memory: 186,
    bandwidth: 8,
    power: 1200,
    foundry: "TSMC"
  },
  {
    hardware: "Amazon Trainium2",
    manufacturer: "Amazon AWS",
    type: "GPU",
    releaseDate: "2024-12-03",
    petaflops16: 1680,
    petaflops8: 1300,
    memory: 96,
    bandwidth: 2.9,
    power: 500,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H200 SXM",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2024-11-18",
    petaflops16: 1310,
    petaflops8: 1980,
    memory: 141,
    bandwidth: 4.8,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B100",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2024-11-15",
    petaflops16: 1310,
    petaflops8: 3500,
    memory: 192,
    bandwidth: 8,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA B200",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2024-11-15",
    petaflops16: 1020,
    petaflops8: 4500,
    memory: 180,
    bandwidth: 7.7,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "Huawei Ascend 910C",
    manufacturer: "Huawei",
    type: "GPU",
    releaseDate: "2024-10-15",
    petaflops16: 990,
    petaflops8: 0,
    memory: 128,
    bandwidth: 3.2,
    power: 700,
    foundry: "SMIC"
  },
  {
    hardware: "AMD Instinct MI325X",
    manufacturer: "AMD",
    type: "GPU",
    releaseDate: "2024-10-10",
    petaflops16: 990,
    petaflops8: 0,
    memory: 256,
    bandwidth: 6,
    power: 1000,
    foundry: "TSMC"
  },
  {
    hardware: "Intel Habana Gaudi3",
    manufacturer: "Intel",
    type: "Other",
    releaseDate: "2024-09-24",
    petaflops16: 990,
    petaflops8: 1680,
    memory: 128,
    bandwidth: 3.7,
    power: 900,
    foundry: "TSMC"
  },
  {
    hardware: "Maia 100 (M100)",
    manufacturer: "Microsoft",
    type: "GPU",
    releaseDate: "2024-08-27",
    petaflops16: 989,
    petaflops8: 0,
    memory: 0,
    bandwidth: 0,
    power: 500,
    foundry: "TSMC"
  },
  {
    hardware: "Google TPU v6e Trillium",
    manufacturer: "Google",
    type: "TPU",
    releaseDate: "2024-05-14",
    petaflops16: 989,
    petaflops8: 918,
    memory: 32,
    bandwidth: 1.64,
    power: 380,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H100 NVL",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2024-03-14",
    petaflops16: 918,
    petaflops8: 0,
    memory: 94,
    bandwidth: 3.9,
    power: 400,
    foundry: "TSMC"
  },
  {
    hardware: "MTT S4000",
    manufacturer: "Moore Threads",
    type: "GPU",
    releaseDate: "2023-12-19",
    petaflops16: 900,
    petaflops8: 0,
    memory: 48,
    bandwidth: 0.7,
    power: 450,
    foundry: "SMIC"
  },
  {
    hardware: "Google TPU v5p",
    manufacturer: "Google",
    type: "TPU",
    releaseDate: "2023-12-06",
    petaflops16: 800,
    petaflops8: 0,
    memory: 95,
    bandwidth: 2.7,
    power: 540,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Instinct MI300X",
    manufacturer: "AMD",
    type: "GPU",
    releaseDate: "2023-12-06",
    petaflops16: 800,
    petaflops8: 0,
    memory: 192,
    bandwidth: 5.3,
    power: 750,
    foundry: "TSMC"
  },
  {
    hardware: "AMD Radeon Instinct MI308X",
    manufacturer: "AMD",
    type: "GPU",
    releaseDate: "2023-12-06",
    petaflops16: 756,
    petaflops8: 0,
    memory: 192,
    bandwidth: 5.3,
    power: 750,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA HGX H20",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2023-11-09",
    petaflops16: 667,
    petaflops8: 0,
    memory: 96,
    bandwidth: 4,
    power: 400,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA GH200",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2023-08-08",
    petaflops16: 362,
    petaflops8: 0,
    memory: 0,
    bandwidth: 4.9,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA H800 SXM5",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2023-03-21",
    petaflops16: 312,
    petaflops8: 0,
    memory: 80,
    bandwidth: 3.36,
    power: 700,
    foundry: "TSMC"
  },
  {
    hardware: "NVIDIA GH100",
    manufacturer: "NVIDIA",
    type: "GPU",
    releaseDate: "2023-03-21",
    petaflops16: 312,
    petaflops8: 0,
    memory: 0,
    bandwidth: 3.07,
    power: 700,
    foundry: "TSMC"
  }
];

export const MANUFACTURERS = Array.from(new Set(HARDWARE_DATA.map(h => h.manufacturer))).sort();

export type SortField = 'petaflops8' | 'petaflops16' | 'memory' | 'releaseDate';

export function sortHardware(data: Hardware[], field: SortField): Hardware[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return bVal.localeCompare(aVal); // Descending for dates
    }
    return (bVal as number) - (aVal as number); // Descending for numbers
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
