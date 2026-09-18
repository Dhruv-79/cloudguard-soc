import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Activity, RefreshCw, AlertTriangle, CheckCircle2, Server, Lock, Zap, Search, Filter, Download, Terminal, Eye, Sliders, ChevronRight } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [resources, setResources] = useState([]);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, threats, audit

  const fetchData = async () => {
    try {
      const resStatus = await fetch('/api/status').then(res => res.json());
      const resResources = await fetch('/api/resources').then(res => res.json());
      const resThreats = await fetch('/api/threats').then(res => res.json());
      setStatus(resStatus);
      setResources(resResources);
      setThreats(resThreats);
    } catch (err) {
      console.error("Failed to fetch cloud security data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/scan', { method: 'POST' }).then(res => res.json());
      setMessage(res.message);
      await fetchData();
    } catch (err) {
      setMessage('Compliance scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemediate = async (id) => {
    try {
      const res = await fetch('/api/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: id })
      }).then(res => res.json());
      setMessage(res.message);
      await fetchData();
    } catch (err) {
      setMessage('Remediation failed');
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || res.type.toLowerCase().includes(searchTerm.toLowerCase()) || res.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || res.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">CloudGuard SOC</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">Enterprise v2.4</span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Cloud Security Posture & Intelligent Threat Detection</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {message && (
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg animate-pulse flex items-center space-x-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>{message}</span>
            </span>
          )}
          <button 
            onClick={handleScan}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-600/25 disabled:opacity-50 transform active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Compliance Scan</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-2 flex items-center space-x-6 text-sm font-medium">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`pb-2 border-b-2 transition ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Security Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('resources')} 
          className={`pb-2 border-b-2 transition ${activeTab === 'resources' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Cloud Resources ({resources.length})
        </button>
        <button 
          onClick={() => setActiveTab('threats')} 
          className={`pb-2 border-b-2 transition ${activeTab === 'threats' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Threat Feed ({threats.length})
        </button>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Metrics Grid */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-lg transition group">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Posture Score</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <h3 className={`text-4xl font-extrabold ${status.security_score > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {status.security_score}%
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">CIS Benchmarked</span>
                </div>
              </div>
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-inner">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-lg transition group">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monitored Resources</p>
                <h3 className="text-4xl font-extrabold mt-2 text-white">{status.total_resources}</h3>
              </div>
              <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-inner">
                <Server className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-lg transition group">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Misconfigurations</p>
                <h3 className="text-4xl font-extrabold mt-2 text-amber-400">{status.misconfigured_resources}</h3>
              </div>
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-lg transition group">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Threats</p>
                <h3 className="text-4xl font-extrabold mt-2 text-rose-400">{status.critical_threats}</h3>
              </div>
              <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shadow-inner">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              type="text"
              placeholder="Search resources, regions, issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
              {['All', 'Critical', 'High', 'Low'].map(risk => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${riskFilter === risk ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cloud Resources & Misconfigurations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-2.5 text-white">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Cloud Posture & Compliance</span>
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">CIS AWS Benchmark v1.4</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredResources.map(res => (
                <div key={res.id} className="bg-slate-950/70 border border-slate-800/90 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition shadow-sm group">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-slate-100 group-hover:text-indigo-300 transition">{res.name}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${res.risk === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : res.risk === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {res.risk} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-300">{res.type}</span>
                      <span>•</span>
                      <span>{res.region}</span>
                      <span>•</span>
                      <span className="text-amber-300">{res.issue}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedResource(res)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                      title="Inspect Resource"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {res.status === 'Misconfigured' ? (
                      <button 
                        onClick={() => handleRemediate(res.id)}
                        className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/10"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Remediate</span>
                      </button>
                    ) : (
                      <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Secure</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intelligent Threat Detection Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-2.5 text-white">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span>Intelligent Threat Detection</span>
              </h3>
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Live Feed Active</span>
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {threats.map(threat => (
                <div key={threat.id} className="bg-slate-950/70 border border-slate-800/90 p-4 rounded-xl space-y-2.5 hover:border-slate-700 transition shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${threat.severity === 'Critical' ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-amber-500'}`}></span>
                      <span>{threat.title}</span>
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${threat.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{threat.details}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900/80">
                    <span className="font-medium text-slate-400">Source: {threat.source}</span>
                    <span className="font-mono">{new Date(threat.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Resource Inspection Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-400" />
                <span>Resource Inspection: {selectedResource.name}</span>
              </h3>
              <button 
                onClick={() => setSelectedResource(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 block">Resource ID</span>
                  <span className="font-mono font-medium text-slate-200">{selectedResource.id}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Cloud Type</span>
                  <span className="font-medium text-slate-200">{selectedResource.type}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Region</span>
                  <span className="font-medium text-slate-200">{selectedResource.region}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Risk Level</span>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedResource.risk === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {selectedResource.risk}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Compliance Issue</span>
                <p className="text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs">{selectedResource.issue}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Recommended Remediation Policy</span>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                  aws ec2 modify-instance-attribute --resource-id {selectedResource.id} --sec-group-enforcement enabled
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setSelectedResource(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
              {selectedResource.status === 'Misconfigured' && (
                <button 
                  onClick={() => { handleRemediate(selectedResource.id); setSelectedResource(null); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Auto-Remediation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-4 px-6 text-center text-xs text-slate-500">
        CloudGuard SOC Enterprise • Munder Difflin Workforce (UI/UX Enhanced by Penny Agent)
      </footer>
    </div>
  );
}
