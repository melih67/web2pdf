'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  type: 'general' | 'support' | 'sales' | 'bug'
}

export default function ContactClient() {
  const { darkMode } = useTheme()
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      })
    }, 3000)
  }

  const updateForm = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@snappdf.com',
      response: 'Response within 24 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available 9 AM - 6 PM EST',
      response: 'Instant response'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      response: 'Mon-Fri, 9 AM - 6 PM EST'
    }
  ]

  const faqItems = [
    {
      question: 'How do I convert a webpage to PDF?',
      answer: 'Simply paste the URL into our converter, choose your settings, and click "Generate PDF". The conversion happens instantly.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support PDF output in various page sizes (A4, Letter, Legal, A3) with customizable quality settings.'
    },
    {
      question: 'Is there a limit on file size?',
      answer: 'Free users can generate PDFs up to 10MB. Pro users have a 50MB limit, and Enterprise users have no limits.'
    },
    {
      question: 'Can I customize the PDF output?',
      answer: 'Yes! You can adjust page size, quality, include/exclude backgrounds, and set custom headers and footers (Pro+ plans).'
    }
  ]

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`text-center p-12 rounded-2xl ${
            darkMode 
              ? 'bg-green-900/20 border border-green-700/50' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="text-6xl mb-6">✅</div>
            <h2 className={`text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Message Sent Successfully!
            </h2>
            <p className={`text-xl ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Get in Touch
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Have questions? We're here to help you succeed with SnapPDF
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`p-8 rounded-2xl shadow-lg ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type of Inquiry
                </label>
                <select
                  value={form.type}
                  onChange={(e) => updateForm('type', e.target.value as ContactForm['type'])}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => updateForm('subject', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Brief description of your inquiry"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => updateForm('message', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Please provide details about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className={`p-8 rounded-2xl shadow-lg ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Other Ways to Reach Us
              </h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-3xl">{method.icon}</div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {method.title}
                      </h3>
                      <p className={`text-sm mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {method.description}
                      </p>
                      <p className={`font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {method.contact}
                      </p>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {method.response}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className={`p-8 rounded-2xl shadow-lg ${
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index}>
                    <h3 className={`font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.question}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}