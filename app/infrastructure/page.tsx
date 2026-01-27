'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DATA_CENTERS, CLUSTER_SCALE, CLOUD_COMPARISON_PLACEHOLDER, VENDOR_COLORS, type DataCenter, type ClusterScale, type CloudComparison } from '@/lib/infrastructure'

type TabType = 'datacenters' | 'scalability' | 'comparison'

export default function Infrastructure() {
  const [activeTab, setActiveTab] = useState<TabType>('datacenters')

  const sortedClusters = [...CLUSTER_SCALE].sort((a, b) => b.singleDomainScale - a.singleDomainScale)

  const getVendorColor = (platform: string) => {
    return VENDOR_COLORS[platform] || '#64748b'
  }

  const maxScale = Math.max(...sortedClusters.map(c => c.singleDomainScale))

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
                <h1 className="text-xl font-bold text-slate-900">AI Compute Planner</h1>
                <p className="text-sm text-slate-500">Infrastructure Planning Tools</p>
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
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('datacenters')}
              className={`flex-1 px-6 py-4 font-semibold text-sm transition-all border-b-3 ${
                activeTab === 'datacenters'
                  ? 'text-slate-900 border-b-red-500 bg-red-50/30'
                  : 'text-slate-600 border-b-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>Global Infrastructure</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('scalability')}
              className={`flex-1 px-6 py-4 font-semibold text-sm transition-all border-b-3 ${
                activeTab === 'scalability'
                  ? 'text-slate-900 border-b-red-500 bg-red-50/30'
                  : 'text-slate-600 border-b-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Cluster Scalability</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 px-6 py-4 font-semibold text-sm transition-all border-b-3 ${
                activeTab === 'comparison'
                  ? 'text-slate-900 border-b-red-500 bg-red-50/30'
                  : 'text-slate-600 border-b-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4"></path>
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </svg>
                <span>NVIDIA vs Google</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'datacenters' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Mega-Scale AI Campus Distribution</h2>
              <div className="text-sm text-slate-500 mb-6">
                <strong>Data Source:</strong> Compiled from public filings, satellite imagery, and energy permits
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm font-semibold text-blue-700 mb-1">Total Sites</div>
                  <div className="text-3xl font-bold text-blue-900">{DATA_CENTERS.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-sm font-semibold text-green-700 mb-1">Total Chips</div>
                  <div className="text-3xl font-bold text-green-900">
                    {(DATA_CENTERS.reduce((sum, dc) => sum + dc.chipCount, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm font-semibold text-orange-700 mb-1">Current Power</div>
                  <div className="text-3xl font-bold text-orange-900">
                    {DATA_CENTERS.reduce((sum, dc) => sum + dc.currentPower, 0)} MW
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700 mb-1">Planned Power</div>
                  <div className="text-3xl font-bold text-purple-900">
                    {DATA_CENTERS.reduce((sum, dc) => sum + dc.maxPlannedPower, 0)} MW
                  </div>
                </div>
              </div>

              {/* Data Centers Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Rank</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Owner</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Location</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Hardware</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Chip Count</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Current Power (MW)</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Max Planned (MW)</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DATA_CENTERS.map((dc, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900">{dc.rank}</td>
                        <td className="py-4 px-4 font-semibold text-slate-900">{dc.owner}</td>
                        <td className="py-4 px-4 text-slate-700">{dc.location}, {dc.state}</td>
                        <td className="py-4 px-4 text-slate-700">{dc.hardware}</td>
                        <td className="py-4 px-4 text-right font-semibold text-slate-900">
                          {dc.chipCount > 0 ? dc.chipCount.toLocaleString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-700">{dc.currentPower}</td>
                        <td className="py-4 px-4 text-right text-slate-700">
                          {dc.maxPlannedPower > 0 ? dc.maxPlannedPower : '-'}
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm">{dc.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scalability' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Single Domain Scalability Metrics</h2>
              <div className="text-sm text-slate-500 mb-6">
                <strong>Data Source:</strong> Interconnect topology from vendor documentation and research papers
              </div>

              {/* Bar Chart Visualization */}
              <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-md font-semibold text-slate-900 mb-6">Maximum Single-Domain Cluster Scale by Platform</h3>
                <div className="space-y-3">
                  {sortedClusters.map((cluster, idx) => {
                    const percentage = (cluster.singleDomainScale / maxScale) * 100
                    const color = getVendorColor(cluster.platform)

                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            ></div>
                            <span className="text-sm font-semibold text-slate-700">{cluster.chip}</span>
                            <span className="text-xs text-slate-500">({cluster.platform})</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{cluster.singleDomainScale.toLocaleString()}</span>
                        </div>
                        <div className="h-10 bg-slate-200 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                              opacity: 0.9
                            }}
                          >
                            <span className="text-white font-bold text-xs drop-shadow-md">
                              {cluster.singleDomainScale.toLocaleString()} chips
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {cluster.interconnect} • {cluster.bandwidth} GB/s • {cluster.hbmMemory} GB HBM
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-300">
                  {Object.entries(VENDOR_COLORS).map(([vendor, color]) => (
                    <div key={vendor} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-700">{vendor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Specifications Table */}
              <h3 className="text-md font-semibold text-slate-900 mb-4">Detailed Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Platform</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Chip / Accelerator</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Release Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Interconnect</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Max Domain Scale</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Bandwidth (GB/s)</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">HBM Memory (GB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClusters.map((cluster, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getVendorColor(cluster.platform) }}
                            ></div>
                            <span className="font-semibold text-slate-900">{cluster.platform}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">{cluster.chip}</td>
                        <td className="py-4 px-4 text-slate-700">{cluster.releaseDate}</td>
                        <td className="py-4 px-4 text-slate-700">{cluster.interconnect}</td>
                        <td className="py-4 px-4 text-right font-bold text-slate-900">{cluster.singleDomainScale.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-slate-700">{cluster.bandwidth}</td>
                        <td className="py-4 px-4 text-right text-slate-700">{cluster.hbmMemory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Strategic Comparison: NVIDIA vs Google</h2>
              <div className="text-sm text-slate-500 mb-6">
                <strong>Data Source:</strong> Analysis based on cloud pricing, availability, and performance benchmarks
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.5 2C12.5 2 16 3 16 7v4.5L12.5 15L9 11.5V7C9 3 12.5 2 12.5 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">NVIDIA</h3>
                      <p className="text-sm text-green-700">Blackwell / Hopper Series</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-700 mb-1">Peak Performance</div>
                      <div className="text-lg font-bold text-green-900">4500-5000 TFLOPS FP8</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-700 mb-1">Memory</div>
                      <div className="text-lg font-bold text-green-900">192-288 GB HBM</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-700 mb-1">Max Scale</div>
                      <div className="text-lg font-bold text-green-900">72-576 chips/domain</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Google</h3>
                      <p className="text-sm text-blue-700">TPU v5/v6/v7 Series</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-blue-700 mb-1">Peak Performance</div>
                      <div className="text-lg font-bold text-blue-900">918-4610 TFLOPS FP8</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-blue-700 mb-1">Memory</div>
                      <div className="text-lg font-bold text-blue-900">32-192 GB HBM</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs font-semibold text-blue-700 mb-1">Max Scale</div>
                      <div className="text-lg font-bold text-blue-900">256-9,216 chips/domain</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Metric</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-green-50 uppercase tracking-wider">NVIDIA</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-blue-50 uppercase tracking-wider">Google</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-50 uppercase tracking-wider">Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLOUD_COMPARISON_PLACEHOLDER.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-slate-900">{row.metric}</td>
                        <td className="py-4 px-4 text-slate-700 bg-green-50/30">{row.nvidia}</td>
                        <td className="py-4 px-4 text-slate-700 bg-blue-50/30">{row.google}</td>
                        <td className="py-4 px-4 text-slate-600 text-sm">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-sm text-amber-800">
                    <strong>Note:</strong> This comparison uses placeholder data. In production, live data would be fetched from Google Sheets for real-time pricing and availability updates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
