import { Link, useParams } from 'react-router-dom';

const content: Record<string, { title: string; intro: string; sections: Array<[string, string]> }> = {
  about: {
    title: 'About RePlate',
    intro: 'RePlate gives quality surplus food another chance while helping neighborhood businesses recover costs.',
    sections: [
      ['Our Mission', 'We connect customers with verified surplus food at accessible prices before its scheduled pickup deadline.'],
      ['Our Promise', 'Every listing transparently displays price, remaining quantity, merchant details, and food-safety storage advice.'],
    ],
  },
  'how-it-works': {
    title: 'How It Works',
    intro: 'Rescuing fresh food takes just three simple steps.',
    sections: [
      ['1. Businesses List Surplus', 'Food businesses publish eligible products with quantities, discount prices, and pickup deadlines.'],
      ['2. Customers Choose a Deal', 'Customers explore local rescue listings and add items to their digital cart.'],
      ['3. Orders are Confirmed', 'Customers complete in-store pickup with zero advance online payment.'],
    ],
  },
  impact: {
    title: 'Our Environmental Impact',
    intro: 'Small collective choices create measurable planetary relief.',
    sections: [
      ['Less Waste', 'Rescuing surplus food directly prevents avoidable organic waste and landfill methane emissions.'],
      ['Recovered Revenue', 'Merchants recover operating value from food that would otherwise be discarded.'],
    ],
  },
  safety: {
    title: 'Food Safety Guidelines',
    intro: 'Food safety and consumer health come first on RePlate.',
    sections: [
      ['Merchant Responsibility', 'Sellers are legally responsible for accurate labelled dates, allergens, storage guidance, and eligibility standards.'],
      ['Customer Guidance', 'Consumers should inspect and follow collection, refrigeration, and cooking instructions provided on the listing.'],
    ],
  },
  privacy: {
    title: 'Privacy & Security Policy',
    intro: 'RePlate protects customer and seller data with PostgreSQL row-level security.',
    sections: [
      ['Data Protection', 'Private user profiles, cart items, and order history are accessible only by their respective owners and verified staff.'],
      ['Payment Security', 'No payment card numbers are held in frontend storage. Transactions are settled securely upon in-person pickup.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'Terms governing use of the RePlate food-rescue marketplace.',
    sections: [
      ['Platform Role', 'RePlate operates as a discovery and reservation platform connecting food businesses with local consumers.'],
      ['Food Safety Obligations', 'All participants agree to abide by statutory food safety and hygiene regulations.'],
    ],
  },
  help: {
    title: 'Help Centre',
    intro: 'Quick answers for shoppers and partner businesses.',
    sections: [
      ['Cart & Pickup', 'Use the quantity controls to adjust orders up to the merchant’s available stock.'],
      ['Seller Inventory', 'Use the Seller Hub to publish listings, upload photos, and track customer collections.'],
    ],
  },
  contact: {
    title: 'Contact RePlate',
    intro: 'Get in touch with our team for questions or partnership inquiries.',
    sections: [
      ['Customer Support', 'Reach out via support@replate.demo with order references or platform questions.'],
      ['Merchant Partnerships', 'Food businesses can register through the Seller Hub to begin listing surplus.'],
    ],
  },
  'feed-rescue': {
    title: 'Feed Rescue & Composting',
    intro: 'Surplus food unfit for human consumption is diverted to verified circular pathways.',
    sections: [
      ['Strict Segregation', 'Animal feed and compost items are strictly segregated from the consumer marketplace.'],
      ['Partner Verification', 'Feed recipients must be verified agricultural or composting entities.'],
    ],
  },
  'for-businesses': {
    title: 'Turn surplus into recovered revenue.',
    intro: 'RePlate gives food businesses a simple, transparent way to recover value from eligible surplus inventory.',
    sections: [
      ['List with Confidence', 'Add products, dates, quantities, and pricing in the seller workspace. Smart pricing recommendations help you move inventory responsibly.'],
      ['Verification First', 'Seller accounts undergo verification before listings go live on the public explore page.'],
    ],
  },
};

const InfoPage = () => {
  const { slug = 'about' } = useParams();
  const page = content[slug] ?? content.about;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <span className="eyebrow mb-2">RePlate Standards</span>
      <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary mb-4 tracking-tight">
        {page.title}
      </h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-10">{page.intro}</p>

      <div className="space-y-6">
        {page.sections.map(([heading, body]) => (
          <section key={heading} className="glass-panel-solid rounded-3xl border border-glass-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold font-display text-text-primary mb-2">{heading}</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{body}</p>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-10">
        <Link to="/" className="btn-secondary text-xs">
          Back to Home
        </Link>
        {slug === 'for-businesses' && (
          <Link to="/auth/sign-up" className="btn-primary text-xs">
            Start Rescuing as a Business
          </Link>
        )}
      </div>
    </div>
  );
};

export default InfoPage;
