'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HARDWARE_DATA } from '@/lib/hardware'

// VRAM calculation using the correct formula
function calculateVRAMDetailed({
  P,          // Parameters (raw count, e.g., 7e9 for 7B)
  L,          // Layers
  n_kv,       // Number of KV heads
  d_h,        // Head dimension
  B_w,        // Weight bits (e.g., 8 for INT8)
  B_kv = 16,  // KV cache bits (default FP16 = 16)
  S,          // Sequence length (context)
  B_s,        // Batch size
  alpha_w = 0.10,   // Weight overhead (10%)
  alpha_kv = 0.02   // KV cache overhead (2%)
}: {
  P: number; L: number; n_kv: number; d_h: number;
  B_w: number; B_kv: number; S: number; B_s: number;
  alpha_w?: number; alpha_kv?: number;
}) {
  const weights = P * (B_w / 8)
  const kv_cache = 2 * L * n_kv * d_h * S * B_s * (B_kv / 8)
  const total = weights * (1 + alpha_w) + kv_cache * (1 + alpha_kv)
  return {
    weights: weights / 1e9,
    kv_cache: kv_cache / 1e9,
    weightOverhead: (weights * alpha_w) / 1e9,
    kvOverhead: (kv_cache * alpha_kv) / 1e9,
    total: total / 1e9
  }
}

// Model presets with architecture details (P in billions, will multiply by 1e9)
const MODEL_PRESETS: Record<string, { params: number; layers: number; kvHeads: number; headDim: number }> = {
  'Mistral 7B': { params: 7, layers: 32, kvHeads: 8, headDim: 128 },
  'LLaMA 7B': { params: 7, layers: 32, kvHeads: 32, headDim: 128 },
  'LLaMA 13B': { params: 13, layers: 40, kvHeads: 40, headDim: 128 },
  'LLaMA 70B': { params: 70, layers: 80, kvHeads: 8, headDim: 128 },
  'LLaMA 405B': { params: 405, layers: 126, kvHeads: 8, headDim: 128 },
  'Mixtral 8x7B': { params: 47, layers: 32, kvHeads: 8, headDim: 128 },
  'GPT-3 175B': { params: 175, layers: 96, kvHeads: 96, headDim: 128 },
  'Claude-3 (Est.)': { params: 200, layers: 100, kvHeads: 100, headDim: 128 },
  'GPT-4 (Est.)': { params: 1800, layers: 120, kvHeads: 120, headDim: 128 },
}

const QUANTIZATION_OPTIONS = [
  { value: 'FP32', label: 'FP32 (32-bit)', bits: 32 },
  { value: 'FP16', label: 'FP16 (16-bit)', bits: 16 },
  { value: 'BF16', label: 'BF16 (16-bit)', bits: 16 },
  { value: 'INT8', label: 'INT8 (8-bit)', bits: 8 },
  { value: 'INT4', label: 'INT4 (4-bit)', bits: 4 },
]

// GPU pricing and cloud providers (keys must match HARDWARE_DATA hardware names exactly)
const GPU_PRICING: Record<string, { basePrice: number; providers: { name: string; link: string }[] }> = {
  // NVIDIA GPUs
  'NVIDIA GB300 (Blackwell Ultra)': { basePrice: 8.00, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA B300 (Blackwell Ultra)': { basePrice: 7.50, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA GB200': { basePrice: 6.50, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }, { name: 'Lambda', link: 'https://lambdalabs.com/service/gpu-cloud' }] },
  'NVIDIA B200': { basePrice: 5.50, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA B100': { basePrice: 5.00, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA H200 SXM': { basePrice: 4.50, providers: [{ name: 'Lambda', link: 'https://lambdalabs.com/service/gpu-cloud' }, { name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA H100 NVL': { basePrice: 3.50, providers: [{ name: 'Lambda', link: 'https://lambdalabs.com/service/gpu-cloud' }, { name: 'RunPod', link: 'https://www.runpod.io/gpu-instance/pricing' }] },
  'NVIDIA HGX H20': { basePrice: 2.80, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'NVIDIA H800 SXM5': { basePrice: 2.50, providers: [{ name: 'RunPod', link: 'https://www.runpod.io/gpu-instance/pricing' }, { name: 'Vast.ai', link: 'https://vast.ai/' }] },
  'NVIDIA GH200': { basePrice: 4.00, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  // AMD GPUs
  'AMD Instinct MI355X': { basePrice: 6.00, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'AMD Instinct MI350X': { basePrice: 5.50, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'AMD Instinct MI325X': { basePrice: 4.20, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'AMD Instinct MI300X': { basePrice: 3.80, providers: [{ name: 'Lambda', link: 'https://lambdalabs.com/service/gpu-cloud' }, { name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  'AMD Radeon Instinct MI308X': { basePrice: 3.60, providers: [{ name: 'CoreWeave', link: 'https://www.coreweave.com/pricing' }] },
  // Google TPUs
  'Google TPU v7 Ironwood': { basePrice: 4.50, providers: [{ name: 'GCP', link: 'https://cloud.google.com/tpu/pricing' }] },
  'Google TPU v6e Trillium': { basePrice: 2.80, providers: [{ name: 'GCP', link: 'https://cloud.google.com/tpu/pricing' }] },
  'Google TPU v5p': { basePrice: 2.50, providers: [{ name: 'GCP', link: 'https://cloud.google.com/tpu/pricing' }] },
  // Amazon
  'Amazon Trainium3': { basePrice: 3.50, providers: [{ name: 'AWS', link: 'https://aws.amazon.com/machine-learning/trainium/' }] },
  'Amazon Trainium2': { basePrice: 2.00, providers: [{ name: 'AWS', link: 'https://aws.amazon.com/machine-learning/trainium/' }] },
  // Intel
  'Intel Habana Gaudi3': { basePrice: 2.80, providers: [{ name: 'AWS', link: 'https://aws.amazon.com/ec2/instance-types/dl2q/' }] },
  // Huawei
  'Huawei Ascend 920': { basePrice: 3.00, providers: [{ name: 'Huawei Cloud', link: 'https://www.huaweicloud.com/' }] },
  'Huawei Ascend 910C': { basePrice: 2.50, providers: [{ name: 'Huawei Cloud', link: 'https://www.huaweicloud.com/' }] },
  // Microsoft
  'Maia 100 (M100)': { basePrice: 3.00, providers: [{ name: 'Azure', link: 'https://azure.microsoft.com/' }] },
  // Moore Threads
  'MTT S4000': { basePrice: 1.50, providers: [{ name: 'Moore Threads', link: 'https://www.mthreads.com/' }] },
}

export default function CalculatorPage() {
  const [selectedModel, setSelectedModel] = useState('Mistral 7B')
  const [weightQuant, setWeightQuant] = useState('INT8')
  const [kvCacheQuant, setKvCacheQuant] = useState('FP16')
  const [contextLength, setContextLength] = useState(8192)
  const [batchSize, setBatchSize] = useState(1)

  const modelConfig = MODEL_PRESETS[selectedModel]

  const vramBreakdown = useMemo(() => {
    const B_w = QUANTIZATION_OPTIONS.find(q => q.value === weightQuant)?.bits || 16
    const B_kv = QUANTIZATION_OPTIONS.find(q => q.value === kvCacheQuant)?.bits || 16

    return calculateVRAMDetailed({
      P: modelConfig.params * 1e9,  // Convert billions to raw count
      L: modelConfig.layers,
      n_kv: modelConfig.kvHeads,
      d_h: modelConfig.headDim,
      B_w,
      B_kv,
      S: contextLength,
      B_s: batchSize,
      alpha_w: 0.10,
      alpha_kv: 0.02
    })
  }, [modelConfig, weightQuant, kvCacheQuant, contextLength, batchSize])

  // Find compatible GPUs (matching original Streamlit logic)
  const gpuRecommendations = useMemo(() => {
    return HARDWARE_DATA
      .filter(hw => hw.memory > 0)
      .map(hw => {
        const usableVram = hw.memory * 0.90  // 90% usable
        const gpusNeeded = Math.max(1, Math.ceil(vramBreakdown.total / usableVram))
        const totalAvailable = hw.memory * gpusNeeded
        const utilization = (vramBreakdown.total / totalAvailable) * 100
        const headroom = ((totalAvailable - vramBreakdown.total) / totalAvailable) * 100

        let fitStatus: 'excellent' | 'good' | 'tight' | 'oom-risk' | 'insufficient'

        if (vramBreakdown.total > hw.memory * 0.90) {
          // Multi-GPU required
          if (gpusNeeded === 1) {
            fitStatus = 'insufficient'
          } else {
            if (headroom > 20) fitStatus = 'good'
            else if (headroom >= 10) fitStatus = 'tight'
            else fitStatus = 'oom-risk'
          }
        } else {
          // Single GPU sufficient
          if (headroom > 20) fitStatus = 'excellent'
          else if (headroom >= 10) fitStatus = 'tight'
          else fitStatus = 'oom-risk'
        }

        // Get pricing info
        const pricing = GPU_PRICING[hw.hardware]
        const estPrice = pricing ? pricing.basePrice * gpusNeeded : null

        return {
          ...hw,
          utilization,
          gpusNeeded,
          totalAvailable,
          headroom,
          fits: gpusNeeded === 1,
          fitStatus,
          estPrice,
          providers: pricing?.providers || []
        }
      })
      .sort((a, b) => {
        // Sort: Excellent/Good first, then Tight/OOM-risk, then Insufficient
        const statusOrder = { 'excellent': 0, 'good': 0, 'tight': 1, 'oom-risk': 1, 'insufficient': 2 }
        if (statusOrder[a.fitStatus] !== statusOrder[b.fitStatus]) {
          return statusOrder[a.fitStatus] - statusOrder[b.fitStatus]
        }
        // Within same tier, sort by memory (prefer optimal fit)
        return a.utilization - b.utilization
      })
  }, [vramBreakdown.total])

  const getFitStatusStyle = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-300'
      case 'good': return 'bg-green-100 text-green-700 border-green-300'
      case 'tight': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'oom-risk': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'insufficient': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const getFitStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return '🟢 Excellent'
      case 'good': return '🟢 Good'
      case 'tight': return '🟡 Tight'
      case 'oom-risk': return '🟡 OOM Risk'
      case 'insufficient': return '🔴 Insufficient'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">◆</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">VRAM Estimator</h1>
                <p className="text-sm text-slate-500">Calculate memory requirements for LLM deployment</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Configuration</h2>

            <div className="space-y-5">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Object.keys(MODEL_PRESETS).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Weight Quantization */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Weight Quantization</label>
                <select
                  value={weightQuant}
                  onChange={(e) => setWeightQuant(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {QUANTIZATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* KV Cache Quantization */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">KV Cache Quantization</label>
                <select
                  value={kvCacheQuant}
                  onChange={(e) => setKvCacheQuant(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {QUANTIZATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Context Length */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Context Length: {contextLength.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="512"
                  max="131072"
                  step="512"
                  value={contextLength}
                  onChange={(e) => setContextLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>512</span>
                  <span>131K</span>
                </div>
              </div>

              {/* Batch Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Batch Size: {batchSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="128"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span>128</span>
                </div>
              </div>
            </div>
          </div>

          {/* VRAM Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">VRAM Breakdown</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Weights */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm font-medium text-blue-600 mb-1">Weights</div>
                <div className="text-2xl font-bold text-blue-800">{vramBreakdown.weights.toFixed(2)} GB</div>
              </div>

              {/* KV Cache */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <div className="text-sm font-medium text-cyan-600 mb-1">KV Cache</div>
                <div className="text-2xl font-bold text-cyan-800">{vramBreakdown.kv_cache.toFixed(2)} GB</div>
              </div>

              {/* Weight Overhead */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="text-sm font-medium text-orange-600 mb-1">Weight Overhead</div>
                <div className="text-2xl font-bold text-orange-800">{vramBreakdown.weightOverhead.toFixed(2)} GB</div>
              </div>

              {/* KV Overhead */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-sm font-medium text-yellow-600 mb-1">KV Overhead</div>
                <div className="text-2xl font-bold text-yellow-800">{vramBreakdown.kvOverhead.toFixed(2)} GB</div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="text-sm font-medium text-red-600 mb-1">Total VRAM Required</div>
              <div className="text-4xl font-bold text-red-700">{vramBreakdown.total.toFixed(2)} GB</div>
            </div>
          </div>
        </div>

        {/* GPU Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">GPU Recommendations</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">GPU</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">VRAM</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">GPUs</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Utilization</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Fit Check</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Est. Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Deploy</th>
                </tr>
              </thead>
              <tbody>
                {gpuRecommendations.slice(0, 12).map((gpu, index) => (
                  <tr key={gpu.hardware} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <span className={`text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-amber-600'}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        <span className="font-medium text-slate-900">{gpu.hardware}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{gpu.memory} GB</td>
                    <td className="py-3 px-4 text-slate-600">{gpu.gpusNeeded}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              gpu.fitStatus === 'excellent' || gpu.fitStatus === 'good' ? 'bg-green-500' :
                              gpu.fitStatus === 'tight' || gpu.fitStatus === 'oom-risk' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(gpu.utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">{gpu.utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFitStatusStyle(gpu.fitStatus)}`}>
                        {getFitStatusLabel(gpu.fitStatus)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {gpu.estPrice ? `$${gpu.estPrice.toFixed(2)}/hr` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {gpu.providers.length > 0 ? (
                          gpu.providers.slice(0, 2).map((provider, i) => (
                            <a
                              key={i}
                              href={provider.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              {provider.name}
                            </a>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
