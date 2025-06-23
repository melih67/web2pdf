import puppeteer from 'puppeteer'

export interface PdfGenerationOptions {
  url: string
  filename?: string
  quality?: 'low' | 'medium' | 'high'
}

// PDF generation queue to handle multiple requests efficiently
class PdfQueue {
  private static instance: PdfQueue
  private browser: any = null
  private isInitializing = false
  private queue: Array<() => Promise<void>> = []
  private processing = false

  static getInstance(): PdfQueue {
    if (!PdfQueue.instance) {
      PdfQueue.instance = new PdfQueue()
    }
    return PdfQueue.instance
  }

  async getBrowser() {
    if (this.browser && this.browser.connected) {
      return this.browser
    }

    if (this.isInitializing) {
      // Wait for initialization to complete
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.browser
    }

    this.isInitializing = true
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        timeout: 15000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      })
    } finally {
      this.isInitializing = false
    }
    return this.browser
  }

  async addToQueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        await task()
      }
    }
    this.processing = false
  }
}

export async function generatePdfFromUrl(options: PdfGenerationOptions): Promise<Buffer> {
  const { url, filename, quality = 'medium' } = options
  const pdfQueue = PdfQueue.getInstance()
  
  return pdfQueue.addToQueue(async () => {
    const browser = await pdfQueue.getBrowser()
    let page
    
    try {
      page = await browser.newPage()
      
      // Configure page based on quality
      const config = {
        low: { width: 800, height: 600, timeout: 10000 },
        medium: { width: 1200, height: 800, timeout: 15000 },
        high: { width: 1920, height: 1080, timeout: 25000 }
      }[quality]
      
      await page.setViewport({ width: config.width, height: config.height })
      page.setDefaultTimeout(config.timeout)
      
      // Navigate with retry logic
      let retries = 3
      while (retries > 0) {
        try {
          await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: config.timeout
          })
          break
        } catch (error) {
          retries--
          if (retries === 0) throw error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, quality === 'high' ? 3000 : 1500))
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        displayHeaderFooter: false,
        preferCSSPageSize: true
      })
      
      return pdfBuffer
    } finally {
      if (page) {
        try {
          await page.close()
        } catch (error) {
          console.warn('Error closing page:', error)
        }
      }
    }
  })
}

export async function extractPageTitle(url: string): Promise<string> {
  let browser
  let page
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      timeout: 30000,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--disable-gpu'
      ]
    })
    
    page = await browser.newPage()
    page.setDefaultTimeout(20000)
    page.setDefaultNavigationTimeout(20000)
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    
    const title = await page.title()
    return title || 'Untitled'
  } catch (error) {
    console.error('Error extracting page title:', error)
    return 'Untitled'
  } finally {
    // Ensure proper cleanup
    try {
      if (page && !page.isClosed()) {
        await page.close()
      }
    } catch (closeError) {
      console.warn('Error closing page:', closeError)
    }
    
    try {
      if (browser && browser.connected) {
        await browser.close()
      }
    } catch (closeError) {
      console.warn('Error closing browser:', closeError)
    }
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
    .substring(0, 50)
}