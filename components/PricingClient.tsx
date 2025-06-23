'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonLink: string
}

export default function PricingClient() {
  const { darkMode } = useTheme()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out SnapPDF',
      features: [
        '3 PDFs per month',
        'Basic quality conversion',
        'Standard page sizes',
        'Email support',
        '7-day history'
      ],
      buttonText: 'Get Started',
      buttonLink: '/auth/signup'
    },
    {
      name: 'Pro',
      price: isAnnual ? '$8' : '$10',
      period: 'month',
      description: 'For professionals and small teams',
      features: [
        '100 PDFs per month',
        'High quality conversion',
        'All page sizes & formats',
        'Priority email support',
        'Unlimited history',
        'Custom headers/footers',
        'Batch processing',
        'API access'
      ],
      popular: true,
      buttonText: 'Start Pro Trial',
      buttonLink: '/auth/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '$25' : '$30',
      period: 'month',
      description: 'For large teams and organizations',
      features: [
        'Unlimited PDFs',
        'Premium quality conversion',
        'Custom branding',
        'Dedicated support',
        'Advanced analytics',
        'Team management',
        'SSO integration',
        'Custom integrations',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact'
    }
  ]

  const PricingCard = ({ plan }: { plan: PricingPlan }) => (
    <div className={`relative p-8 rounded-2xl shadow-lg transition-all hover:scale-105 ${
      plan.popular 
        ? 'ring-2 ring-blue-500 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
        : (darkMode 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-white border border-gray-200')
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {plan.name}
        </h3>
        <div className="mb-4">
          <span className={`text-4xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {plan.price}
          </span>
          <span className={`text-lg ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            /{plan.period}
          </span>
        </div>
        <p className={`text-lg mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {plan.description}
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.buttonLink}
        className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${
          plan.popular
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : (darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white')
        }`}
      >
        {plan.buttonText}
      </Link>
    </div>
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-xl mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Choose the perfect plan for your PDF conversion needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${
              !isAnnual ? 'font-semibold' : ''
            } ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${
              isAnnual ? 'font-semibold' : ''
            } ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Annual
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Can I change my plan anytime?
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                What happens if I exceed my limit?
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                You'll be notified when approaching your limit. You can upgrade or wait for the next billing cycle.
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Is there a free trial?
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Do you offer refunds?
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 p-12 rounded-2xl ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to get started?
          </h2>
          <p className={`text-xl mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of users who trust SnapPDF for their document conversion needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              }`}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}