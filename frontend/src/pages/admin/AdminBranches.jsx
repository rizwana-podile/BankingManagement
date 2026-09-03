import React, { useState, useEffect } from 'react';
import { Building, Plus, MapPin, Phone, Mail, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [managerName, setManagerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/admin/branches');
      if (res.data.success) setBranches(res.data.branches);
    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/branches', {
        branchName,
        branchCode,
        ifscCode,
        managerName,
        address,
        city,
        state,
        phone,
        email
      });
      if (res.data.success) {
        toast.success('Branch added to network!');
        setShowAddModal(false);
        fetchBranches();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, bName) => {
    if (!window.confirm(`Decommission branch ${bName}?`)) return;
    try {
      await api.delete(`/admin/branches/${id}`);
      toast.success('Branch deleted');
      fetchBranches();
    } catch (err) {
      toast.error('Failed to delete branch');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Branch Network Architecture</h1>
          <p className="text-xs text-slate-500 mt-1">IFSC registry, geographic presence, branch managers, and operational nodes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b._id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-royal-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{b.branchName}</h3>
                  <span className="text-[10px] font-mono text-royal-700 font-bold">{b.ifscCode}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(b._id, b.branchName)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{b.address}, {b.city}, {b.state}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{b.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{b.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Branch Manager:</span>
              <span className="font-bold text-navy-950">{b.managerName || 'Assigned Officer'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-navy-950">Add Banking Branch</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                    placeholder="e.g. Hyderabad Hitech City"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase focus:bg-white"
                    placeholder="AURA0001004"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white"
                    placeholder="AURA04"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Branch Manager</label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                    placeholder="e.g. Anjali Gupta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  placeholder="Plot 18, Cyber Towers Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Official Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-navy-900 hover:bg-royal-800 text-white shadow-xs"
                >
                  {submitting ? 'Registering...' : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBranches;