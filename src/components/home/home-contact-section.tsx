"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Truck,
} from "lucide-react";

import {
  InquiryFormClientSchema,
  type InquiryFormClientValues,
  type PreferredContactMethod,
} from "@/lib/validations/inquiry";
import { submitContactAction } from "@/actions/contact";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { STORE_PHONE, STORE_PHONE_RAW, STORE_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CITY_OPTIONS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Butwal",
  "Biratnagar",
  "Chitwan",
  "Other",
];

export function HomeContactSection() {
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    inquiryId: string;
    fullName: string;
    phoneNumber: string;
    deliveryCity?: string;
  } | null>(null);

  const [customCity, setCustomCity] = useState("");

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
      fullName: "",
      phoneNumber: "",
      email: "",
      inquiryType: "general",
      message: "",
      preferredContactMethod: "whatsapp",
      deliveryCity: "Kathmandu",
      hp_field: "",
      _form_loaded_at: 0,
    },
  });

  useEffect(() => {
    setValue("_form_loaded_at", Date.now());
  }, [setValue]);

  const selectedContactMethod = useWatch({ control, name: "preferredContactMethod" });
  const selectedDeliveryCity = useWatch({ control, name: "deliveryCity" });

  const onSubmit = async (values: InquiryFormClientValues) => {
    try {
      if (values.preferredContactMethod === "email" && !values.email?.trim()) {
        toast.error("Please enter your email address so we can respond to your request.");
        return;
      }

      const finalValues = {
        ...values,
        deliveryCity: values.deliveryCity === "Other" && customCity.trim()
          ? customCity.trim()
          : values.deliveryCity,
      };

      const result = await submitContactAction(finalValues);

      if (result.success) {
        setSubmittedReceipt({
          inquiryId: result.data.inquiryId,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          deliveryCity: finalValues.deliveryCity,
        });
        toast.success("Thank you! Your message has been received.");
      } else {
        toast.error(result.error || "Failed to send your message. Please try WhatsApp directly.");
      }
    } catch {
      toast.error("Something went wrong while connecting to the server. Please try again.");
    }
  };

  const handleResetForm = () => {
    setSubmittedReceipt(null);
    setCustomCity("");
    reset();
    setValue("_form_loaded_at", Date.now());
  };

  const directWhatsAppUrl = buildGeneralWhatsAppUrl();

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-14 sm:py-20 lg:py-24 border-t border-slate-800">
      {/* Responsive Background Charcoal Textures - Exactly Matching Deals & Goals Sections */}
      {/* Mobile Vertical Texture */}
      <Image
        src="/deals/charcoal-bg-mobile.webp"
        alt="Dark Charcoal Background Texture Mobile"
        fill
        sizes="(max-width: 640px) 100vw, 1px"
        className="object-cover object-center sm:hidden"
      />
      {/* Desktop & Tablet Widescreen Texture */}
      <Image
        src="/deals/charcoal-bg.webp"
        alt="Dark Charcoal Background Texture Desktop"
        fill
        sizes="(min-width: 640px) 100vw, 1px"
        className="hidden sm:block object-cover object-center"
      />

      {/* Dark Shadow Overlay - Exactly Matching Deals & Goals Sections */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Clean Without Badge) */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-heading font-black tracking-tight uppercase text-3xl sm:text-4xl lg:text-5xl text-white">
            GET IN TOUCH <span className="text-[#FF5500]">WITH US</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal mt-2.5 max-w-2xl leading-relaxed">
            Need supplement stack advice, order inquiries, or store directions? Contact our Kathmandu nutrition specialists directly.
          </p>
        </div>

        {/* 2-Column Split: Left Store Details / Right Boxless Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: MuscleWorks Store Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Store Information */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-[#FF5500] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Retail Flagship Store
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                    Golfutar, Budha-Nilkantha, Kathmandu 44500, Nepal
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Near Golfutar Basketball Court
                  </p>
                  <Link
                    href="/location"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5500] hover:text-[#ff7733] mt-2 transition-colors uppercase tracking-wider"
                  >
                    <span>View Map & Directions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Direct Hotline */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-[#FF5500] shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Phone & WhatsApp Hotline
                  </h3>
                  <a
                    href={`tel:${STORE_PHONE_RAW}`}
                    className="text-slate-200 hover:text-white font-bold text-sm sm:text-base mt-1 block tracking-wide transition-colors"
                  >
                    {STORE_PHONE}
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Instant WhatsApp support available daily
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-[#FF5500] shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Opening Hours
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    <strong className="text-white">{STORE_HOURS.weekdays}</strong>
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {STORE_HOURS.saturday}
                  </p>
                </div>
              </div>

              {/* Delivery Guarantee */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-[#FF5500] shrink-0 mt-1">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Fast Delivery
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    Same-day in Kathmandu Valley · 2-4 days nationwide Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Button */}
            <div className="pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base px-6 py-3.5 transition-all shadow-lg min-h-[48px] uppercase tracking-wider"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct-on-Background Contact Form */}
          <div className="lg:col-span-7 lg:pl-4 pt-8 lg:pt-0">

            {submittedReceipt ? (
              /* Success Receipt View */
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white uppercase tracking-tight">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                      Inquiry ID: <span className="font-mono text-[#FF5500]">{submittedReceipt.inquiryId}</span>
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Thank you, <strong className="text-white">{submittedReceipt.fullName}</strong>. Our Kathmandu nutrition team has received your message and will reach out to you via your preferred contact channel shortly.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={buildGeneralWhatsAppUrl(
                      `Namaste MuscleWorks! I just submitted an inquiry (ID: ${submittedReceipt.inquiryId}). My name is ${submittedReceipt.fullName}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 min-h-[48px] transition-colors uppercase tracking-wider"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-6 py-3 min-h-[48px] transition-colors uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              /* Boxless Interactive Form Placed Directly on Background */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot & Anti-Bot Hidden Fields */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  {...register("hp_field")}
                />
                <input
                  type="hidden"
                  {...register("_form_loaded_at", { valueAsNumber: true })}
                />

                {/* Row 1: Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="home-fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Full Name <span className="text-[#FF5500]">*</span>
                    </label>
                    <input
                      id="home-fullName"
                      type="text"
                      placeholder="e.g. Bikash Shrestha"
                      className={cn(
                        "w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] min-h-[48px] transition-colors",
                        errors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-400 mt-1 font-medium">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="home-phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Nepal Phone Number <span className="text-[#FF5500]">*</span>
                    </label>
                    <input
                      id="home-phoneNumber"
                      type="tel"
                      placeholder="98XXXXXXXX / +977-98..."
                      className={cn(
                        "w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] min-h-[48px] transition-colors",
                        errors.phoneNumber && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-400 mt-1 font-medium">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Preferred Contact Method Toggle Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Response Method
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                      { id: "phone", label: "Phone Call", icon: Phone },
                      { id: "email", label: "Email", icon: Send },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedContactMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setValue("preferredContactMethod", method.id as PreferredContactMethod)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider min-h-[48px] transition-all",
                            isSelected
                              ? "bg-[#FF5500] border-[#FF5500] text-white shadow-md"
                              : "bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Email Field when Email is selected */}
                {selectedContactMethod === "email" && (
                  <div>
                    <label htmlFor="home-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address <span className="text-[#FF5500]">*</span>
                    </label>
                    <input
                      id="home-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={cn(
                        "w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] min-h-[48px] transition-colors",
                        errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>
                )}

                {/* Row 3: Delivery City Selector */}
                <div>
                  <label htmlFor="home-deliveryCity" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Location / City
                  </label>
                  <select
                    id="home-deliveryCity"
                    value={selectedDeliveryCity}
                    onChange={(e) => setValue("deliveryCity", e.target.value)}
                    className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] min-h-[48px] transition-colors"
                  >
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom City input if Other selected */}
                {selectedDeliveryCity === "Other" && (
                  <div>
                    <label htmlFor="home-customCity" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Enter Your City Name <span className="text-[#FF5500]">*</span>
                    </label>
                    <input
                      id="home-customCity"
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Dharan, Hetauda, Nepalgunj"
                      className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] min-h-[48px] transition-colors"
                    />
                  </div>
                )}

                {/* Row 4: Message / Inquiry Text */}
                <div>
                  <label htmlFor="home-message" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Message / Question <span className="text-[#FF5500]">*</span>
                  </label>
                  <textarea
                    id="home-message"
                    rows={4}
                    placeholder="Tell us what supplements you're looking for, fitness goals, or any questions..."
                    className={cn(
                      "w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-4 py-3 text-white text-sm sm:text-base placeholder-slate-500 focus:outline-hidden focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors resize-none",
                      errors.message && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
