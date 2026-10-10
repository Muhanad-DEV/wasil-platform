'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  Download,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MoreVertical,
  User,
  Tag,
  DollarSign,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react';

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  stage: string;
  priority: string;
  areaOfInterest?: string | null;
  budgetRange?: string | null;
  dealValueOMR?: number | null;
  preferredContact: string;
  source: string;
  notes?: string | null;
  lostReason?: string | null;
  followUpDate?: string | null;
  createdAt: string;
  card?: { title: string } | null;
  campaign?: { name: string } | null;
  assignedTo?: { id: string; name: string } | null;
  activities?: Array<{
    id: string;
    type: string;
    description: string;
    descriptionAr?: string | null;
    createdAt: string;
  }>;
}

interface LeadPipelineProps {
  initialLeads: LeadItem[];
  organizationId: string;
  onRefresh?: () => void;
}

const STAGES = [
  { id: 'NEW', labelAr: 'جديد', labelEn: 'New', color: 'bg-blue-500' },
  { id: 'CONTACTED', labelAr: 'تم التواصل', labelEn: 'Contacted', color: 'bg-indigo-500' },
  { id: 'QUALIFIED', labelAr: 'مؤهل', labelEn: 'Qualified', color: 'bg-cyan-500' },
  { id: 'APPOINTMENT_SCHEDULED', labelAr: 'موعد محدد', labelEn: 'Appointment Set', color: 'bg-amber-500' },
  { id: 'PROPOSAL_SENT', labelAr: 'عرض مرسل', labelEn: 'Proposal Sent', color: 'bg-violet-500' },
  { id: 'NEGOTIATION', labelAr: 'مفاوضات', labelEn: 'Negotiation', color: 'bg-purple-600' },
  { id: 'WON', labelAr: 'صفقة ناجحة', labelEn: 'Won', color: 'bg-emerald-600' },
  { id: 'LOST', labelAr: 'فرصة خاسرة', labelEn: 'Lost', color: 'bg-rose-500' },
];

export function LeadPipeline({ initialLeads, organizationId, onRefresh }: LeadPipelineProps) {
  const { lang, t, formatCurrency, isRtl } = useLanguage();
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.areaOfInterest && lead.areaOfInterest.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = stageFilter === 'ALL' || lead.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
      }

      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NOTE',
          description: newNote.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && selectedLead) {
        setSelectedLead({
          ...selectedLead,
          activities: [data.activity, ...(selectedLead.activities || [])],
        });
        setNewNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="rounded bg-rose-100 text-rose-800 px-1.5 py-0.5 text-[10px] font-bold">عاجل • Urgent</span>;
      case 'HIGH':
        return <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-bold">مرتفع • High</span>;
      case 'MEDIUM':
        return <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px] font-medium">متوسط • Medium</span>;
      default:
        return <span className="rounded bg-neutral-100 text-neutral-700 px-1.5 py-0.5 text-[10px]">عادي • Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-wasil-border shadow-subtle">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-2.5 ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-wasil-muted`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث بالاسم، الهاتف، أو المشروع...' : 'Search by name, phone, or interest...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border border-wasil-border bg-wasil-bg/40 py-2 ${
                isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
              } text-xs focus:outline-none focus:border-wasil-violet`}
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-xl border border-wasil-border bg-white px-3 py-2 text-xs font-medium text-wasil-navy focus:outline-none focus:border-wasil-violet"
          >
            <option value="ALL">{lang === 'ar' ? 'جميع المراحل' : 'All Stages'}</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === 'ar' ? s.labelAr : s.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch View Toggle */}
          <div className="flex items-center rounded-xl bg-wasil-bg p-1 border border-wasil-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-wasil-violet shadow-sm' : 'text-wasil-muted hover:text-wasil-navy'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'كانبان' : 'Kanban'}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-wasil-violet shadow-sm' : 'text-wasil-muted hover:text-wasil-navy'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'جدول' : 'Table'}</span>
            </button>
          </div>

          {/* Export CSV */}
          <a
            href={`/api/leads/export?orgId=${organizationId}`}
            download
            className="flex items-center gap-1.5 rounded-xl border border-wasil-border bg-white px-3 py-2 text-xs font-semibold text-wasil-navy hover:bg-wasil-bg shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-wasil-turquoise" />
            <span>{t('exportCsv')}</span>
          </a>
        </div>
      </div>

      {/* VIEW 1: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            const totalStageValue = stageLeads.reduce((acc, l) => acc + (l.dealValueOMR || 0), 0);

            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl bg-wasil-bg/60 border border-wasil-border/80 p-3 min-w-[240px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                    <span className="text-xs font-bold text-wasil-navy">
                      {lang === 'ar' ? stage.labelAr : stage.labelEn}
                    </span>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-wasil-muted border border-wasil-border">
                    {stageLeads.length}
                  </span>
                </div>

                {totalStageValue > 0 && (
                  <div className="text-[10px] font-mono text-wasil-turquoise font-semibold mb-2">
                    {formatCurrency(totalStageValue)}
                  </div>
                )}

                {/* Leads in column */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer rounded-xl bg-white p-3 border border-wasil-border shadow-subtle hover:border-wasil-violet/50 hover:shadow-card transition-all"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-xs font-bold text-wasil-navy line-clamp-1">{lead.name}</h4>
                        {getPriorityBadge(lead.priority)}
                      </div>

                      {lead.areaOfInterest && (
                        <p className="text-[11px] font-medium text-wasil-violet line-clamp-1 mb-1">
                          {lead.areaOfInterest}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-wasil-muted mt-2 pt-2 border-t border-wasil-border/50">
                        <span dir="ltr">{lead.phone}</span>
                        {lead.dealValueOMR ? (
                          <span className="font-mono font-bold text-emerald-700">
                            {formatCurrency(lead.dealValueOMR)}
                          </span>
                        ) : null}
                      </div>

                      {/* Quick stage mover dropdown */}
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value)}
                          className="w-full text-[10px] rounded-lg border border-wasil-border bg-wasil-bg/40 px-1.5 py-1 text-wasil-navy"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              → {lang === 'ar' ? s.labelAr : s.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-wasil-muted/60">
                      {lang === 'ar' ? 'لا توجد فرص' : 'No leads'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: FILTERABLE TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl bg-white border border-wasil-border shadow-subtle">
          <table className="w-full text-xs text-start">
            <thead className="bg-wasil-bg/80 border-b border-wasil-border text-wasil-navy font-bold">
              <tr>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'اسم العميل' : 'Lead Name'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المرحلة' : 'Stage'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الأولوية' : 'Priority'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المشروع / الاهتمام' : 'Area of Interest'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'قيمة الصفقة' : 'Deal Value'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المصدر' : 'Source'}</th>
                <th className="py-3 px-4 text-start">{lang === 'ar' ? 'المسؤول' : 'Assigned'}</th>
                <th className="py-3 px-4 text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wasil-border/60">
              {filteredLeads.map((lead) => {
                const stageObj = STAGES.find((s) => s.id === lead.stage);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-wasil-bg/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-wasil-navy">{lead.name}</td>
                    <td className="py-3 px-4 font-mono" dir="ltr">{lead.phone}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-wasil-bg border border-wasil-border">
                        <span className={`h-1.5 w-1.5 rounded-full ${stageObj?.color}`} />
                        <span>{lang === 'ar' ? stageObj?.labelAr : stageObj?.labelEn}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">{getPriorityBadge(lead.priority)}</td>
                    <td className="py-3 px-4 text-wasil-text/80">{lead.areaOfInterest || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {lead.dealValueOMR ? formatCurrency(lead.dealValueOMR) : '—'}
                    </td>
                    <td className="py-3 px-4 text-wasil-muted text-[11px]">{lead.source}</td>
                    <td className="py-3 px-4 text-wasil-text/80">{lead.assignedTo?.name || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="rounded-lg p-1 text-wasil-violet hover:bg-wasil-violet/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAD DETAILS DRAWER MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-wasil-border pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-wasil-navy">{selectedLead.name}</h3>
                  <span className="text-xs text-wasil-muted">
                    {lang === 'ar' ? 'تاريخ التسجيل:' : 'Captured:'} {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="rounded-full p-1.5 text-wasil-muted hover:bg-wasil-bg hover:text-wasil-navy"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stage Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-wasil-navy mb-1.5">
                  {lang === 'ar' ? 'مرحلة الصفقة في خط الأنابيب' : 'Pipeline Stage'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleStageChange(selectedLead.id, s.id)}
                      className={`rounded-lg py-1.5 px-2 text-[10px] font-bold transition-all ${
                        selectedLead.stage === s.id
                          ? 'bg-wasil-navy text-white shadow'
                          : 'bg-wasil-bg text-wasil-navy hover:bg-wasil-border'
                      }`}
                    >
                      {lang === 'ar' ? s.labelAr : s.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Direct Actions */}
              <div className="mb-5 grid grid-cols-3 gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-wasil-bg py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-navy hover:text-white transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{lang === 'ar' ? 'اتصال' : 'Call'}</span>
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/10 py-2 text-xs font-bold text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>واتساب</span>
                </a>
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-wasil-bg py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-violet hover:text-white transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'بريد' : 'Email'}</span>
                  </a>
                )}
              </div>

              {/* Lead Information Card */}
              <div className="space-y-3 rounded-xl bg-wasil-bg/60 p-4 border border-wasil-border text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-wasil-muted">{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                  <span className="font-mono font-bold" dir="ltr">{selectedLead.phone}</span>
                </div>
                {selectedLead.email && (
                  <div className="flex justify-between">
                    <span className="text-wasil-muted">{lang === 'ar' ? 'البريد:' : 'Email:'}</span>
                    <span className="font-semibold">{selectedLead.email}</span>
                  </div>
                )}
                {selectedLead.areaOfInterest && (
                  <div className="flex justify-between">
                    <span className="text-wasil-muted">{lang === 'ar' ? 'الاهتمام / العقار:' : 'Interest:'}</span>
                    <span className="font-bold text-wasil-violet">{selectedLead.areaOfInterest}</span>
                  </div>
                )}
                {selectedLead.budgetRange && (
                  <div className="flex justify-between">
                    <span className="text-wasil-muted">{lang === 'ar' ? 'الميزانية المتوقعة:' : 'Budget:'}</span>
                    <span>{selectedLead.budgetRange}</span>
                  </div>
                )}
                {selectedLead.dealValueOMR && (
                  <div className="flex justify-between">
                    <span className="text-wasil-muted">{lang === 'ar' ? 'قيمة الصفقة المحققة:' : 'Deal Value:'}</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatCurrency(selectedLead.dealValueOMR)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-wasil-muted">{lang === 'ar' ? 'المصدر:' : 'Source:'}</span>
                  <span className="font-medium">{selectedLead.source}</span>
                </div>
              </div>

              {/* Notes & Activity Timeline */}
              <div>
                <h4 className="text-xs font-bold text-wasil-navy mb-2">
                  {lang === 'ar' ? 'سجل الأنشطة والملاحظات' : 'Activity & Follow-up Timeline'}
                </h4>

                {/* Add Note Form */}
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={lang === 'ar' ? 'أضف ملاحظة متابعة جديدة...' : 'Log a follow-up note...'}
                    className="flex-1 rounded-xl border border-wasil-border px-3 py-2 text-xs focus:outline-none focus:border-wasil-violet"
                  />
                  <button
                    onClick={() => handleAddNote(selectedLead.id)}
                    disabled={isSubmittingNote || !newNote.trim()}
                    className="rounded-xl bg-wasil-violet px-3 py-2 text-xs font-bold text-white hover:bg-wasil-violet/90 disabled:opacity-50"
                  >
                    {lang === 'ar' ? 'إضافة' : 'Add'}
                  </button>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-2">
                  {selectedLead.activities?.map((act) => (
                    <div key={act.id} className="rounded-xl border border-wasil-border p-3 text-xs bg-white">
                      <div className="flex items-center justify-between text-[10px] text-wasil-muted mb-1">
                        <span className="font-semibold text-wasil-violet">{act.type}</span>
                        <span>{new Date(act.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-wasil-text">
                        {lang === 'ar' && act.descriptionAr ? act.descriptionAr : act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-wasil-border mt-6">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full rounded-xl bg-wasil-navy py-2.5 text-xs font-bold text-white hover:bg-wasil-navy/90"
              >
                {lang === 'ar' ? 'إغلاق النافذة' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
