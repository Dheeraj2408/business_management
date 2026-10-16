import React, { useState } from 'react';
import {
  Users,
  Boxes,
  Zap,
  Cog,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  DollarSign,
  TrendingUp,
  Cpu,
  Factory,
  Wrench,
  X
} from 'lucide-react';
import { Employee, RawMaterial, ElectricityData, Machine } from '../../types';

interface IndustrialOperationsProps {
  employees: Employee[];
  rawMaterials: RawMaterial[];
  electricity: ElectricityData | null;
  machines: Machine[];
  onAddEmployee: (emp: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onAddRawMaterial: (mat: Partial<RawMaterial>) => void;
  onToggleMachine: (id: string) => void;
  onUpdateElectricity: (updates: Partial<ElectricityData>) => void;
}

export const IndustrialOperations: React.FC<IndustrialOperationsProps> = ({
  employees,
  rawMaterials,
  electricity,
  machines,
  onAddEmployee,
  onDeleteEmployee,
  onAddRawMaterial,
  onToggleMachine,
  onUpdateElectricity
}) => {
  const [activeTab, setActiveTab] = useState<'workforce' | 'raw_materials' | 'electricity' | 'machinery'>('workforce');

  // Employee modal state
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Production Line Operator');
  const [empDept, setEmpDept] = useState<'Production' | 'Maintenance' | 'Quality Control' | 'Logistics' | 'Safety'>('Production');
  const [empSalary, setEmpSalary] = useState(48000);
  const [empContact, setEmpContact] = useState('+91 98');
  const [empShift, setEmpShift] = useState<'Day Shift (A)' | 'Evening Shift (B)' | 'Night Shift (C)'>('Day Shift (A)');

  // Raw Material modal state
  const [showMatModal, setShowMatModal] = useState(false);
  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState(25);
  const [matUnit, setMatUnit] = useState<'Tons' | 'Bags' | 'Barrels' | 'Liters' | 'Kg'>('Tons');
  const [matCost, setMatCost] = useState(38000);
  const [matSupplier, setMatSupplier] = useState('');
  const [matGrade, setMatGrade] = useState<'A+ (100% Recycled)' | 'A (FSC Certified)' | 'B (Standard)' | 'Bio-Based'>('A+ (100% Recycled)');

  // Calculations
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const totalRawMaterialValuation = rawMaterials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
  const runningMachinesCount = machines.filter(m => m.status === 'Running').length;
  const maintenanceCount = machines.filter(m => m.status === 'Maintenance').length;

  // Handle Add Employee
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;

    onAddEmployee({
      name: empName,
      role: empRole,
      department: empDept,
      salary: Number(empSalary),
      contact: empContact,
      shift: empShift,
      status: 'Active'
    });

    setEmpName('');
    setShowEmpModal(false);
  };

  // Handle Add Raw Material
  const handleSaveRawMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName) return;

    onAddRawMaterial({
      name: matName,
      quantity: Number(matQty),
      unit: matUnit,
      costPerUnit: Number(matCost),
      supplier: matSupplier || 'Industrial Direct Vendor',
      sustainabilityGrade: matGrade,
      reorderThreshold: 10
    });

    setMatName('');
    setShowMatModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      
      {/* Header & Sub-Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-purple-400" />
            <h3 className="font-extrabold text-base text-white">Manufacturing Operations & Factory ERP</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Heavy Industry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time shop floor workforce, raw material inventory costing, electricity tariffs & production machinery
          </p>
        </div>

        {/* 4 Sector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workforce')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'workforce'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Employees ({employees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('raw_materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'raw_materials'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Raw Materials ({rawMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('electricity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'electricity'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Electricity & Power</span>
          </button>

          <button
            onClick={() => setActiveTab('machinery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'machinery'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cog className="w-3.5 h-3.5 text-sky-400" />
            <span>Machinery ({machines.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: WORKFORCE & PAYROLL
         ======================================================== */}
      {activeTab === 'workforce' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Factory Staff</div>
              <div className="text-xl font-extrabold text-white mt-1">{employees.length} Employees</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{employees.filter(e => e.status === 'Active').length} Active on Shift</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Monthly Payroll Outflow</div>
              <div className="text-xl font-extrabold text-purple-400 mt-1">₹{totalPayroll.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-400">Avg ₹{Math.round(totalPayroll / (employees.length || 1)).toLocaleString('en-IN')} / worker</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Staff Action</div>
                <div className="text-xs text-slate-400 mt-0.5">Enroll new factory worker</div>
              </div>
              <button
                onClick={() => setShowEmpModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Shift Assigned</th>
                  <th className="p-3">Salary (₹/mo)</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3">
                      <div className="font-semibold text-white">{emp.name}</div>
                      <div className="text-[10px] text-slate-400">{emp.role} • <span className="font-mono text-purple-400">{emp.id}</span></div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 flex items-center gap-1.5 mt-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{emp.shift}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ₹{emp.salary.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-slate-300 font-mono">
                      {emp.contact}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        title="Remove Employee"
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: RAW MATERIALS & INBOUND PROCUREMENT
         ======================================================== */}
      {activeTab === 'raw_materials' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Inbound Inventory Valuation</div>
              <div className="text-xl font-extrabold text-white mt-1">₹{(totalRawMaterialValuation / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[10px] text-emerald-400">Total raw inventory on factory floor</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Tracked Material Types</div>
              <div className="text-xl font-extrabold text-sky-400 mt-1">{rawMaterials.length} Industrial Commodities</div>
              <div className="text-[10px] text-slate-400">Bulk Pulp, Resins, Inks, Steel</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Procure Material</div>
                <div className="text-xs text-slate-400 mt-0.5">Record incoming supplier consignment</div>
              </div>
              <button
                onClick={() => setShowMatModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Material</span>
              </button>
            </div>
          </div>

          {/* Raw Materials Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Raw Material / Input</th>
                  <th className="p-3">Stock On Floor</th>
                  <th className="p-3">Cost per Unit</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Primary Supplier</th>
                  <th className="p-3">Eco Grade</th>
                  <th className="p-3 text-right">Inventory Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rawMaterials.map(mat => {
                  const isLow = mat.quantity <= mat.reorderThreshold;
                  const total = mat.quantity * mat.costPerUnit;

                  return (
                    <tr key={mat.id} className="hover:bg-slate-950/40 transition">
                      <td className="p-3 font-semibold text-white">
                        {mat.name}
                        <div className="text-[10px] text-slate-500 font-mono">{mat.id}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold text-white text-sm">{mat.quantity}</span>
                        <span className="text-[11px] text-slate-400 ml-1">{mat.unit}</span>
                      </td>
                      <td className="p-3 text-slate-300 font-mono">
                        ₹{mat.costPerUnit.toLocaleString('en-IN')} / {mat.unit}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        ₹{total.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-slate-300">{mat.supplier}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {mat.sustainabilityGrade}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            Reorder (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Optimal Buffer
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 3: ELECTRICITY & ENERGY COSTS
         ======================================================== */}
      {activeTab === 'electricity' && electricity && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Monthly Power Bill</div>
              <div className="text-xl font-extrabold text-amber-400 mt-1">₹{electricity.totalMonthlyCost.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-400">Tariff: ₹{electricity.tariffPerKWh}/kWh industrial rate</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Power Usage</div>
              <div className="text-xl font-extrabold text-white mt-1">{electricity.totalUnitsKWh.toLocaleString()} kWh</div>
              <div className="text-[10px] text-slate-400">Peak Load: {electricity.peakLoadKW} kW</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Solar Captive Generation</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">{electricity.solarGeneratedKWh.toLocaleString()} kWh</div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                {Math.round((electricity.solarGeneratedKWh / electricity.totalUnitsKWh) * 100)}% of factory needs
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Grid Purchased Power</div>
              <div className="text-xl font-extrabold text-slate-300 mt-1">{electricity.gridPurchasedKWh.toLocaleString()} kWh</div>
              <div className="text-[10px] text-slate-500">State Electricity Board discom</div>
            </div>
          </div>

          {/* Interactive Energy Mix & Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Weekly Energy Breakdown (Solar vs Grid)</span>
                <span className="text-[11px] text-emerald-400 font-mono">Active Power Log</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
                {electricity.dailyTrends.map((d, i) => {
                  const totalDay = d.solarKWh + d.gridKWh;
                  const solarPct = Math.round((d.solarKWh / totalDay) * 100);
                  const gridPct = 100 - solarPct;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full max-w-[28px] flex flex-col h-full justify-end rounded-t-lg overflow-hidden">
                        <div style={{ height: `${gridPct}%` }} className="bg-amber-500/80 w-full" title={`Grid: ${d.gridKWh} kWh`}></div>
                        <div style={{ height: `${solarPct}%` }} className="bg-emerald-500 w-full" title={`Solar: ${d.solarKWh} kWh`}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span className="text-slate-300">Rooftop Solar Captive (Free)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/80"></span>
                  <span className="text-slate-300">Grid Utility Power (Paid)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Simulate Renewable Shift</span>
                <p className="text-[11px] text-slate-400 mb-3">
                  Adjust daytime machine schedules to rooftop solar microgrid to reduce carbon and cut monthly power bills:
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Target Solar Share</span>
                      <span className="text-emerald-400 font-bold">{Math.round((electricity.solarGeneratedKWh / electricity.totalUnitsKWh) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={Math.round((electricity.solarGeneratedKWh / electricity.totalUnitsKWh) * 100)}
                      onChange={(e) => {
                        const pct = Number(e.target.value);
                        const solar = Math.round((electricity.totalUnitsKWh * pct) / 100);
                        const grid = electricity.totalUnitsKWh - solar;
                        const cost = Math.round(grid * electricity.tariffPerKWh);
                        onUpdateElectricity({
                          solarGeneratedKWh: solar,
                          gridPurchasedKWh: grid,
                          totalMonthlyCost: cost
                        });
                      }}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Simulated Grid Cost:</span>
                      <span className="text-white font-bold">₹{electricity.totalMonthlyCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Carbon Footprint Offset:</span>
                      <span className="font-bold">~{(electricity.solarGeneratedKWh * 0.00082).toFixed(1)} Tons CO2</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Feeds live into Industrial Sustainability Score (Renewable Energy %)</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: MACHINERY & PRODUCTION LINES
         ======================================================== */}
      {activeTab === 'machinery' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Operational Production Lines</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">{runningMachinesCount} / {machines.length} Active</div>
              <div className="text-[10px] text-slate-400">{maintenanceCount} in scheduled overhaul</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Factory Hourly Output</div>
              <div className="text-xl font-extrabold text-white mt-1">
                {machines.filter(m => m.status === 'Running').reduce((sum, m) => sum + m.outputRatePerHour, 0).toLocaleString()} Units/hr
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">Running at 94% overall efficiency</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Machine Connected Load</div>
              <div className="text-xl font-extrabold text-sky-400 mt-1">
                {machines.reduce((sum, m) => sum + m.powerRatingKW, 0)} kW
              </div>
              <div className="text-[10px] text-slate-400">VFD energy-efficient motors installed</div>
            </div>
          </div>

          {/* Machinery Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machines.map(mach => (
              <div key={mach.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span>{mach.name}</span>
                      </h4>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{mach.model} • {mach.id}</div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      mach.status === 'Running'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : mach.status === 'Maintenance'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {mach.status === 'Running' ? '● Running' : mach.status === 'Maintenance' ? '▲ Maintenance' : '○ Idle'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Power Rating</div>
                      <div className="font-bold text-white">{mach.powerRatingKW} kW</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Output Rate</div>
                      <div className="font-bold text-emerald-400">{mach.outputRatePerHour} {mach.unitProduced}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Efficiency</div>
                      <div className="font-bold text-purple-400">{mach.efficiencyPct}%</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>Last Serviced: <strong className="text-slate-300">{mach.lastServiced}</strong></div>
                    <div>Next Service Due: <strong className="text-amber-400">{mach.nextServiceDue}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">PLC Sensor Link Active</span>
                  <button
                    onClick={() => onToggleMachine(mach.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    <Wrench className="w-3.5 h-3.5 text-sky-400" />
                    <span>Toggle Service Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD EMPLOYEE
         ======================================================== */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowEmpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-extrabold text-white mb-1">Add Factory Staff Member</h4>
            <p className="text-xs text-slate-400 mb-4">Enroll plant operators, technicians, and safety personnel</p>

            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Verma"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Job Designation</label>
                  <input
                    type="text"
                    required
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>Production</option>
                    <option>Maintenance</option>
                    <option>Quality Control</option>
                    <option>Logistics</option>
                    <option>Safety</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Shift</label>
                  <select
                    value={empShift}
                    onChange={(e) => setEmpShift(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>Day Shift (A)</option>
                    <option>Evening Shift (B)</option>
                    <option>Night Shift (C)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Phone Contact</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98..."
                  value={empContact}
                  onChange={(e) => setEmpContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition mt-2"
              >
                Save Employee to Roster
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD RAW MATERIAL
         ======================================================== */}
      {showMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowMatModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-extrabold text-white mb-1">Record Raw Material Inbound</h4>
            <p className="text-xs text-slate-400 mb-4">Add pulp, resins, chemical coatings, or industrial fasteners</p>

            <form onSubmit={handleSaveRawMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Material Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unbleached Corrugated Fluting (140 GSM)"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={matQty}
                    onChange={(e) => setMatQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Unit of Measurement</label>
                  <select
                    value={matUnit}
                    onChange={(e) => setMatUnit(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>Tons</option>
                    <option>Bags</option>
                    <option>Barrels</option>
                    <option>Liters</option>
                    <option>Kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Cost per Unit (₹)</label>
                  <input
                    type="number"
                    required
                    value={matCost}
                    onChange={(e) => setMatCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Sustainability Grade</label>
                  <select
                    value={matGrade}
                    onChange={(e) => setMatGrade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>A+ (100% Recycled)</option>
                    <option>A (FSC Certified)</option>
                    <option>Bio-Based</option>
                    <option>B (Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. National Paper Mills"
                  value={matSupplier}
                  onChange={(e) => setMatSupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition mt-2"
              >
                Log Material Inbound Consignment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
