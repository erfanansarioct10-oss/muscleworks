'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
  Package,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

import {
  InquiryFormClientSchema,
  type InquiryFormClientValues,
  type InquiryProductContext,
  type InquiryType,
  type PreferredContactMethod,
} from '@/lib/validations/inquiry';
import { submitInquiryAction } from '@/actions/inquiry';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { formatNprPrice, cn } from '@/lib/utils';
import { trackLeadSubmission } from '@/lib/analytics';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface InquiryFormProps {
  productContext?: InquiryProductContext;
  defaultInquiryType?: InquiryType;
  onSuccess?: (inquiryId: string) => void;
  className?: string;
}

const CITY_OPTIONS = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Butwal',
  'Biratnagar',
  'Chitwan',
  'Other',
];

export function InquiryForm({
  productContext,
  defaultInquiryType,
  onSuccess,
  className,
}: InquiryFormProps) {
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    inquiryId: string;
    fullName: string;
    phoneNumber: string;
    deliveryCity?: string;
    inquiryType: InquiryType;
  } | null>(null);

  const [customCity, setCustomCity] = useState('');
  const isSubmittingLockRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormClientValues>({
    resolver: zodResolver(InquiryFormClientSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      inquiryType: defaultInquiryType || (productContext ? 'product_inquiry' : 'general'),
      message: productContext
        ? `Hi, I am interested in ${productContext.productName}${productContext.variantLabel ? ` (${productContext.variantLabel})` : ''}. Please confirm availability and delivery to Kathmandu.`
        : '',
      preferredContactMethod: 'whatsapp',
      deliveryCity: 'Kathmandu',
      productContext: productContext || undefined,
      hp_field: '',
      _form_loaded_at: 0,
    },
  });

  // Ensure timing trap timestamp is set on mount
  useEffect(() => {
    setValue('_form_loaded_at', Date.now());
  }, [setValue]);

  const selectedInquiryType = useWatch({ control, name: 'inquiryType' });
  const selectedContactMethod = useWatch({ control, name: 'preferredContactMethod' });
  const selectedDeliveryCity = useWatch({ control, name: 'deliveryCity' });

  const onSubmit = async (values: InquiryFormClientValues) => {
    if (isSubmittingLockRef.current) return;
    isSubmittingLockRef.current = true;
    try {
      // If user selected 'Other' for city, require a non-empty custom city
      if (values.deliveryCity === 'Other' && !customCity.trim()) {
        toast.error('Please specify your city or district.');
        return;
      }

      // Combine with custom text input if 'Other' selected
      const finalPayload: InquiryFormClientValues = {
        ...values,
        deliveryCity:
          values.deliveryCity === 'Other' && customCity.trim()
            ? customCity.trim()
            : values.deliveryCity,
      };

      const result = await submitInquiryAction(finalPayload);

      if (result.success && result.data?.inquiryId) {
        const inquiryId = result.data.inquiryId;
        trackLeadSubmission({
          formName: 'InquiryForm',
          city: finalPayload.deliveryCity,
          inquiryType: values.inquiryType,
        });
        toast.success(result.message || 'Inquiry submitted successfully!');
        
        setSubmittedReceipt({
          inquiryId,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          deliveryCity: finalPayload.deliveryCity,
          inquiryType: values.inquiryType,
        });

        if (onSuccess) {
          onSuccess(inquiryId);
        }
      } else if (!result.success) {
        toast.error(result.error || 'Submission failed. Please check fields and try again.');
      }
    } catch (err) {
      console.error('[InquiryForm Submit Error]:', err);
      toast.error('An unexpected client error occurred. Please try again or contact us via WhatsApp.');
    } finally {
      isSubmittingLockRef.current = false;
    }
  };

  // ── SUCCESS RECEIPT CARD VIEW ──
  if (submittedReceipt) {
    const whatsappUrl = productContext
      ? buildGeneralWhatsAppUrl(
          `Inquiry Ref: ${submittedReceipt.inquiryId}. Hi MuscleWorks! I submitted an inquiry for ${productContext.productName}${productContext.variantLabel ? ` (${productContext.variantLabel})` : ''}. Please confirm availability.`
        )
      : buildGeneralWhatsAppUrl(
          `Hi MuscleWorks! My Inquiry Reference ID is ${submittedReceipt.inquiryId}. I would like to follow up on my request.`
        );

    return (
      <div className={cn('rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8', className)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Inquiry Received!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Thank you, <span className="font-semibold text-foreground">{submittedReceipt.fullName}</span>. Our team at Golfutar, Kathmandu will contact you shortly.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs w-full max-w-sm">
            <span className="text-muted-foreground uppercase font-bold tracking-wider block mb-1">
              Reference ID
            </span>
            <code className="font-mono text-sm font-bold text-primary select-all">
              {submittedReceipt.inquiryId}
            </code>
          </div>

          {/* Fast Follow-up WhatsApp Action */}
          <div className="w-full max-w-sm pt-2 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              <span>Instant Follow-Up on WhatsApp</span>
            </a>

            <Button
              variant="outline"
              onClick={() => {
                setSubmittedReceipt(null);
                reset();
              }}
              className="w-full min-h-[44px] rounded-xl text-sm"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── INQUIRY FORM VIEW ──
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      className={cn('space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8', className)}
      noValidate
    >
      {/* Product Context Preview Pill */}
      {productContext && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Selected Product
            </span>
            <h4 className="text-sm font-bold text-foreground truncate">
              {productContext.productName}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {productContext.variantLabel && <span>{productContext.variantLabel}</span>}
              {productContext.priceNpr && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {formatNprPrice(productContext.priceNpr)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Anti-Bot Honeypot & Timing Trap */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="nope"
        data-lpignore="true"
        className="absolute -left-[9999px] opacity-0 h-0 w-0 pointer-events-none"
        {...register('hp_field')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="inquiry-fullName"
            placeholder="e.g. Rahul Sharma"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'inquiry-fullName-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.fullName && (
            <p id="inquiry-fullName-error" className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Nepal Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-phoneNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Phone Number (Nepal) <span className="text-destructive">*</span>
          </label>
          <Input
            id="inquiry-phoneNumber"
            placeholder="e.g. 9841XXXXXX or +977 9841XXXXXX"
            {...register('phoneNumber')}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'inquiry-phoneNumber-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.phoneNumber && (
            <p id="inquiry-phoneNumber-error" className="text-xs font-medium text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Email Address (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Input
            id="inquiry-email"
            type="email"
            placeholder="your.email@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.email && (
            <p id="inquiry-email-error" className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Inquiry Type Select */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-inquiryType" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Inquiry Category
          </label>
          <Select
            value={selectedInquiryType}
            onValueChange={(val: InquiryType) => setValue('inquiryType', val)}
          >
            <SelectTrigger id="inquiry-inquiryType" className="min-h-[44px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Advice & Consultations</SelectItem>
              <SelectItem value="product_inquiry">Product Details & Stock</SelectItem>
              <SelectItem value="bulk_order">Bulk / Wholesale Gym Order</SelectItem>
              <SelectItem value="delivery_status">Delivery Status & Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Delivery City Select */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-deliveryCity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Delivery Location / City
          </label>
          <Select
            value={selectedDeliveryCity || 'Kathmandu'}
            onValueChange={(val) => {
              setValue('deliveryCity', val, { shouldValidate: true });
              if (val !== 'Other') setCustomCity('');
            }}
          >
            <SelectTrigger id="inquiry-deliveryCity" className="min-h-[44px]">
              <SelectValue placeholder="Select Delivery City" />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map((city) => (
                <SelectItem key={city} value={city}>
                  {city === 'Kathmandu' || city === 'Lalitpur' || city === 'Bhaktapur'
                    ? `${city} (Fast Valley Delivery)`
                    : city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom City Text Input (when 'Other' selected) */}
        {selectedDeliveryCity === 'Other' && (
          <div className="space-y-1.5">
            <label htmlFor="inquiry-customCity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specify City / District <span className="text-destructive">*</span>
            </label>
            <Input
              id="inquiry-customCity"
              placeholder="e.g. Dharan, Hetauda, Nepalgunj"
              value={customCity}
              onChange={(e) => {
                const val = e.target.value;
                setCustomCity(val);
                setValue('deliveryCity', val ? val : 'Other', { shouldValidate: true });
              }}
              className="min-h-[44px]"
            />
          </div>
        )}

        {/* Preferred Contact Method */}
        <div className="space-y-1.5 sm:col-span-2">
          <label id="inquiry-method-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Preferred Response Method
          </label>
          <div role="radiogroup" aria-labelledby="inquiry-method-label" className="grid grid-cols-3 gap-2">
            {[
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'phone', label: 'Phone Call', icon: Phone },
              { id: 'email', label: 'Email', icon: Send },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selectedContactMethod === id}
                onClick={() => setValue('preferredContactMethod', id as PreferredContactMethod)}
                className={cn(
                  'flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all select-none',
                  selectedContactMethod === id
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <label htmlFor="inquiry-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Your Message / Question <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="inquiry-message"
          placeholder="Ask us anything about supplement stacks, dosage, Kathmandu delivery, or product authenticity..."
          rows={4}
          {...register('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'inquiry-message-error' : undefined}
          className="min-h-[100px] resize-y"
        />
        {errors.message && (
          <p id="inquiry-message-error" className="text-xs font-medium text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Authenticity Guarantee Callout Footer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>100% Genuine Authorized Importer Guarantee • Retail Store at Golfutar, Kathmandu</span>
      </div>

      {/* Submit CTA Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[48px] rounded-xl text-base font-bold shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            <span>Submit Inquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}
