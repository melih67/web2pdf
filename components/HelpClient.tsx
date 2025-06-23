'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

export default function HelpClient() {
  const { darkMode } = useTheme()
  const [activeCategory, setActiveCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'features', name: 'Features', icon: '⭐' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'api', name: 'API Documentation', icon: '📡' },
    { id: 'billing', name: 'Billing & Plans', icon: '💳' }
  ]

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with SnapPDF',
      articles: [
        {
          title: 'How to Convert Your First Webpage to PDF',
          content: [
            '1. Navigate to the Generator page from the sidebar',
            '2. Paste the URL of the webpage you want to convert',
            '3. Choose your preferred settings (page size, quality, etc.)',
            '4. Click "Generate PDF" and wait for the conversion',
            '5. Download your PDF when ready'
          ],
          tips: [
            'Make sure the URL is accessible and not behind a login',
            'For best results, use URLs that don\'t require JavaScript to load content',
            'Large pages may take longer to convert'
          ]
        },
        {
          title: 'Understanding PDF Settings',
          content: [
            'Page Size: Choose from A4, Letter, Legal, or A3 formats',
            'Quality: Higher quality means larger file size but better clarity',
            'Background Graphics: Include or exclude background images and colors',
            'Headers & Footers: Add custom text to top and bottom of pages (Pro+ only)'
          ],
          tips: [
            'A4 is the most common international standard',
            'Use "High" quality for documents with important details',
            'Disable backgrounds to reduce file size'
          ]
        },
        {
          title: 'Managing Your Account',
          content: [
            'Access your Dashboard to view conversion history',
            'Check Usage Stats to monitor your monthly limits',
            'Update Settings to customize your experience',
            'Upgrade your plan for additional features'
          ],
          tips: [
            'Free accounts have a monthly conversion limit',
            'Pro accounts get priority processing',
            'Enterprise accounts have no limits'
          ]
        }
      ]
    },
    'features': {
      title: 'SnapPDF Features',
      articles: [
        {
          title: 'Batch Conversion (Pro+)',
          content: [
            'Convert multiple URLs at once',
            'Upload a CSV file with URLs',
            'Download all PDFs as a ZIP file',
            'Monitor progress in real-time'
          ],
          tips: [
            'Maximum 100 URLs per batch for Pro accounts',
            'Enterprise accounts have no batch limits',
            'Each URL in the batch counts toward your monthly limit'
          ]
        },
        {
          title: 'Custom Headers and Footers (Pro+)',
          content: [
            'Add your company logo to headers',
            'Include page numbers and dates',
            'Add custom text and formatting',
            'Use variables like {url}, {title}, {date}'
          ],
          tips: [
            'Headers and footers appear on every page',
            'Use CSS for advanced styling',
            'Preview before generating the final PDF'
          ]
        },
        {
          title: 'API Access (Enterprise)',
          content: [
            'RESTful API for programmatic access',
            'Webhook support for async processing',
            'Rate limiting based on your plan',
            'Comprehensive documentation and SDKs'
          ],
          tips: [
            'API keys are available in your Settings',
            'Use webhooks for large batch processing',
            'Monitor API usage in your dashboard'
          ]
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting Common Issues',
      articles: [
        {
          title: 'PDF Generation Failed',
          content: [
            'Check if the URL is accessible from our servers',
            'Ensure the webpage doesn\'t require authentication',
            'Try a different page size or quality setting',
            'Contact support if the issue persists'
          ],
          tips: [
            'Some websites block automated access',
            'Pages with heavy JavaScript may not convert properly',
            'Try the URL in an incognito browser first'
          ]
        },
        {
          title: 'Poor PDF Quality',
          content: [
            'Increase the quality setting to "High"',
            'Enable background graphics if needed',
            'Check if the source webpage has high-resolution images',
            'Try a larger page size (A3 instead of A4)'
          ],
          tips: [
            'Quality depends on the source webpage',
            'Vector graphics convert better than raster images',
            'Some fonts may not render perfectly'
          ]
        },
        {
          title: 'Slow Conversion Speed',
          content: [
            'Large webpages take longer to process',
            'Pro accounts get priority processing',
            'Try converting during off-peak hours',
            'Consider breaking large pages into smaller sections'
          ],
          tips: [
            'Conversion time varies by page complexity',
            'Images and media increase processing time',
            'Our servers are optimized for speed'
          ]
        }
      ]
    },
    'api': {
      title: 'API Documentation',
      articles: [
        {
          title: 'Authentication',
          content: [
            'Get your API key from Settings page',
            'Include API key in Authorization header',
            'Format: "Bearer YOUR_API_KEY"',
            'Keep your API key secure and private'
          ],
          tips: [
            'API keys are tied to your account plan',
            'Regenerate keys if compromised',
            'Different keys for different environments'
          ]
        },
        {
          title: 'Convert Endpoint',
          content: [
            'POST /api/convert',
            'Required: url, format (optional)',
            'Optional: page_size, quality, background',
            'Returns: job_id for tracking'
          ],
          tips: [
            'Use webhooks for async processing',
            'Check job status with GET /api/jobs/{job_id}',
            'Download PDF with GET /api/download/{job_id}'
          ]
        },
        {
          title: 'Rate Limits',
          content: [
            'Free: 10 requests per hour',
            'Pro: 100 requests per hour',
            'Enterprise: Custom limits',
            'Rate limit headers included in responses'
          ],
          tips: [
            'Implement exponential backoff for retries',
            'Monitor rate limit headers',
            'Contact us for higher limits'
          ]
        }
      ]
    },
    'billing': {
      title: 'Billing & Plans',
      articles: [
        {
          title: 'Plan Comparison',
          content: [
            'Free: 50 PDFs/month, basic features',
            'Pro: 1000 PDFs/month, advanced features',
            'Enterprise: Unlimited, API access, priority support',
            'All plans include core conversion features'
          ],
          tips: [
            'Upgrade anytime from your Settings',
            'Unused conversions don\'t roll over',
            'Enterprise plans are customizable'
          ]
        },
        {
          title: 'Billing Cycle',
          content: [
            'Monthly plans renew every 30 days',
            'Annual plans offer 20% discount',
            'Usage resets at the start of each cycle',
            'Invoices are sent via email'
          ],
          tips: [
            'Annual billing saves money',
            'Prorated charges for mid-cycle upgrades',
            'Download invoices from your account'
          ]
        },
        {
          title: 'Cancellation & Refunds',
          content: [
            'Cancel anytime from Settings',
            'No cancellation fees',
            'Access continues until end of billing period',
            'Refunds available within 30 days'
          ],
          tips: [
            'Downgrade instead of canceling to keep history',
            'Export your data before canceling',
            'Contact support for refund requests'
          ]
        }
      ]
    }
  }

  const currentContent = helpContent[activeCategory as keyof typeof helpContent]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Help Center
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Everything you need to know about using SnapPDF
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/contact"
            className={`p-6 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact Support
            </h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Get help from our support team
            </p>
          </Link>
          
          <Link 
            href="/generator"
            className={`p-6 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-3">⚡</div>
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Try Generator
            </h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Convert your first webpage to PDF
            </p>
          </Link>
          
          <Link 
            href="/pricing"
            className={`p-6 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-3">💰</div>
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              View Pricing
            </h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Compare plans and features
            </p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className={`lg:col-span-1 p-6 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Categories
            </h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className={`p-8 rounded-xl ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-gray-200'
            }`}>
              <h1 className={`text-2xl font-bold mb-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {currentContent.title}
              </h1>
              
              <div className="space-y-8">
                {currentContent.articles.map((article, index) => (
                  <div key={index} className={`pb-8 border-b last:border-b-0 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h2 className={`text-xl font-semibold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {article.title}
                    </h2>
                    
                    <div className="mb-6">
                      <h3 className={`text-sm font-medium mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Steps:
                      </h3>
                      <ul className={`space-y-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {article.content.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {article.tips && (
                      <div className={`p-4 rounded-lg ${
                        darkMode 
                          ? 'bg-blue-900/20 border border-blue-700/30' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <h3 className={`text-sm font-medium mb-2 ${
                          darkMode ? 'text-blue-300' : 'text-blue-800'
                        }`}>
                          💡 Tips:
                        </h3>
                        <ul className={`space-y-1 text-sm ${
                          darkMode ? 'text-blue-200' : 'text-blue-700'
                        }`}>
                          {article.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start">
                              <span className="mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className={`mt-12 p-8 rounded-xl text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Still Need Help?
          </h2>
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our support team is here to help you succeed with SnapPDF
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:support@snappdf.com"
              className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}