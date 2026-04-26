import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import AppError from '../../../helpers/appError.helper.js'

// Aktifkan plugin stealth untuk membypass deteksi Anti-bot/Captcha
puppeteer.use(StealthPlugin())

const scrapeProducts = async (keyword) => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ],
      executablePath: '/usr/bin/chromium-browser'
    }) 
    const page = await browser.newPage()
    
    // Set User-Agent asli agar tidak langsung diblokir oleh anti-bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
    
    // Pencarian dinamis menggunakan parameter keyword
    const searchUrl = `https://www.lazada.co.id/catalog/?q=${encodeURIComponent(keyword)}`
    await page.goto(searchUrl, { waitUntil: 'networkidle2' })
    
    try {
      await page.waitForSelector('[data-qa-locator="product-item"]', { timeout: 15000 })
    } catch (error) {
      throw new AppError('Failed to load product items on Lazada page. The structure of the page may have changed or the selector is incorrect.', 500)
    }

    const content = await page.content()
    await browser.close()

    const $ = cheerio.load(content)
    const productCards = $('[data-qa-locator="product-item"]')
    
    const results = []

    productCards.each((i, el) => {
      const title = $(el).find('a[title]').attr('title') || $(el).find('a').first().text().trim()
      
      // Konversi "Rp 10.000.000" menjadi Integer: 10000000
      const hargaTeks = $(el).find('span').filter((index, element) => $(element).text().includes('Rp')).first().text().trim()
      const priceStr = hargaTeks.replace(/[^0-9]/g, '')
      const price = priceStr ? parseInt(priceStr, 10) : 0
      
      // Parsing URL (di Lazada URL biasanya berawalan // sehingga perlu ditambah https:)
      const rawUrl = $(el).find('a').attr('href')
      const product_url = rawUrl ? (rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl) : null

      // Ekstraksi "jumlah terjual" (Mendukung "Terjual" dan "sold")
      let total_sold = 0
      const cardText = $(el).text().toLowerCase()
      const soldMatch = cardText.match(/(\d+[\.,]?\d*)[k\+]*\s*(terjual|sold)/i)
      if (soldMatch) {
         let soldStr = soldMatch[1].replace(',', '.')
         if (soldMatch[0].toLowerCase().includes('k')) {
            total_sold = Math.floor(parseFloat(soldStr) * 1000)
         } else {
            total_sold = parseInt(soldStr, 10)
         }
      }

      // Lazada tidak selalu menampilkkan rating di halaman kategori, jadi di set null saja 
      let rating = null

      // Percobaan ekstraksi Nama Toko
      // Di Lazada, nama toko tidak di tampilkan 
      let store_name = null
      
      // Fallback (opsi cadangan) mencari nama toko dari teks link terakhir di bawah
      if (!store_name) {
         const allLinks = $(el).find('a')
         if (allLinks.length > 1) {
            const lastLinkText = allLinks.last().text().trim()
            if (lastLinkText && lastLinkText !== title) store_name = lastLinkText
         }
      }

      if (title && price > 0) {
        results.push({
          title,
          price,
          rating,
          total_sold,
          source: 'scraping',   // Sesuai dengan enum Prisma "Source"
          store_name,
          product_url
        })

        // Hentikan proses iterasi jika array results sudah terisi 10 data
        if (results.length >= 10) {
          return false
        }
      }
    })
    return results
    
  } catch (error) {
    throw new AppError(`Failed to scrape products with Puppeteer: ${error.message}`, 500)
  }
}

export default scrapeProducts

