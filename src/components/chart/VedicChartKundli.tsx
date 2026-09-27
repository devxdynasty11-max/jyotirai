import React, { useState } from 'react';
import { VedicChartData, BhavaData, GrahaPosition } from '../../services/astrology/types.ts';
import { Info, Sparkles, X, ChevronRight, Compass, Shield, Flame, Droplets, Wind, Mountain } from 'lucide-react';

interface VedicChartKundliProps {
  chart: VedicChartData;
}

export const VedicChartKundli: React.FC<VedicChartKundliProps> = ({ chart }) => {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [viewMode, setViewMode] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedBhava, setSelectedBhava] = useState<BhavaData | null>(null);
  const [selectedGraha, setSelectedGraha] = useState<GrahaPosition | null>(null);

  // Helper to get element icon
  const getElementBadge = (el: string) => {
    switch (el) {
      case 'Fire':
        return <span className="text-amber-400 flex items-center gap-1"><Flame className="h-3 w-3" /> Fire</span>;
      case 'Water':
        return <span className="text-blue-400 flex items-center gap-1"><Droplets className="h-3 w-3" /> Water</span>;
      case 'Air':
        return <span className="text-teal-300 flex items-center gap-1"><Wind className="h-3 w-3" /> Air</span>;
      case 'Earth':
        return <span className="text-emerald-400 flex items-center gap-1"><Mountain className="h-3 w-3" /> Earth</span>;
      default:
        return el;
    }
  };

  const getDignityColor = (dignity: string) => {
    switch (dignity) {
      case 'Exalted':
        return 'text-[#48D597] bg-[#48D597]/10 border-[#48D597]/30';
      case 'Own Sign':
        return 'text-[#64B5F6] bg-[#64B5F6]/10 border-[#64B5F6]/30';
      case 'Debilitated':
        return 'text-[#FF8A80] bg-[#FF8A80]/10 border-[#FF8A80]/30';
      default:
        return 'text-[#A1AABF] bg-[#181F2D] border-[#293448]';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2536] pb-5">
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4EFE6]">
            Interactive Birth Chart (Kundli)
          </h2>
          <p className="text-xs text-[#8E97AB] mt-1">
            Calculated for {chart.birthDetails.name} · {chart.birthDetails.city}, {chart.birthDetails.country}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Chart Style Switcher (North vs South) */}
          <div className="flex items-center bg-[#101420] border border-[#242D40] p-1 rounded">
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartStyle === 'north'
                  ? 'bg-[#B89647] text-[#0A0D14] font-semibold'
                  : 'text-[#8E97AB] hover:text-[#FFFFFF]'
              }`}
            >
              North Indian Diamond
            </button>
            <button
              onClick={() => setChartStyle('south')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartStyle === 'south'
                  ? 'bg-[#B89647] text-[#0A0D14] font-semibold'
                  : 'text-[#8E97AB] hover:text-[#FFFFFF]'
              }`}
            >
              South Indian Box
            </button>
          </div>

          {/* Beginner vs Advanced Mode */}
          <div className="flex items-center bg-[#101420] border border-[#242D40] p-1 rounded">
            <button
              onClick={() => setViewMode('beginner')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'beginner'
                  ? 'bg-[#253046] text-[#E7EBF5] font-semibold'
                  : 'text-[#8E97AB] hover:text-[#FFFFFF]'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'advanced'
                  ? 'bg-[#253046] text-[#E7EBF5] font-semibold'
                  : 'text-[#8E97AB] hover:text-[#FFFFFF]'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Chart Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#0B0E17] border border-[#1E2536] p-4 sm:p-8 rounded-xl relative">
          <div className="text-center mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#B89647] font-semibold">
              {chartStyle === 'north' ? 'Diamond Kundli' : 'South Indian Square Kundli'}
            </span>
            <p className="text-xs text-[#7A8398]">
              Tap on any House or Planet to inspect its Vedic significance
            </p>
          </div>

          {/* North Indian Diamond Kundli (SVG) */}
          {chartStyle === 'north' ? (
            <div className="relative w-full max-w-[420px] aspect-square">
              <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                {/* Background Outer Square */}
                <rect x="10" y="10" width="380" height="380" fill="#0E131E" stroke="#364158" strokeWidth="2" />
                
                {/* Diagonal Crossing Lines */}
                <line x1="10" y1="10" x2="390" y2="390" stroke="#364158" strokeWidth="1.5" />
                <line x1="390" y1="10" x2="10" y2="390" stroke="#364158" strokeWidth="1.5" />

                {/* Inner Rhombus / Diamond */}
                <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#B89647" strokeWidth="2" />

                {/* HOUSE 1 (Top Center Diamond: Ascendant / Lagna) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[0])}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <polygon points="200,10 295,105 200,200 105,105" fill="#151C2B" opacity="0.8" />
                  <text x="200" y="50" textAnchor="middle" fill="#E5BD68" fontSize="12" fontWeight="bold">
                    H1: {chart.ascendant.sign.split(' ')[0]}
                  </text>
                  <text x="200" y="70" textAnchor="middle" fill="#8FA0BA" fontSize="10">
                    Lagna · Self
                  </text>
                  <text x="200" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    {chart.bhavas[0].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 2 (Top Left Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[1])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="10,10 200,10 105,105" fill="#111623" opacity="0.8" />
                  <text x="105" y="40" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H2: {chart.bhavas[1].sign.split(' ')[0]}
                  </text>
                  <text x="105" y="60" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[1].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 3 (Top Left Lower Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[2])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="10,10 105,105 10,200" fill="#111623" opacity="0.8" />
                  <text x="50" y="95" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H3: {chart.bhavas[2].sign.split(' ')[0]}
                  </text>
                  <text x="50" y="115" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[2].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 4 (Left Middle Diamond) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[3])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="10,200 105,105 200,200 105,295" fill="#151C2B" opacity="0.8" />
                  <text x="105" y="185" textAnchor="middle" fill="#E5BD68" fontSize="11" fontWeight="bold">
                    H4: {chart.bhavas[3].sign.split(' ')[0]}
                  </text>
                  <text x="105" y="200" textAnchor="middle" fill="#8FA0BA" fontSize="9">
                    Sukha · Home
                  </text>
                  <text x="105" y="220" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    {chart.bhavas[3].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 5 (Bottom Left Upper Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[4])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="10,200 105,295 10,390" fill="#111623" opacity="0.8" />
                  <text x="50" y="285" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H5: {chart.bhavas[4].sign.split(' ')[0]}
                  </text>
                  <text x="50" y="305" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[4].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 6 (Bottom Left Lower Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[5])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="10,390 105,295 200,390" fill="#111623" opacity="0.8" />
                  <text x="105" y="345" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H6: {chart.bhavas[5].sign.split(' ')[0]}
                  </text>
                  <text x="105" y="365" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[5].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 7 (Bottom Center Diamond) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[6])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="200,200 295,295 200,390 105,295" fill="#151C2B" opacity="0.8" />
                  <text x="200" y="285" textAnchor="middle" fill="#E5BD68" fontSize="11" fontWeight="bold">
                    H7: {chart.bhavas[6].sign.split(' ')[0]}
                  </text>
                  <text x="200" y="300" textAnchor="middle" fill="#8FA0BA" fontSize="9">
                    Partnership
                  </text>
                  <text x="200" y="325" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    {chart.bhavas[6].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 8 (Bottom Right Lower Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[7])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="200,390 295,295 390,390" fill="#111623" opacity="0.8" />
                  <text x="295" y="345" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H8: {chart.bhavas[7].sign.split(' ')[0]}
                  </text>
                  <text x="295" y="365" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[7].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 9 (Bottom Right Upper Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[8])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="390,200 295,295 390,390" fill="#111623" opacity="0.8" />
                  <text x="350" y="285" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H9: {chart.bhavas[8].sign.split(' ')[0]}
                  </text>
                  <text x="350" y="305" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[8].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 10 (Right Middle Diamond) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[9])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="200,200 390,200 295,295 295,105" fill="#151C2B" opacity="0.8" />
                  <text x="295" y="185" textAnchor="middle" fill="#E5BD68" fontSize="11" fontWeight="bold">
                    H10: {chart.bhavas[9].sign.split(' ')[0]}
                  </text>
                  <text x="295" y="200" textAnchor="middle" fill="#8FA0BA" fontSize="9">
                    Karma · Career
                  </text>
                  <text x="295" y="220" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    {chart.bhavas[9].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 11 (Top Right Lower Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[10])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="390,10 390,200 295,105" fill="#111623" opacity="0.8" />
                  <text x="350" y="95" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H11: {chart.bhavas[10].sign.split(' ')[0]}
                  </text>
                  <text x="350" y="115" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[10].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>

                {/* HOUSE 12 (Top Right Upper Triangle) */}
                <g
                  onClick={() => setSelectedBhava(chart.bhavas[11])}
                  className="cursor-pointer hover:opacity-80"
                >
                  <polygon points="200,10 390,10 295,105" fill="#111623" opacity="0.8" />
                  <text x="295" y="40" textAnchor="middle" fill="#A8B5CC" fontSize="10">
                    H12: {chart.bhavas[11].sign.split(' ')[0]}
                  </text>
                  <text x="295" y="60" textAnchor="middle" fill="#DFE4EE" fontSize="11" fontWeight="bold">
                    {chart.bhavas[11].occupants.map(o => o.shortName).join(' ') || '-'}
                  </text>
                </g>
              </svg>
            </div>
          ) : (
            /* South Indian Square Kundli (12 Boxes clockwise) */
            <div className="w-full max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 bg-[#1A2130] p-1 border border-[#2B354C] rounded">
              {/* Row 1 */}
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 12) || chart.bhavas[11])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Meena (12)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.grahas.filter(g => g.sign.includes('Meena')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 1) || chart.bhavas[0])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Mesha (1)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Mesha') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Mesha')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 2) || chart.bhavas[1])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Vrishabha (2)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Vrishabha') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Vrishabha')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 3) || chart.bhavas[2])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Mithuna (3)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Mithuna') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Mithuna')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>

              {/* Row 2 */}
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 11) || chart.bhavas[10])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Kumbha (11)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Kumbha') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Kumbha')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div className="col-span-2 row-span-2 bg-[#090C14] flex flex-col items-center justify-center p-3 text-center border border-[#1E2536]">
                <span className="font-cinzel text-xs text-[#B89647] font-bold tracking-widest uppercase">
                  Vedic Kundli
                </span>
                <span className="text-[10px] text-[#788296] mt-1">
                  Fixed Signs Layout
                </span>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 4) || chart.bhavas[3])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Karka (4)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Karka') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Karka')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>

              {/* Row 3 */}
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 10) || chart.bhavas[9])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Makara (10)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Makara') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Makara')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 5) || chart.bhavas[4])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Simha (5)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Simha') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Simha')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>

              {/* Row 4 */}
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 9) || chart.bhavas[8])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Dhanu (9)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Dhanu') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Dhanu')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 8) || chart.bhavas[7])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Vrishchika (8)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Vrishchika') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Vrishchika')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 7) || chart.bhavas[6])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Tula (7)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Tula') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Tula')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
              <div
                onClick={() => setSelectedBhava(chart.bhavas.find(b => b.signIndex === 6) || chart.bhavas[5])}
                className="bg-[#0E131E] hover:bg-[#182030] p-2 flex flex-col justify-between cursor-pointer rounded text-[11px]"
              >
                <div className="text-[#8E97AB] font-mono">Kanya (6)</div>
                <div className="text-[#E7EBF5] font-bold">
                  {chart.ascendant.sign.includes('Kanya') && <span className="text-[#E5BD68] mr-1">Asc</span>}
                  {chart.grahas.filter(g => g.sign.includes('Kanya')).map(g => g.shortName).join(' ') || '-'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected House / Planet Inspection Drawer */}
        <div className="lg:col-span-5 bg-[#0F1420] border border-[#202737] rounded-xl p-6">
          {selectedBhava ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#242D40] pb-3">
                <div>
                  <span className="text-[10px] text-[#B89647] uppercase tracking-wider font-semibold">
                    House Inspection
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-[#F4EFE6]">
                    House {selectedBhava.houseNumber}: {selectedBhava.lifeArea}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBhava(null)}
                  className="text-[#788296] hover:text-[#FFFFFF]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">Sign in House:</span>
                  <span className="text-[#F0E6D2] font-medium">{selectedBhava.sign}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">House Lord:</span>
                  <span className="text-[#F0E6D2] font-medium">{selectedBhava.lord}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">Sanskrit Name:</span>
                  <span className="text-[#F0E6D2] font-medium">{selectedBhava.sanskritName}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#E2E6EE] mb-1">Significance & Life Area:</h4>
                <p className="text-xs text-[#8E97AB] leading-relaxed bg-[#0A0D15] p-3 rounded border border-[#1A2130]">
                  {selectedBhava.significance}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#E2E6EE] mb-2">Occupying Planets ({selectedBhava.occupants.length}):</h4>
                {selectedBhava.occupants.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBhava.occupants.map((g, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedGraha(g)}
                        className="bg-[#141A28] border border-[#242E42] p-2.5 rounded flex items-center justify-between cursor-pointer hover:border-[#B89647] transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#F0E6D2]">{g.name}</div>
                          <div className="text-[10px] text-[#788296]">
                            {g.formattedDegree} in {g.nakshatra} (Pada {g.pada})
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getDignityColor(g.dignity)}`}>
                          {g.dignity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#717A8C] italic">
                    No planets occupy this house. Its affairs are steered primarily by its lord ({selectedBhava.lord}) and aspecting grahas.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Compass className="h-8 w-8 text-[#B89647] mx-auto opacity-70" />
              <h3 className="font-cinzel text-sm font-semibold text-[#E7EBF5]">
                Inspect Any Bhava or Graha
              </h3>
              <p className="text-xs text-[#7B8599] max-w-xs mx-auto leading-relaxed">
                Click any of the 12 Bhavas on the Kundli diagram to unveil the sign ruler, active occupants, and classic Parashari significance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Planetary Ephemeris Table */}
      <div className="bg-[#0C1019] border border-[#1E2536] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E2536] bg-[#0A0D15] flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
              Vedic Planetary Positions (Graha Sphuta)
            </h3>
            <span className="text-[11px] text-[#7C8599]">
              Sidereal coordinates based on Lahiri Ayanamsha
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101522] border-b border-[#1E2536] text-[#7C8599] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Graha</th>
                <th className="px-4 py-3">Sign (Rashi)</th>
                <th className="px-4 py-3">Degree</th>
                <th className="px-4 py-3">House (Bhava)</th>
                <th className="px-4 py-3">Nakshatra & Pada</th>
                <th className="px-4 py-3">Dignity</th>
                <th className="px-4 py-3">Signification (Karaka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030] text-[#D0D7E5]">
              {/* Ascendant Row */}
              <tr className="bg-[#141A28]/40 font-medium">
                <td className="px-4 py-3 text-[#E5BD68] font-bold">Lagna (Ascendant)</td>
                <td className="px-4 py-3">{chart.ascendant.sign}</td>
                <td className="px-4 py-3 font-mono">{chart.ascendant.formattedDegree}</td>
                <td className="px-4 py-3">1st Bhava</td>
                <td className="px-4 py-3">{chart.ascendant.nakshatra} (P{chart.ascendant.pada})</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3 text-[#8A95AA]">Self, Body, General Destiny</td>
              </tr>
              {chart.grahas.map((g, idx) => (
                <tr key={idx} className="hover:bg-[#131926] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#F0E6D2]">
                    <span className="mr-1.5 text-base">{g.symbol}</span>
                    {viewMode === 'advanced' ? g.name : g.englishName}
                  </td>
                  <td className="px-4 py-3">{g.sign}</td>
                  <td className="px-4 py-3 font-mono">{g.formattedDegree}</td>
                  <td className="px-4 py-3">House {g.house}</td>
                  <td className="px-4 py-3">{g.nakshatra} (Pada {g.pada})</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getDignityColor(g.dignity)}`}>
                      {g.dignity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#8A95AA] max-w-xs truncate">
                    {g.karakaRole}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
