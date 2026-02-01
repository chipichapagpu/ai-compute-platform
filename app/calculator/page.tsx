'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'

// GPU options for recommendations
const GPU_OPTIONS = [
  // Consumer
  { name: 'RTX 4090', vram: 24, price: 0.74, provider: 'RunPod', url: 'https://runpod.io', type: 'pcie' },
  // Datacenter - Entry
  { name: 'L4', vram: 24, price: 0.48, provider: 'AWS', url: 'https://aws.amazon.com', type: 'pcie' },
  { name: 'A10G', vram: 24, price: 0.75, provider: 'AWS', url: 'https://aws.amazon.com', type: 'pcie' },
  { name: 'L40S', vram: 48, price: 1.14, provider: 'Lambda', url: 'https://lambdalabs.com', type: 'pcie' },
  { name: 'A40', vram: 48, price: 0.79, provider: 'Lambda', url: 'https://lambdalabs.com', type: 'pcie' },
  // Datacenter - Ampere
  { name: 'A100 40GB', vram: 40, price: 1.29, provider: 'Lambda', url: 'https://lambdalabs.com', type: 'sxm' },
  { name: 'A100 80GB', vram: 80, price: 1.99, provider: 'Lambda', url: 'https://lambdalabs.com', type: 'sxm' },
  // Datacenter - Hopper
  { name: 'H100 PCIe', vram: 80, price: 2.49, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'pcie' },
  { name: 'H100 SXM', vram: 80, price: 3.25, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'sxm' },
  { name: 'H100 NVL', vram: 94, price: 3.92, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'nvlink' },
  { name: 'H200', vram: 141, price: 4.50, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'nvlink' },
  // Datacenter - Blackwell
  { name: 'B100', vram: 192, price: 4.80, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'nvlink' },
  { name: 'B200', vram: 192, price: 5.50, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'nvlink' },
  { name: 'B300', vram: 288, price: 7.00, provider: 'CoreWeave', url: 'https://coreweave.com', type: 'nvlink' },
]

const VALID_GPU_COUNTS = [1, 2, 4, 8]

// VRAM calculation
function calculateVRAMDetailed({
  P, L, n_kv, d_h, B_w, B_kv = 16, S, B_s,
}: {
  P: number; L: number; n_kv: number; d_h: number;
  B_w: number; B_kv: number; S: number; B_s: number;
}) {
  const weights = P * (B_w / 8)
  const kv_cache = S * B_s * L * n_kv * d_h * 2 * (B_kv / 8)
  // Fixed overhead: 0.5 GB base + 2% of weights
  const overhead = 0.5e9 + (weights * 0.02)
  const total = weights + kv_cache + overhead
  return {
    weights: weights / 1e9,
    kv_cache: kv_cache / 1e9,
    overhead: overhead / 1e9,
    total: total / 1e9
  }
}

const MODEL_PRESETS: Record<string, { params: number; layers: number; kvHeads: number; headDim: number }> = {
  'Mistral 7B': { params: 7, layers: 32, kvHeads: 8, headDim: 128 },
  'LLaMA 7B': { params: 7, layers: 32, kvHeads: 32, headDim: 128 },
  'LLaMA 13B': { params: 13, layers: 40, kvHeads: 40, headDim: 128 },
  'LLaMA 70B': { params: 70, layers: 80, kvHeads: 8, headDim: 128 },
  'LLaMA 405B': { params: 405, layers: 126, kvHeads: 8, headDim: 128 },
  'Qwen 2.5 7B': { params: 7.6, layers: 28, kvHeads: 4, headDim: 128 },
  'Qwen 2.5 14B': { params: 14.7, layers: 48, kvHeads: 8, headDim: 128 },
  'Qwen 2.5 32B': { params: 32.5, layers: 64, kvHeads: 8, headDim: 128 },
  'Qwen 2.5 72B': { params: 72.7, layers: 80, kvHeads: 8, headDim: 128 },
  'Gemma 2 9B': { params: 9.24, layers: 42, kvHeads: 8, headDim: 256 },
  'Gemma 2 27B': { params: 27.2, layers: 46, kvHeads: 16, headDim: 128 },
  'Gemma 3 4B': { params: 3.9, layers: 34, kvHeads: 4, headDim: 256 },
  'Gemma 3 12B': { params: 12, layers: 48, kvHeads: 8, headDim: 256 },
  'Gemma 3 27B': { params: 27.2, layers: 62, kvHeads: 16, headDim: 128 },
  'Phi-4 14B': { params: 14, layers: 40, kvHeads: 10, headDim: 128 },
  'GLM-4 9B': { params: 9, layers: 40, kvHeads: 2, headDim: 128 },
  'GPT-OSS 20B': { params: 20.9, layers: 24, kvHeads: 8, headDim: 64 },
  'GPT-OSS 120B': { params: 116.8, layers: 36, kvHeads: 8, headDim: 64 },
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

export default function CalculatorPage() {
  const [selectedModel, setSelectedModel] = useState('Mistral 7B')
  const [weightQuant, setWeightQuant] = useState('INT8')
  const [kvCacheQuant, setKvCacheQuant] = useState('FP16')
  const [contextLength, setContextLength] = useState(8192)
  const [batchSize, setBatchSize] = useState(1)
  const [sortCol, setSortCol] = useState<'name'|'vram'|'gpuCount'|'utilization'|'estPrice'>('estPrice')
  const [sortAsc, setSortAsc] = useState(true)

  const modelConfig = MODEL_PRESETS[selectedModel]

  const vramBreakdown = useMemo(() => {
    const B_w = QUANTIZATION_OPTIONS.find(q => q.value === weightQuant)?.bits || 16
    const B_kv = QUANTIZATION_OPTIONS.find(q => q.value === kvCacheQuant)?.bits || 16

    return calculateVRAMDetailed({
      P: modelConfig.params * 1e9,
      L: modelConfig.layers,
      n_kv: modelConfig.kvHeads,
      d_h: modelConfig.headDim,
      B_w,
      B_kv,
      S: contextLength,
      B_s: batchSize,
    })
  }, [modelConfig, weightQuant, kvCacheQuant, contextLength, batchSize])

  // GPU recommendations
  const gpuRecommendations = useMemo(() => {
    const required = vramBreakdown.total
    const results: Array<typeof GPU_OPTIONS[0] & {
      gpuCount: number; utilization: number; fit: string; warning?: string; estPrice: number
    }> = []

    for (const gpu of GPU_OPTIONS) {
      // Find smallest valid count that fits
      const gpuCount = VALID_GPU_COUNTS.find(n => n * gpu.vram * 0.9 >= required)
      if (!gpuCount) continue // Requires 8+ GPUs, skip

      // Skip PCIe GPUs for multi-GPU (>2) setups
      if (gpuCount > 2 && gpu.type === 'pcie') continue

      const utilization = Math.min(100, (required / (gpu.vram * gpuCount)) * 100)
      if (utilization < 15) continue // Skip overprovisioned
      let fit = utilization <= 70 ? 'Excellent' : utilization <= 85 ? 'Good' : utilization <= 95 ? 'Tight' : 'Too Small'
      let warning: string | undefined

      // PCIe warning for 2-GPU setups
      if (gpuCount === 2 && gpu.type === 'pcie') {
        warning = 'PCIe — lower multi-GPU throughput'
      }

      const estPrice = gpu.price * gpuCount
      results.push({ ...gpu, gpuCount, utilization, fit, warning, estPrice })
    }

    return results.sort((a, b) => {
      const cmp = a[sortCol] < b[sortCol] ? -1 : a[sortCol] > b[sortCol] ? 1 : 0
      return sortAsc ? cmp : -cmp
    })
  }, [vramBreakdown.total, sortCol, sortAsc])

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header maxWidth="max-w-[1400px]" />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Configuration</h2>

            <div className="space-y-5">
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

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm font-medium text-blue-600 mb-1">Weights</div>
                <div className="text-2xl font-bold text-blue-800">{vramBreakdown.weights.toFixed(2)} GB</div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <div className="text-sm font-medium text-cyan-600 mb-1">KV Cache</div>
                <div className="text-2xl font-bold text-cyan-800">{vramBreakdown.kv_cache.toFixed(2)} GB</div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="text-sm font-medium text-orange-600 mb-1">Overhead</div>
                <div className="text-2xl font-bold text-orange-800">{vramBreakdown.overhead.toFixed(2)} GB</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="text-sm font-medium text-red-600 mb-1">Total VRAM Required</div>
              <div className="text-4xl font-bold text-red-700">{vramBreakdown.total.toFixed(2)} GB</div>
            </div>
          </div>
        </div>

        {/* GPU Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">GPU Recommendations</h2>
          {gpuRecommendations.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
              ⚠️ Requires multi-node setup (8+ GPUs). Contact provider for availability.
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {([['name','GPU','left'],['vram','VRAM','right'],['gpuCount','GPUs','right'],['utilization','Utilization','right'],['estPrice','$/hour','right']] as const).map(([col,label,align]) => (
                    <th key={col} className={`text-${align} py-3 px-4 text-sm font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none`} onClick={() => toggleSort(col)}>
                      {label} {sortCol === col && (sortAsc ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {gpuRecommendations.map(gpu => (
                  <tr key={gpu.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{gpu.name}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{gpu.vram} GB</td>
                    <td className="py-3 px-4 text-right text-slate-600">{gpu.gpuCount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${gpu.utilization > 90 ? 'bg-red-500' : gpu.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${gpu.utilization}%`}} />
                        </div>
                        <span className="text-slate-600 w-10 text-right">{gpu.utilization.toFixed(0)}%</span>
                      </div>
                                          </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      ${gpu.estPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={gpu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        {gpu.provider} →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>
    </div>
  )
}
