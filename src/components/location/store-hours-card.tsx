'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isStoreOpenNow, getOpeningHours, getStoreInfo } from '@/lib/data/store';
import { type OpeningHourItem, type StoreContactMatrix } from '@/lib/validations/store';
import { cn } from '@/lib/utils';

export interface StoreHoursCardProps {
  className?: string;
  compact?: boolean;
}

export function StoreHoursCard({ className, compact = false }: StoreHoursCardProps) {
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    message: string;
  } | null>(null);

  const [currentKathmanduDay, setCurrentKathmanduDay] = useState<string>('');
  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
  const [contacts, setContacts] = useState<StoreContactMatrix | null>(null);

  useEffect(() => {
    // Load store metadata and opening hours via accessor layer
    getOpeningHours().then(setOpeningHours);
    getStoreInfo().then((info) => setContacts(info.contacts));

    const updateStatusAndDay = () => {
      const day = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kathmandu',
        weekday: 'long',
      })
        .format(new Date())
        .toLowerCase();

      setCurrentKathmanduDay(day);
      isStoreOpenNow().then(setStoreStatus);
    };

    updateStatusAndDay();
    const interval = setInterval(updateStatusAndDay, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4', className)}>
      {/* Header & Live Open Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">
            Store Operating Hours
          </h3>
        </div>

        {storeStatus && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all shadow-sm',
              storeStatus.isOpen
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full animate-pulse',
                storeStatus.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
              )}
            />
            <span>{storeStatus.message}</span>
          </div>
        )}
      </div>

      {/* Days Schedule Table */}
      <div className="space-y-2 text-sm">
        {openingHours.map((item) => {
          const isToday = item.day === currentKathmanduDay;
          const isSaturday = item.day === 'saturday';

          return (
            <div
              key={item.day}
              className={cn(
                'flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors',
                isToday
                  ? 'bg-primary/10 border border-primary/30 font-semibold text-foreground shadow-sm'
                  : 'hover:bg-muted/50 text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn('font-medium capitalize', isToday && 'text-primary font-bold')}>
                  {item.label}
                </span>
                {isToday && (
                  <Badge variant="authentic" className="text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider">
                    Today
                  </Badge>
                )}
              </div>

              <div className="text-right">
                {isSaturday ? (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Contact Store
                  </span>
                ) : item.isClosed ? (
                  <span className="text-xs font-medium text-destructive">Closed</span>
                ) : (
                  <span className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                    {item.opens} – {item.closes}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Saturday Notice Pill */}
      {!compact && contacts && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Saturday Hours:</strong> Store hours on Saturdays may vary. Please call our Golfutar hotline at{' '}
            <a
              href={`tel:${contacts.primaryPhone}`}
              className="inline-flex min-h-[48px] items-center font-bold underline hover:text-amber-900 dark:hover:text-amber-100 px-1"
            >
              {contacts.primaryPhone}
            </a>{' '}
            or message us on WhatsApp before visiting.
          </p>
        </div>
      )}
    </div>
  );
}
