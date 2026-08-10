'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { type InquiryProductContext } from '@/lib/validations/inquiry';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface ConsultationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  productContext?: InquiryProductContext;
  trigger?: React.ReactNode;
}

export function ConsultationModal({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  productContext,
  trigger,
}: ConsultationModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="gold"
            size="lg"
            className="min-h-[48px] rounded-xl font-bold shadow-md gap-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Get Free Expert Consultation</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="text-left space-y-2 pb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            <span>MuscleWorks Expert Stacks & Consultation</span>
          </div>

          <DialogTitle className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {productContext
              ? `Inquire About ${productContext.productName}`
              : 'Free Supplement Consultation & Stack Advice'}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Get personalized advice on dosage, fitness goals (Lean Muscle, Mass Gaining, Fat Loss), genuine importer verification, and fast delivery in Kathmandu Valley.
          </DialogDescription>
        </DialogHeader>

        {/* Embedded Inquiry Form */}
        <InquiryForm
          productContext={productContext}
          defaultInquiryType={productContext ? 'product_inquiry' : 'general'}
          className="border-none p-0 shadow-none bg-transparent"
        />
      </DialogContent>
    </Dialog>
  );
}
