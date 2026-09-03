import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, FileText, ShieldCheck, AlertCircle, Eye, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from '../../components/common/Toast';

const StaffKYC = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchKYCList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/staff/kyc', { params });
      if (res.data.success) {
        setProfiles(res.data.profiles);
      }
    } catch (err) {
      console.error('Error fetching KYC queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCList();
  }, [statusFilter]);

  const handleReview = async (status) => {
    if (!selectedProfile) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/staff/kyc/${selectedProfile._id}/review`, {
        status,
        notes: reviewNotes || (status === 'approved' ? 'All UIDAI and NSDL documents verified.' : 'Discrepancy in identity records.')
      });
      if (res.data.success) {
        toast.success(`KYC status set to ${status.toUpperCase()}`);
        setSelectedProfile(null);
        setReviewNotes('');
        fetchKYCList();
      }
    } catch (err) {
      toast.error('Failed to submit KYC decision');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">KYC Verification Queue</h1>
          <p className="text-xs text-slate-500 mt-1">Review government identity proofs, PAN verification, and compliance status</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        {['all', 'pending', 'under_review', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`py-1.5 px-3 rounded-lg capitalize font-semibold transition-all ${
              statusFilter === f ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* KYC Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name / ID</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">PAN ID</th>
                <th className="py-3 px-4">Aadhaar</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading KYC queue...</td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No applications matching filter</td>
                </tr>
              ) : (
                profiles.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{p.userId?.name || 'Customer'}</p>
                      <span className="text-[10px] text-royal-700 font-mono font-bold">{p.customerId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <p>{p.userId?.email}</p>
                      <span className="text-[10px] text-slate-400">{p.userId?.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{p.panNumber || 'ABCDE1234F'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{p.aadhaarNumber || 'XXXX-XXXX-1234'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.kycStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.kycStatus === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {p.kycStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedProfile(p);
                          setReviewNotes(p.reviewerNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-royal-700 hover:bg-royal-700 hover:text-white transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dossier Review Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-navy-950">KYC Verification Dossier</h3>
                <p className="text-xs text-slate-500">{selectedProfile.userId?.name} ({selectedProfile.customerId})</p>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Checks */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-royal-700" />
                  <span className="font-semibold text-slate-800">Aadhaar Card (UIDAI XML Verified)</span>
                </div>
                <span className="font-mono text-slate-600 font-bold">{selectedProfile.aadhaarNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">PAN Card (NSDL Active Check)</span>
                </div>
                <span className="font-mono text-slate-600 font-bold">{selectedProfile.panNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-slate-800">Proof of Address (Utility Invoice)</span>
                </div>
                <span className="text-slate-700 font-medium">{selectedProfile.address?.city || 'Mumbai'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Staff Reviewer Notes</label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter observations or reasons for approval / rejection..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('rejected')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              >
                Reject KYC
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleReview('approved')}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffKYC;