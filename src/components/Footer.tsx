
import { Link } from "react-router-dom";
import { SocialIcons } from "@/components/SocialIcons";;
import logo from "../assets/android-chrome-192x192.png"

export default function Footer() {
    return (<>
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="logo" className="h-8 w-8 text-green-600" />
                            <span className="ml-2 text-xl font-bold">KRP Farm</span>
                        </Link>
                        <p className="mt-4 text-gray-400 max-w-md">
                            Connecting Nigerian farmers with consumers for fresh, local
                            produce delivery.
                        </p>
                        <div className="mt-6">
                            <SocialIcons />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/marketplace"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-300 hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Support
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/auth" className="text-gray-300 hover:text-white">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@farmstore.ng"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+2348000000000"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Call Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2025 KRP FARM.</p>
                </div>
            </div>
        </footer>
    </>
    )
};
