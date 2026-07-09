import { Button } from "@/components/ui/Button";

export function QuoteCTA() {
  return (
    <section className="border-y-[3px] border-gold bg-cream py-20">
      <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
        <h2 className="font-display text-[40px] font-bold text-navy">
          Ready to Work With Us?
        </h2>
        <p className="mt-4 text-[17px] font-normal text-muted">
          Tell us what you need and we&apos;ll get back to you with a quote
          within 24 hours.
        </p>
        <div className="mt-10">
          <Button href="/get-a-quote" variant="primary" size="lg">
            Request a Quote →
          </Button>
        </div>
      </div>
    </section>
  );
}
