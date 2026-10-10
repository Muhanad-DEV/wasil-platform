'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CardBuilder } from '@/components/card/CardBuilder';
import { RefreshCw } from 'lucide-react';

export default function EditCardPage({ params }: { params: { id: string } }) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [card, setCard] = useState<any>(null);
  const [orgId, setOrgId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cards/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.card) {
          setCard(data.card);
          setOrgId(data.card.organizationId);
        }
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-wasil-navy">
            {lang === 'ar' ? 'تعديل بطاقة الأعمال الرقمية' : 'Edit Digital Business Card'}
          </h1>
          <p className="text-xs text-wasil-muted mt-1">
            {lang === 'ar'
              ? 'أي تعديل تحفظه ينعكس فورياً على نفس الرابط العام دون الحاجة لتغيير رمز QR.'
              : 'Edits take effect live on the public URL without changing the physical QR code.'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-wasil-violet" />
          </div>
        ) : card ? (
          <CardBuilder
            initialCard={card}
            organizationId={orgId}
            onSaved={() => {
              router.push('/dashboard/cards');
            }}
          />
        ) : (
          <div className="text-center py-12 text-sm text-wasil-muted">
            {lang === 'ar' ? 'البطاقة غير موجودة' : 'Card not found'}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
