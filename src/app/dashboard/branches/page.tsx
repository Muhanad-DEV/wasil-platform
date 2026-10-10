'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building2, Plus, MapPin, Phone, Mail, RefreshCw, Check } from 'lucide-react';

export default function BranchesPage() {
  const { lang, t } = useLanguage();
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Branch Modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [city, setCity] = useState('Muscat');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBranches = () => {
    setIsLoading(true);
    fetch('/api/organization/branches')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.branches) setBranches(d.branches);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/organization/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nameAr: nameAr || null,
          city,
          address,
          phone,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setName('');
        setNameAr('');
        fetchBranches();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'الفروع ومواقع العمل في عُمان' : 'Branches & Locations'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'إدارة مراكز المبيعات، الفروع، وتخصيص بطاقات العمل لكل موقع جغرافي.'
                : 'Manage sales pavilions and branch locations across Muscat, Salalah, and Sohar.'}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'إضافة فرع جديد' : 'Add Branch'}</span>
          </button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle hover:border-wasil-violet/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-wasil-bg px-2.5 py-0.5 text-[10px] font-bold text-wasil-navy border border-wasil-border">
                  {b.city}
                </span>
                {b.isMainBranch && (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    {lang === 'ar' ? 'الفرع الرئيسي' : 'Main Branch'}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-wasil-navy mb-2">
                {lang === 'ar' && b.nameAr ? b.nameAr : b.name}
              </h3>

              <div className="space-y-1.5 text-xs text-wasil-muted mb-4">
                {b.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                    <span>{b.address}</span>
                  </div>
                )}
                {b.phone && (
                  <div className="flex items-center gap-2 font-mono" dir="ltr">
                    <Phone className="h-3.5 w-3.5 text-wasil-turquoise shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
              <h3 className="text-base font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'إضافة فرع جديد' : 'Add New Branch'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4">
                {lang === 'ar' ? 'حدد اسم الفرع والمحافظة لتخصيص البطاقات.' : 'Set branch title and city.'}
              </p>

              <form onSubmit={handleCreateBranch} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم الفرع (بالإنجليزية) *' : 'Branch Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Salalah Sales Pavilion"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'اسم الفرع (بالعربية)' : 'Branch Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مركز مبيعات صلالة"
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'المدينة' : 'City'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  >
                    <option value="Muscat">مسقط (Muscat)</option>
                    <option value="Salalah">صلالة (Salalah)</option>
                    <option value="Sohar">صحار (Sohar)</option>
                    <option value="Nizwa">نزوى (Nizwa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'العنوان التفصيلي' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : lang === 'ar' ? 'حفظ الفرع' : 'Save Branch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
