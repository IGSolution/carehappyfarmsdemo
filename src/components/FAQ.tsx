import { useState } from "react";

const faqs = [
  {
    question: "How do I order?",
    answer:
      "To place an order, go to the shop page, select the items you wish to order for and place an order.",
  },
  {
    question: "How much food do I need to order?",
    answer:
      "The minimum order number would be indicated on each item.",
  },
  {
    question: "How fresh are the products?",
    answer:
      "All our products come directly from local farmers and are harvested within 24-48 hours of delivery.",
  },
  {
    question: "Will you deliver the items to us?",
    answer:
      "Yes, we do carry out delivery. Reach out to us on social media to signify your nearest bus stop as a pickup site.",
  },
  {
    question: "Can I return products?",
    answer:
      "Yes, we have a 24-hour return policy for fresh produce if you're not satisfied with the quality.",
  },
  {
    question: "How are your contributions improving the economy?",
    answer:
      "Our operations have generated income and employment for young individuals in rural areas, helping to stem the tide of rural-urban migration. We see every job created as a step towards reducing poverty in our communities.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split into 2 halves
  const leftFaqs = faqs.slice(0, 3);
  const rightFaqs = faqs.slice(3);

  const renderFaqs = (items, offset = 0) =>
    items.map((faq, index) => {
      const realIndex = index + offset;
      return (
        <div key={realIndex} className="border border-gray-200 rounded-md mb-4">
          <button
            onClick={() => toggle(realIndex)}
            className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none"
          >
            <span className="font-semibold text-gray-900">{faq.question}</span>
            <svg
              className={`w-5 h-5 transition-transform ${
                openIndex === realIndex ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === realIndex && (
            <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
          )}
        </div>
      );
    });

  return (
    <section className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-green-600 mb-8 text-center">
        Frequently Asked Questions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>{renderFaqs(leftFaqs, 0)}</div>
        <div>{renderFaqs(rightFaqs, 3)}</div>
      </div>
    </section>
  );
}
