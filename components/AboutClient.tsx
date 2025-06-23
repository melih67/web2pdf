'use client'

import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

export default function AboutClient() {
  const { darkMode } = useTheme()

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Convert webpages to PDF in seconds with our optimized conversion engine'
    },
    {
      icon: '🎯',
      title: 'Pixel Perfect',
      description: 'Maintain exact layout and formatting from the original webpage'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and never stored on our servers'
    },
    {
      icon: '🌐',
      title: 'Universal Support',
      description: 'Works with any website, including dynamic content and modern frameworks'
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Perfect PDFs whether you\'re on desktop, tablet, or mobile'
    },
    {
      icon: '⚙️',
      title: 'Customizable',
      description: 'Control page size, quality, headers, footers, and more'
    }
  ]

  const stats = [
    { number: '1M+', label: 'PDFs Generated' },
    { number: '50K+', label: 'Happy Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'SnapPDF Launch',
      description: 'Launched with advanced PDF conversion technology and user-friendly interface'
    },
    {
      year: '2024',
      title: 'Pro Features',
      description: 'Added custom headers, footers, and batch conversion capabilities'
    },
    {
      year: '2024',
      title: 'Enterprise Solutions',
      description: 'Introduced API access and enterprise-grade features for businesses'
    },
    {
      year: 'Future',
      title: 'AI Integration',
      description: 'Working on AI-powered content optimization and smart formatting'
    }
  ]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About SnapPDF
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're on a mission to make web-to-PDF conversion simple, fast, and reliable for everyone. 
            From students saving research to businesses archiving content, SnapPDF empowers users 
            to capture and preserve web content effortlessly.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {stat.number}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Our Mission
              </h2>
              <p className={`text-lg mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                In today's digital world, valuable content exists everywhere on the web. 
                Whether it's research articles, documentation, reports, or creative content, 
                people need a reliable way to capture and preserve this information.
              </p>
              <p className={`text-lg mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                SnapPDF bridges this gap by providing a powerful, yet simple solution that 
                maintains the original formatting and layout while creating professional-quality PDFs.
              </p>
              <Link 
                href="/generator"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try SnapPDF Now
                <span className="ml-2">→</span>
              </Link>
            </div>
            <div className={`p-8 rounded-2xl ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            }`}>
              <div className="text-6xl mb-4 text-center">🎯</div>
              <h3 className={`text-xl font-semibold mb-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Why We Built SnapPDF
              </h3>
              <ul className={`space-y-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Existing solutions were slow and unreliable
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Users needed better formatting control
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Privacy and security were major concerns
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Modern web content required modern solutions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="py-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our Journey
          </h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold ${
                  item.year === 'Future' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}>
                  {item.year === 'Future' ? '🚀' : item.year}
                </div>
                <div className="ml-6 flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16">
          <div className={`p-12 rounded-2xl text-center ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
          }`}>
            <h2 className={`text-3xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Privacy First
                </h3>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Your data belongs to you. We don't store, track, or share your content.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Performance
                </h3>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Fast, reliable conversions that respect your time and workflow.
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Simplicity
                </h3>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Powerful features wrapped in an intuitive, easy-to-use interface.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-xl mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of users who trust SnapPDF for their web-to-PDF needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/generator"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Converting
            </Link>
            <Link 
              href="/pricing"
              className={`px-8 py-3 rounded-lg border font-medium transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}