'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
  Send,
  MapPin,
  Clock,
} from 'lucide-react';

import {
  InquiryFormClientSchema,
  type InquiryFormClientValues,
  type PreferredContactMethod,
} from '@/lib/validations/inquiry';
import { submitContactAction } from '@/actions/contact';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

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

export interface ContactFormProps {
  className?: string;
  onSuccess?: (inquiryId: string) => void;
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

export function ContactForm({ className, onSuccess }: ContactFormProps) {
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    inquiryId: string;
    fullName: string;
    phoneNumber: string;
    deliveryCity?: string;
  } | null>(null);

  const [customCity, setCustomCity] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormClientValues>({
    resolver: zodResolver(InquiryFormClientSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      inquiryType: 'general',
      message: '',
      preferredContactMethod: 'whatsapp',
      deliveryCity: 'Kathmandu',
      hp_field: '',
      _form_loaded_at: Date.now(),
    },
  });

  useEffect(() => {
    setValue('_form_loaded_at', Date.now());
  }, [setValue]);

  const selectedContactMethod = watch('preferredContactMethod');
  const selectedDeliveryCity = watch('deliveryCity');

  const onSubmit = async (values: InquiryFormClientValues) => {
    try {
      // Validate cross-field email requirement when 'email' contact method is chosen
      if (values.preferredContactMethod === 'email' && !values.email?.trim()) {
        toast.error('Please enter your email address so we can respond to your request.');
        return;
      }

      // If user selected 'Other' for city, require a non-empty custom city
      if (values.deliveryCity === 'Other' && !customCity.trim()) {
        toast.error('Please specify your city or location.');
        return;
      }

      const finalPayload: InquiryFormClientValues = {
        ...values,
        deliveryCity:
          values.deliveryCity === 'Other' && customCity.trim()
            ? customCity.trim()
            : values.deliveryCity,
      };

      const result = await submitContactAction(finalPayload);

      if (result.success && result.data?.inquiryId) {
        const inquiryId = result.data.inquiryId;
        toast.success(result.message || 'Contact message submitted successfully!');

        setSubmittedReceipt({
          inquiryId,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          deliveryCity: finalPayload.deliveryCity,
        });

        if (onSuccess) {
          onSuccess(inquiryId);
        }
      } else if (!result.success) {
        toast.error(result.error || 'Submission failed. Please check your fields and try again.');
      }
    } catch (err) {
      console.error('[ContactForm Submit Error]:', err);
      toast.error('An unexpected error occurred. Please call or message us on WhatsApp.');
    }
  };

  // ── SUCCESS RECEIPT CARD VIEW ──
  if (submittedReceipt) {
    const whatsappUrl = buildGeneralWhatsAppUrl(
      `Hi MuscleWorks! My Contact Ref ID is ${submittedReceipt.inquiryId}. I sent a message via the Contact page.`
    );

    return (
      <div className={cn('rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8', className)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Message Received!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Thank you, <span className="font-semibold text-foreground">{submittedReceipt.fullName}</span>. Our store representatives at Golfutar, Kathmandu will respond to your message shortly.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs w-full max-w-sm">
            <span className="text-muted-foreground uppercase font-bold tracking-wider block mb-1">
              Contact Reference ID
            </span>
            <code className="font-mono text-sm font-bold text-primary select-all">
              {submittedReceipt.inquiryId}
            </code>
          </div>

          {/* Direct Actions */}
          <div className="w-full max-w-sm pt-2 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              <span>Connect on WhatsApp Now</span>
            </a>

            <Button
              variant="outline"
              onClick={() => {
                setSubmittedReceipt(null);
                reset();
              }}
              className="w-full min-h-[44px] rounded-xl text-sm"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── CONTACT FORM VIEW ──
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8', className)}
      noValidate
    >
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">Send Us a Direct Message</h3>
        <p className="text-xs text-muted-foreground">
          Fill in your details below and our team at Golfutar, Kathmandu will get back to you within hours.
        </p>
      </div>

      {/* Hidden Anti-Bot Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0 h-0 w-0 pointer-events-none"
        {...register('hp_field')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="contact-fullName"
            placeholder="e.g. Samir Thapa"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'contact-fullName-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.fullName && (
            <p id="contact-fullName-error" className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Nepal Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="contact-phoneNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Phone Number (Nepal) <span className="text-destructive">*</span>
          </label>
          <Input
            id="contact-phoneNumber"
            placeholder="e.g. 9841XXXXXX"
            {...register('phoneNumber')}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'contact-phoneNumber-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.phoneNumber && (
            <p id="contact-phoneNumber-error" className="text-xs font-medium text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Email Address (Optional unless Email contact method chosen) */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address {selectedContactMethod === 'email' ? <span className="text-destructive">*</span> : <span className="text-xs text-muted-foreground font-normal">(Optional)</span>}
          </label>
          <Input
            id="contact-email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className="min-h-[44px]"
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Delivery / Location City */}
        <div className="space-y-1.5">
          <label htmlFor="contact-deliveryCity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your City / Location
          </label>
          <Select
            value={selectedDeliveryCity || 'Kathmandu'}
            onValueChange={(val) => {
              setValue('deliveryCity', val, { shouldValidate: true });
              if (val !== 'Other') setCustomCity('');
            }}
          >
            <SelectTrigger id="contact-deliveryCity" className="min-h-[44px]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom City Text Input (when 'Other' selected) */}
        {selectedDeliveryCity === 'Other' && (
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="contact-customCity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specify City / Location <span className="text-destructive">*</span>
            </label>
            <Input
              id="contact-customCity"
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
      </div>

      {/* Preferred Contact Method Selection */}
      <div className="space-y-1.5">
        <label id="contact-method-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          How Should We Contact You?
        </label>
        <div role="radiogroup" aria-labelledby="contact-method-label" className="grid grid-cols-3 gap-2">
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

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="contact-message"
          placeholder="How can we help you today? Ask about store pickup at Golfutar, product availability, or stack advice..."
          rows={4}
          {...register('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="min-h-[100px] resize-y"
        />
        {errors.message && (
          <p id="contact-message-error" className="text-xs font-medium text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Store Location Info Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2 pt-1 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>Golfutar, Budha-Nilkantha, Kathmandu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span>Sun–Fri: 10:00 AM – 9:00 PM</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[48px] rounded-xl text-base font-bold shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Submitting Message...</span>
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            <span>Send Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
