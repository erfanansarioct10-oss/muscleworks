'use client';

import { MapPin, Navigation, ExternalLink, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import rawStoreData from '@/data/store-info.json';

export interface StoreMapEmbedProps {
  className?: string;
  showOverlay?: boolean;
}

export function StoreMapEmbed({ className, showOverlay = true }: StoreMapEmbedProps) {
  const { address, coordinates } = rawStoreData;

  return (
    <div
      className={cn(
        'relative min-h-[360px] sm:min-h-[440px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl',
        className
      )}
    >
      {/* Google Maps Responsive Iframe */}
      <iframe
        title="MuscleWorks Supplements Golfutar Store Location Map"
        src={coordinates.googleMapsEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '360px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full grayscale-[15%] contrast-[105%] dark:grayscale-[50%] dark:invert-[90%]"
      />

      {/* Floating Info Overlay Card */}
      {showOverlay && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground truncate">
                Golfutar Retail Outlet
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {address.streetAddress}, {address.area}, {address.municipality}, {address.city}
              </p>
              <p className="text-[11px] font-medium text-primary mt-0.5">
                📍 {address.landmark}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/60">
            <Car className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Dedicated Customer Parking Available</span>
          </div>

          {/* Open in Google Maps CTA Button (≥48px height) */}
          <a
            href={coordinates.googleMapsPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Navigation className="h-4 w-4" />
            <span>Get Directions in Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70 ml-auto" />
          </a>
        </div>
      )}
    </div>
  );
}
