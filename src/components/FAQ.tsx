

export default function FAQ() {
    return (
        <>
            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            How do I order?
                        </h4>
                        <p className="text-gray-600 mb-4">
                            To place an order, go to the shop page, select the items you
                            wish to order for and place an order.
                        </p>

                        <h4 className="font-semibold text-gray-900 mb-2">
                            How much food do I need to order?
                        </h4>
                        <p className="text-gray-600 mb-4">
                            The minimum order number would be indicated on each item.
                        </p>

                        <h4 className="font-semibold text-gray-900 mb-2">
                            How fresh are the products?
                        </h4>
                        <p className="text-gray-600">
                            All our products come directly from local farmers and are
                            harvested within 24-48 hours of delivery.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Will you deliver the items to us?
                        </h4>
                        <p className="text-gray-600 mb-4">
                            Yes, we do carry out delivery. Reach out to us on social media
                            to signify your nearest bus stop as a pickup site.
                        </p>

                        <h4 className="font-semibold text-gray-900 mb-2">
                            Can I return products?
                        </h4>
                        <p className="text-gray-600 mb-4">
                            Yes, we have a 24-hour return policy for fresh produce if you're
                            not satisfied with the quality.
                        </p>

                        <h4 className="font-semibold text-gray-900 mb-2">
                            How are your contribution improving the economy?
                        </h4>
                        <p className="text-gray-600">
                            Our operations have generated income and employment for young
                            individuals in rural areas, helping to stem the tide of
                            rural-urban migration. We see every job created as a step
                            towards reducing poverty in our communities
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}