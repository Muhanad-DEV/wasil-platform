'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Plus, Mail, Shield, RefreshCw, UserCheck, Check } from 'lucide-react';

export default function TeamManagementPage() {
  const { lang, t } = useLanguage();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('SALES_REP');
  const [inviteTitle, setInviteTitle] = useState('Property Consultant');
  const [isInviting, setIsInviting] = useState(false);

  const fetchTeam = () => {
    setIsLoading(true);
    fetch('/api/organization/team')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.members) setMembers(d.members);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setIsInviting(true);
    try {
      const res = await fetch('/api/organization/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          title: inviteTitle,
        }),
      });

      if (res.ok) {
        setShowInviteModal(false);
        setInviteName('');
        setInviteEmail('');
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-wasil-navy">
              {lang === 'ar' ? 'فريق العمل والصلاحيات (RBAC)' : 'Team Members & Permissions'}
            </h1>
            <p className="text-xs text-wasil-muted mt-1">
              {lang === 'ar'
                ? 'إدارة صلاحيات الموظفين، تعيين بطاقات العمل، والتحكم في الوصول للبيانات.'
                : 'Role-based access control (Owner, Admin, Sales Rep) and card assignment.'}
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-wasil-violet px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-wasil-violet/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'دعوة عضو جديد' : 'Invite Member'}</span>
          </button>
        </div>

        {/* Members Table */}
        <div className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-wasil-bg/60 text-wasil-navy font-bold">
                <tr>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'العضو' : 'Member'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المسمى الوظيفي' : 'Title'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الصلاحية' : 'Role'}</th>
                  <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wasil-border/60">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-wasil-bg/40">
                    <td className="py-3 px-4 font-bold text-wasil-navy">{m.user?.name}</td>
                    <td className="py-3 px-4 font-mono text-wasil-muted" dir="ltr">{m.user?.email}</td>
                    <td className="py-3 px-4 text-wasil-text">{m.title || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-wasil-violet/10 text-wasil-violet px-2.5 py-0.5 text-[10px] font-bold">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-wasil-border text-start">
              <h3 className="text-base font-bold text-wasil-navy mb-1">
                {lang === 'ar' ? 'دعوة عضو جديد لفريق العمل' : 'Invite New Team Member'}
              </h3>
              <p className="text-xs text-wasil-muted mb-4">
                {lang === 'ar'
                  ? 'سيتم تزويد العضو بحساب وصول للوحة التحكم وفق الصلاحية المحددة.'
                  : 'The member will receive access credentials based on their assigned role.'}
              </p>

              <form onSubmit={handleInvite} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                  </label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wasil-navy mb-1">
                    {lang === 'ar' ? 'الصلاحية (Role)' : 'Role'}
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-xl border border-wasil-border px-3 py-2 text-xs"
                  >
                    <option value="SALES_REP">{lang === 'ar' ? 'مندوب مبيعات (Sales Rep)' : 'Sales Rep'}</option>
                    <option value="ADMIN">{lang === 'ar' ? 'مشرف منظمة (Org Admin)' : 'Org Admin'}</option>
                    <option value="MEMBER">{lang === 'ar' ? 'عضو عادي (Member)' : 'Member'}</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 rounded-xl border border-wasil-border py-2 text-xs font-bold text-wasil-muted hover:bg-wasil-bg"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="flex-1 rounded-xl bg-wasil-violet py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {isInviting ? '...' : lang === 'ar' ? 'إرسال الدعوة' : 'Send Invite'}
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
