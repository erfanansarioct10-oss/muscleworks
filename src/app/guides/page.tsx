import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { STORE_NAME, SITE_URL } from '@/lib/constants';
import guidesData from '@/data/guides.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Supplement & Stack Guides Nepal | Expert Fitness Education',
  description: 'Evidence-based fitness & supplement guides for athletes in Nepal. Learn how to verify authentic hologram seals, choose between whey isolate vs concentrate, and optimize creatine dosing.',
  openGraph: {
    title: `Supplement Guides & Fitness Education | ${STORE_NAME}`,
    description: 'Evidence-based supplement guides and authenticity verification advice for fitness practitioners in Nepal.',
    url: `${SITE_URL}/guides`,
  },
};

export default function GuidesPage() {
  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top Tag */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Guides &amp; Education</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col gap-3 max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>ATHLETE KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-foreground">
            SUPPLEMENT &amp; STACK GUIDES
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Evidence-based sports nutrition education tailored for fitness enthusiasts in Nepal. Written by certified nutrition specialists and our authenticity verification desk.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {guidesData.map((guide) => (
            <article
              key={guide.slug}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-video w-full bg-muted overflow-hidden">
                <Image
                  src={guide.coverImage.url}
                  alt={guide.coverImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="authentic" className="text-[10px] uppercase tracking-wider font-bold">
                    {guide.category.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>

              {/* Guide Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {guide.readingTimeMinutes} min read
                    </span>
                    <span>•</span>
                    <span>{new Date(guide.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {guide.excerpt}
                  </p>
                </div>

                {/* Author & Action Footer */}
                <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border border-border">
                      <Image
                        src={guide.author.avatar}
                        alt={guide.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">{guide.author.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{guide.author.role}</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs font-bold text-primary hover:text-primary group-hover:translate-x-0.5 transition-transform"
                  >
                    <Link href="/products">
                      <span>Products</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Verification Banner */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Need Help Selecting Your Stack or Verifying Authenticity?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Chat directly with our certified sports nutrition advisors in Kathmandu on WhatsApp for personalized dosage instructions and seal verification.
              </p>
            </div>
          </div>

          <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto shrink-0 font-bold">
            <Link href="/contact">
              <span>Contact Store Advisors</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
