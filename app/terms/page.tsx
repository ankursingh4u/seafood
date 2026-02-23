import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Terms & Conditions — Salty's Seafood & Takeaway",
};

const Section = ({
  id,
  number,
  title,
  children,
}: {
  id?: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-start gap-4 mb-4">
      <span
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white mt-0.5"
        style={{ background: "#e05c2a" }}
      >
        {number}
      </span>
      <h2 className="text-lg font-extrabold text-gray-900 pt-1">{title}</h2>
    </div>
    <div className="ml-12 text-sm text-gray-500 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fdf9f4" }}>
      <SiteHeader />

      {/* Page banner */}
      <div style={{ background: "#0d1f2d" }}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/40 text-sm">
            Last updated: January 2025 &nbsp;·&nbsp; Salty&apos;s Seafood &amp; Takeaway
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-10">

        {/* Intro card */}
        <div
          className="bg-white rounded-2xl p-6 text-sm text-gray-500 leading-relaxed"
          style={{ border: "1px solid #f0e8dc" }}
        >
          Welcome to Salty&apos;s Seafood &amp; Takeaway. By placing an order through our website
          you agree to the terms below. Please read them carefully. These terms apply to all
          orders placed via{" "}
          <span className="font-semibold text-gray-700">saltysseafood.com.au</span> and do not
          affect your statutory rights.
        </div>

        <Section number="01" title="Orders &amp; Payment">
          <p>
            All prices are displayed in Australian Dollars (AUD) and include GST where applicable.
            We reserve the right to change menu prices at any time without prior notice.
          </p>
          <p>
            By submitting an order you confirm that all information provided (name, phone number,
            special instructions) is accurate. We will contact you on the phone number provided if
            there is any issue with your order.
          </p>
          <p>
            Payment is accepted at the counter upon pickup. Online payment options may be introduced
            at a later date.
          </p>
        </Section>

        <Section number="02" title="Pickup Policy">
          <p>
            Salty&apos;s Seafood &amp; Takeaway operates as a <strong className="text-gray-700">pickup-only</strong> service.
            We do not offer delivery. Orders must be collected from our premises during business hours.
          </p>
          <p>
            Once your order is placed it is sent directly to our kitchen. Please arrive within a
            reasonable time of placing your order. Orders that are not collected within 30 minutes
            of being marked <strong className="text-gray-700">Ready</strong> may be discarded, and
            no refund will be issued.
          </p>
          <p>
            Our current operating hours are{" "}
            <strong className="text-gray-700">Monday to Sunday, 11:00 AM – 9:00 PM</strong>.
            Orders placed outside of these hours will be prepared on the next available opening.
          </p>
        </Section>

        <Section number="03" id="allergens" title="Food Allergens &amp; Dietary Requirements">
          <p>
            Our kitchen handles shellfish, crustaceans, fish, gluten, eggs, soy, sesame, and
            other common allergens. We cannot guarantee that any menu item is completely
            free from allergens due to the risk of cross-contamination.
          </p>
          <p>
            If you have a food allergy or dietary requirement, please contact us directly before
            placing an order. We will do our best to accommodate your needs but cannot accept
            liability for allergic reactions.
          </p>
          <p>
            Customers with severe allergies are advised to exercise caution and seek medical
            advice before consuming our products.
          </p>
        </Section>

        <Section number="04" id="refunds" title="Refunds &amp; Cancellations">
          <p>
            Once an order is accepted and sent to the kitchen it cannot be cancelled. If your
            order is incorrect or does not meet a reasonable quality standard, please speak to
            a staff member immediately at the counter.
          </p>
          <p>
            We are committed to serving high-quality food. If you have a genuine complaint about
            the quality of your order, we will offer a replacement item or store credit at our
            discretion.
          </p>
          <p>
            Refunds will not be issued for change of mind, incorrect orders due to inaccurate
            customer input, or orders that were collected but not consumed.
          </p>
        </Section>

        <Section number="05" id="privacy" title="Privacy &amp; Data">
          <p>
            When you place an order we collect your name and phone number for the sole purpose of
            fulfilling your order and contacting you if required. We do not sell, share, or
            distribute your personal information to third parties.
          </p>
          <p>
            Order data is stored securely and is used only for operational purposes (order
            management, kitchen workflow). We do not send marketing communications without
            your explicit consent.
          </p>
          <p>
            You may request deletion of your data at any time by emailing{" "}
            <a
              href="mailto:hello@saltysseafood.com.au"
              className="underline"
              style={{ color: "#e05c2a" }}
            >
              hello@saltysseafood.com.au
            </a>
            .
          </p>
        </Section>

        <Section number="06" title="Intellectual Property">
          <p>
            All content on this website — including images, text, logos, and design — is the
            property of Salty&apos;s Seafood &amp; Takeaway or its licensors. You may not reproduce,
            distribute, or use any content without prior written permission.
          </p>
        </Section>

        <Section number="07" title="Limitation of Liability">
          <p>
            Salty&apos;s Seafood &amp; Takeaway is not liable for any indirect, incidental, or
            consequential damages arising from the use of this website or the consumption of our
            products, beyond what is required by Australian Consumer Law.
          </p>
          <p>
            We make every effort to ensure the accuracy of menu information, pricing, and
            availability, but cannot guarantee that our website is error-free at all times.
          </p>
        </Section>

        <Section number="08" title="Changes to These Terms">
          <p>
            We reserve the right to update or modify these terms at any time. Changes will be
            effective immediately upon posting to this page. Continued use of our website or
            ordering service constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section number="09" title="Contact Us">
          <p>If you have any questions about these terms, please contact us:</p>
          <div
            className="bg-white rounded-2xl p-5 mt-3 flex flex-col sm:flex-row gap-4 sm:gap-10"
            style={{ border: "1px solid #f0e8dc" }}
          >
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <a href="tel:+61312345678" className="font-semibold text-gray-800 text-sm hover:underline">
                (03) 1234 5678
              </a>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <a
                href="mailto:hello@saltysseafood.com.au"
                className="font-semibold text-sm hover:underline"
                style={{ color: "#e05c2a" }}
              >
                hello@saltysseafood.com.au
              </a>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Hours</p>
              <p className="font-semibold text-gray-800 text-sm">Mon–Sun, 11AM – 9PM</p>
            </div>
          </div>
        </Section>

      </main>

      <SiteFooter />
    </div>
  );
}
