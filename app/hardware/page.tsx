'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import { HARDWARE_DATA, MANUFACTURERS, sortHardware, filterByManufacturers, getTopValues, type SortField } from '@/lib/hardware'

export default function HardwareComparison() {
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(MANUFACTURERS)
  const [sortBy, setSortBy] = useState<SortField>('petaflops8')
  const [sortAsc, setSortAsc] = useState(false)
  const [compareChips, setCompareChips] = useState<string[]>([])

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(false) }
  }

  const filteredAndSorted = useMemo(() => {
    const filtered = filterByManufacturers(HARDWARE_DATA, selectedManufacturers)
    return sortHardware(filtered, sortBy, sortAsc)
  }, [selectedManufacturers, sortBy, sortAsc])

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
      <Header maxWidth="max-w-[1400px]" />

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
                  {([
                    ['hardware', 'Hardware', 'left'],
                    ['manufacturer', 'Manufacturer', 'left'],
                    ['type', 'Type', 'left'],
                    ['primaryWorkload', 'Primary Workload', 'left'],
                    ['secondaryWorkload', 'Secondary Workload', 'left'],
                    ['releaseDate', 'Release Date', 'left'],
                    ['petaflops16', 'FP-16 (PFLOPS)', 'right'],
                    ['petaflops8', 'FP-8 (PFLOPS)', 'right'],
                    ['memory', 'Memory (GB)', 'right'],
                    ['bandwidth', 'Bandwidth (TB/s)', 'right'],
                    ['power', 'Power (W)', 'right'],
                    ['foundry', 'Foundry', 'left'],
                  ] as [SortField, string, string][]).map(([field, label, align]) => (
                    <th key={field} onClick={() => handleSort(field)} className={`text-${align} py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none`}>
                      {label} {sortBy === field && (sortAsc ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Compare</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((hw, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
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
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={compareChips.includes(hw.hardware)}
                        onChange={() => toggleCompareChip(hw.hardware)}
                        disabled={!compareChips.includes(hw.hardware) && compareChips.length >= 3}
                        className="w-4 h-4 text-red-500 rounded border-slate-300 focus:ring-red-500 disabled:opacity-50"
                      />
                    </td>
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
