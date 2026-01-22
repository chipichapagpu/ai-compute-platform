// Model database
export const MODELS = {
  "Llama 3 8B": { P: 8e9, L: 32, n_kv: 8, d_h: 128 },
  "Llama 3 70B": { P: 70e9, L: 80, n_kv: 8, d_h: 128 },
  "Llama 3.1 405B": { P: 405e9, L: 126, n_kv: 8, d_h: 128 },
  "Llama 3.2 1B": { P: 1e9, L: 16, n_kv: 8, d_h: 64 },
  "Mistral 7B": { P: 7e9, L: 32, n_kv: 8, d_h: 128 },
  "Mixtral 8x7B": { P: 47e9, L: 32, n_kv: 8, d_h: 128 },
  "DeepSeek V3 671B": { P: 671e9, L: 61, n_kv: 1, d_h: 512 },
} as const;

export type ModelName = keyof typeof MODELS;

export interface GPUProvider {
  name: string;
  link: string;
}

export interface GPU {
  name: string;
  vram: number;
  basePrice: number;
  providers: GPUProvider[];
}

// GPU database
export const GPUS: GPU[] = [
  {
    name: "NVIDIA H100 SXM",
    vram: 80,
    basePrice: 3.10,
    providers: [
      { name: "Lambda", link: "https://lambdalabs.com/service/gpu-cloud" },
      { name: "CoreWeave", link: "https://www.coreweave.com/pricing" }
    ]
  },
  {
    name: "NVIDIA H200",
    vram: 141,
    basePrice: 4.50,
    providers: [
      { name: "Lambda", link: "https://lambdalabs.com/service/gpu-cloud" },
      { name: "CoreWeave", link: "https://www.coreweave.com/pricing" }
    ]
  },
  {
    name: "NVIDIA A100 80GB",
    vram: 80,
    basePrice: 1.85,
    providers: [
      { name: "AWS", link: "https://aws.amazon.com/ec2/instance-types/p4/" },
      { name: "Lambda", link: "https://lambdalabs.com/service/gpu-cloud" }
    ]
  },
  {
    name: "AMD MI300X",
    vram: 192,
    basePrice: 3.80,
    providers: [
      { name: "Lambda", link: "https://lambdalabs.com/service/gpu-cloud" },
      { name: "CoreWeave", link: "https://www.coreweave.com/pricing" }
    ]
  },
];

export interface VRAMCalculation {
  weights: number;
  kvCache: number;
  overheadW: number;
  overheadKV: number;
  total: number;
}

export function calculateVRAM(
  modelName: ModelName,
  weightBits: number,
  kvBits: number,
  contextLength: number,
  batchSize: number
): VRAMCalculation {
  const model = MODELS[modelName];
  const P = model.P;
  const L = model.L;
  const n_kv = model.n_kv;
  const d_h = model.d_h;

  const alpha_w = 0.10;
  const alpha_kv = 0.02;

  const weights = (P * (weightBits / 8)) / 1e9;
  const kvCache = (2 * L * n_kv * d_h * contextLength * batchSize * (kvBits / 8)) / 1e9;
  const overheadW = weights * alpha_w;
  const overheadKV = kvCache * alpha_kv;
  const total = weights + kvCache + overheadW + overheadKV;

  return {
    weights,
    kvCache,
    overheadW,
    overheadKV,
    total,
  };
}

export interface GPURecommendation {
  gpu: GPU;
  gpuCount: number;
  totalVRAM: number;
  utilization: number;
  fitStatus: 'excellent' | 'good' | 'tight' | 'oom-risk' | 'insufficient';
  estimatedPrice: number;
}

export function getGPURecommendations(requiredVRAM: number): GPURecommendation[] {
  return GPUS.map(gpu => {
    const usableVRAM = gpu.vram * 0.90;
    const gpuCount = Math.max(1, Math.ceil(requiredVRAM / usableVRAM));
    const totalVRAM = gpu.vram * gpuCount;
    const utilization = (requiredVRAM / totalVRAM) * 100;
    const headroom = ((totalVRAM - requiredVRAM) / totalVRAM) * 100;

    let fitStatus: GPURecommendation['fitStatus'];
    if (requiredVRAM > gpu.vram * 0.90) {
      if (gpuCount === 1) {
        fitStatus = 'insufficient';
      } else if (headroom > 20) {
        fitStatus = 'good';
      } else if (headroom >= 10) {
        fitStatus = 'tight';
      } else {
        fitStatus = 'oom-risk';
      }
    } else {
      if (headroom > 20) {
        fitStatus = 'excellent';
      } else if (headroom >= 10) {
        fitStatus = 'tight';
      } else {
        fitStatus = 'oom-risk';
      }
    }

    return {
      gpu,
      gpuCount,
      totalVRAM,
      utilization,
      fitStatus,
      estimatedPrice: gpu.basePrice * gpuCount,
    };
  }).sort((a, b) => {
    const statusOrder = { excellent: 0, good: 0, tight: 1, 'oom-risk': 1, insufficient: 2 };
    const statusDiff = statusOrder[a.fitStatus] - statusOrder[b.fitStatus];
    if (statusDiff !== 0) return statusDiff;
    return a.estimatedPrice - b.estimatedPrice;
  });
}
