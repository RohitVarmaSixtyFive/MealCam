import Head from 'next/head';
import Link from 'next/link';
import { Camera, TrendingUp, Clock, Users } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>TrackEat - AI-Powered Nutritional Tracking</title>
        <meta name="description" content="Track your nutrition with AI-powered meal recognition. Upload a photo and get instant nutritional breakdown." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900">BiteMe</h1>
              </div>
              <nav className="flex space-x-4">
                <Link href="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              Track Your Nutrition with{' '}
              <span className="text-gradient">AI Power</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Simply snap a photo of your meal and let our AI analyze it. Get instant nutritional breakdowns and track your fitness goals effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn btn-primary btn-lg">
                Start Tracking Now
              </Link>
              <Link href="/demo" className="btn btn-outline btn-lg">
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
              Why Choose BiteMe?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Recognition</h4>
                <p className="text-gray-600">
                  Upload a photo and get instant meal analysis with detailed nutritional breakdown powered by advanced AI.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h4>
                <p className="text-gray-600">
                  Monitor your daily nutrition goals and track your progress with beautiful charts and insights.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast & Easy</h4>
                <p className="text-gray-600">
                  Log meals in under 60 seconds. No more manual searching and data entry - just snap and go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  1
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Upload Photo</h4>
                <p className="text-gray-600">
                  Take a photo of your meal using your phone or upload from your gallery.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  2
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-gray-600">
                  Our AI identifies food items and calculates nutritional values automatically.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  3
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Review & Save</h4>
                <p className="text-gray-600">
                  Review the analysis, make any adjustments, and save to your nutrition log.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              Ready to Transform Your Nutrition Tracking?
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of fitness enthusiasts who are already using BiteMe to reach their goals.
            </p>
            <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-display font-bold">BiteMe</h4>
                </div>
                <p className="text-gray-400">
                  AI-powered nutrition tracking made simple and fast.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Product</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Support</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Company</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BiteMe. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
