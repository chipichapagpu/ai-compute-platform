'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HARDWARE_DATA, MANUFACTURERS, sortHardware, filterByManufacturers, getTopValues, type SortField, type Hardware } from '@/lib/hardware'

export default function HardwareComparison() {
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(MANUFACTURERS)
  const [sortBy, setSortBy] = useState<SortField>('petaflops8')
  const [compareChips, setCompareChips] = useState<string[]>([])

  const filteredAndSorted = useMemo(() => {
    const filtered = filterByManufacturers(HARDWARE_DATA, selectedManufacturers)
    return sortHardware(filtered, sortBy)
  }, [selectedManufacturers, sortBy])

  const comparisonData = useMemo(() => {
    return HARDWARE_DATA.filter(h => compareChips.includes(h.hardware))
  }, [compareChips])

  const topValues = useMemo(() => {
    return {
      petaflops16: getTopValues(filteredAndSorted, 'petaflops16'),
      petaflops8: getTopValues(filteredAndSorted, 'petaflops8'),
      memory: getTopValues(filteredAndSorted, 'memory'),
      bandwidth: getTopValues(filteredAndSorted, 'bandwidth')
    }
  }, [filteredAndSorted])

  const maxValues = useMemo(() => {
    if (filteredAndSorted.length === 0) return { memory: 0, bandwidth: 0, petaflops8: 0 }

    const maxMemory = Math.max(...filteredAndSorted.map(h => h.memory))
    const maxBandwidth = Math.max(...filteredAndSorted.map(h => h.bandwidth))
    const maxPetaflops8 = Math.max(...filteredAndSorted.map(h => h.petaflops8))

    const memoryChip = filteredAndSorted.find(h => h.memory === maxMemory)
    const bandwidthChip = filteredAndSorted.find(h => h.bandwidth === maxBandwidth)
    const petaflopsChip = filteredAndSorted.find(h => h.petaflops8 === maxPetaflops8)

    return {
      memory: maxMemory,
      memoryChip: memoryChip?.hardware || '',
      bandwidth: maxBandwidth,
      bandwidthChip: bandwidthChip?.hardware || '',
      petaflops8: maxPetaflops8,
      petaflopsChip: petaflopsChip?.hardware || ''
    }
  }, [filteredAndSorted])

  const toggleManufacturer = (manufacturer: string) => {
    setSelectedManufacturers(prev =>
      prev.includes(manufacturer)
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    )
  }

  const toggleCompareChip = (chip: string) => {
    setCompareChips(prev => {
      if (prev.includes(chip)) {
        return prev.filter(c => c !== chip)
      }
      if (prev.length >= 3) {
        return prev // Max 3 chips
      }
      return [...prev, chip]
    })
  }

  const isTopValue = (field: keyof typeof topValues, value: number) => {
    return topValues[field as keyof typeof topValues]?.has(value)
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
                <h1 className="text-xl font-bold text-slate-900">Compare Hardware</h1>
                <p className="text-sm text-slate-500">Benchmarking 26+ AI accelerators</p>
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

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-600 mb-2">Max HBM Capacity</div>
            <div className="text-3xl font-bold text-slate-900">{maxValues.memory} GB</div>
            <div className="text-xs text-slate-500 mt-1">{maxValues.memoryChip}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-600 mb-2">Max Bandwidth</div>
            <div className="text-3xl font-bold text-slate-900">{maxValues.bandwidth} TB/s</div>
            <div className="text-xs text-slate-500 mt-1">{maxValues.bandwidthChip}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-600 mb-2">Peak FP8 Compute</div>
            <div className="text-3xl font-bold text-slate-900">{maxValues.petaflops8} TFLOPS</div>
            <div className="text-xs text-slate-500 mt-1">{maxValues.petaflopsChip}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-600 mb-2">Chips Indexed</div>
            <div className="text-3xl font-bold text-slate-900">{HARDWARE_DATA.length}</div>
            <div className="text-xs text-green-600 mt-1">+3 this month</div>
          </div>
        </div>

        {/* Quick Compare */}
        {compareChips.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Quick Compare</h2>
              <button
                onClick={() => setCompareChips([])}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Selection
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50">Metric</th>
                    {comparisonData.map((chip) => (
                      <th key={chip.hardware} className="text-left py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50">
                        {chip.hardware}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Manufacturer</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.manufacturer}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Type</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.type}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Primary Workload</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.primaryWorkload}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Secondary Workload</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.secondaryWorkload}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Release Date</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.releaseDate}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">FP-16 (PFLOPS)</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.petaflops16}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">FP-8 (PFLOPS)</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.petaflops8}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Memory (GB)</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.memory}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Bandwidth (TB/s)</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.bandwidth}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-700">Power (Watts)</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.power}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700">Foundry</td>
                    {comparisonData.map((chip) => (
                      <td key={chip.hardware} className="py-3 px-4 text-slate-700">{chip.foundry}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Filter by Manufacturer
              </label>
              <div className="flex flex-wrap gap-2">
                {MANUFACTURERS.map((manufacturer) => (
                  <button
                    key={manufacturer}
                    onClick={() => toggleManufacturer(manufacturer)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedManufacturers.includes(manufacturer)
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {manufacturer}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-64">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="petaflops8">FP-8 Performance</option>
                <option value="petaflops16">FP-16 Performance</option>
                <option value="memory">Memory</option>
                <option value="releaseDate">Release Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Full Hardware Index */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Full Hardware Index</h2>
            <div className="text-sm text-slate-500">
              Select up to 3 chips to compare side-by-side
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Compare
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Hardware
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Primary Workload
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Secondary Workload
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    FP-16 (PFLOPS)
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    FP-8 (PFLOPS)
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Memory (GB)
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Bandwidth (TB/s)
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Power (W)
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">
                    Foundry
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((hw, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={compareChips.includes(hw.hardware)}
                        onChange={() => toggleCompareChip(hw.hardware)}
                        disabled={!compareChips.includes(hw.hardware) && compareChips.length >= 3}
                        className="w-4 h-4 text-red-500 rounded border-slate-300 focus:ring-red-500 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{hw.hardware}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.manufacturer}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.type}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.primaryWorkload}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.secondaryWorkload}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.releaseDate}</td>
                    <td className={`py-3 px-4 text-right ${isTopValue('petaflops16', hw.petaflops16) ? 'bg-red-50 font-semibold text-red-600' : 'text-slate-700'}`}>
                      {hw.petaflops16}
                    </td>
                    <td className={`py-3 px-4 text-right ${isTopValue('petaflops8', hw.petaflops8) ? 'bg-red-50 font-semibold text-red-600' : 'text-slate-700'}`}>
                      {hw.petaflops8}
                    </td>
                    <td className={`py-3 px-4 text-right ${isTopValue('memory', hw.memory) ? 'bg-red-50 font-semibold text-red-600' : 'text-slate-700'}`}>
                      {hw.memory}
                    </td>
                    <td className={`py-3 px-4 text-right ${isTopValue('bandwidth', hw.bandwidth) ? 'bg-red-50 font-semibold text-red-600' : 'text-slate-700'}`}>
                      {hw.bandwidth}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">{hw.power}</td>
                    <td className="py-3 px-4 text-slate-700">{hw.foundry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            <strong>Data Source:</strong> Aggregated from manufacturer specifications and verified benchmarks
          </div>
        </div>
      </div>
    </div>
  )
}
