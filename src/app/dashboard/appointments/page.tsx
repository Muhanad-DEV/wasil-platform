'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
} from 'lucide-react';

export default function AppointmentsPage() {
  const { lang, t, formatDate } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In our seed, leads have appointments or we can display appointments
    setAppointments([
      {
        id: 'apt-1',
        customerName: 'Nasser Al Hosni (ناصر الحوسني)',
        customerPhone: '+96897123999',
        customerEmail: 'nasser@hosni-trading.om',
        serviceName: 'Al Mouj Sales Pavilion Site Tour & Viewing',
        requestedTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'CONFIRMED',
        notes: 'Requested private tour of Marsa 2BR boulevard residences.',
      },
      {
        id: 'apt-2',
        customerName: 'Eng. Salem Al Rawahi (م. سالم الرواحي)',
        customerPhone: '+96892345678',
        customerEmail: 'salem.rawahi@pdo.co.om',
        serviceName: 'Golf Beach Townhouse Inspection',
        requestedTime: new Date(Date.now() + 86400000 * 5).toISOString(),
        status: 'PENDING',
        notes: 'Weekend morning preference (Saturday 11:00 AM).',
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-start max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'طلبات المواعيد والمعاينات الميدانية' : 'Appointment & Site Tour Requests'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'متابعة مواعيد المعاينة العقارية والاجتماعات الاستشارية المحجوزة عبر البطاقات الرقمية.'
              : 'Manage booked property tours and consultation meetings with direct customer contacts.'}
          </p>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="rounded-3xl border border-wasil-border bg-white p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-wasil-navy">{apt.customerName}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      apt.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-wasil-violet">{apt.serviceName}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-wasil-muted pt-1">
                  <div className="flex items-center gap-1 font-mono" dir="ltr">
                    <Phone className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>{apt.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-wasil-turquoise" />
                    <span>{new Date(apt.requestedTime).toLocaleString()}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-wasil-text/80 bg-wasil-bg p-2 rounded-xl mt-2 max-w-lg">
                    {apt.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {apt.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{lang === 'ar' ? 'تأكيد الموعد' : 'Confirm'}</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/${apt.customerPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-wasil-border bg-wasil-bg px-3.5 py-2 text-xs font-bold text-wasil-navy hover:bg-wasil-border"
                >
                  واتساب
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
