import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: "For Clients",
    items: [
      { q: "How do I book a photographer?", a: "Simply browse our explore page, filter by category and location, select your preferred creator, and choose an available date and time to lock in your booking." },
      { q: "Is my payment secure?", a: "Yes. All payments are held in escrow and only released to the creator once the shoot is successfully completed." },
      { q: "Can I cancel a booking?", a: "Cancellations are allowed up to 48 hours before the scheduled shoot for a full refund." }
    ]
  },
  {
    category: "For Creators & Studios",
    items: [
      { q: "How do I list my studio or services?", a: "Click the 'List Space / Gear' button in the top right. You'll need to fill out your profile and upload high-quality images of your work or space." },
      { q: "When do I get paid?", a: "Payments are processed within 24 hours after a booking is marked as 'Completed' by the client." },
      { q: "What fee does PickMyShoot charge?", a: "We charge a flat 10% platform fee on all successful bookings to cover payment processing and support." }
    ]
  }
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (idx) => {
    if (openIndex === idx) setOpenIndex(null);
    else setOpenIndex(idx);
  };

  let globalIdx = 0;

  return (
    <div className="info-page-container faq-container">
      <div className="info-page-hero" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="info-page-title">Frequently Asked Questions</h1>
        <p className="info-page-subtitle">Find answers to common questions about using our platform.</p>
      </div>

      <div className="faq-content-wrap">
        {faqs.map((group, gIdx) => (
          <div key={gIdx} className="faq-group">
            <h2 className="faq-category-title">{group.category}</h2>
            <div className="faq-list">
              {group.items.map((item) => {
                const currentIdx = globalIdx++;
                const isOpen = openIndex === currentIdx;
                
                return (
                  <div 
                    key={currentIdx} 
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                    onClick={() => toggleFaq(currentIdx)}
                  >
                    <div className="faq-question">
                      <h4>{item.q}</h4>
                      <ChevronDown className="faq-chevron" size={20} />
                    </div>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
