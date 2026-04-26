import puppeteer from 'puppeteer-extra'
import scrapeProducts from './lazada.scraper.js'
import AppError from '../../../helpers/appError.helper.js'

// Mocking puppeteer-extra dan plugin stealth
jest.mock('puppeteer-extra', () => ({
  __esModule: true,
  default: {
    use: jest.fn(),
    launch: jest.fn(),
  }
}))

jest.mock('puppeteer-extra-plugin-stealth', () => {
  return jest.fn(() => ({}))
})

describe('Scraper Lazada (lazada.scraper.js)', () => {
  let mockPage
  let mockBrowser

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock function untuk Page
    mockPage = {
      setUserAgent: jest.fn().mockResolvedValue(true),
      goto: jest.fn().mockResolvedValue(true),
      waitForSelector: jest.fn().mockResolvedValue(true),
      content: jest.fn(), // Akan diisi HTML dummy di masing-masing test
    }

    // Setup mock function untuk Browser
    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(true),
    }

    // Jadikan puppeteer.launch() selalu me-return mockBrowser
    puppeteer.launch.mockResolvedValue(mockBrowser)
  })

  it('harus mengekstrak data produk (nama, harga, url, dan terjual) dengan benar dari HTML', async () => {
    // HTML Dummy yang meniru struktur DOM Lazada
    const dummyHtml = `
      <html>
        <body>
          <div data-qa-locator="product-item">
            <a title="Apple iPhone 14 Pro Max" href="//lazada.co.id/iphone14">Apple iPhone 14 Pro Max</a>
            <span>Rp 15.000.000</span>
            <div>1.5k Terjual</div>
          </div>
          <div data-qa-locator="product-item">
            <a title="iPhone 13" href="https://lazada.co.id/iphone13">iPhone 13</a>
            <span>Rp 10.500.000</span>
            <div>500 Terjual</div>
          </div>
        </body>
      </html>
    `
    mockPage.content.mockResolvedValue(dummyHtml)

    const keyword = 'iphone'
    const results = await scrapeProducts(keyword)

    // Pengecekan pemanggilan puppeteer
    expect(puppeteer.launch).toHaveBeenCalledTimes(1)
    expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
    expect(mockPage.goto).toHaveBeenCalledWith(
      `https://www.lazada.co.id/catalog/?q=${encodeURIComponent(keyword)}`,
      { waitUntil: 'networkidle2' }
    )
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)

    // Pengecekan hasil ekstraksi (Cheerio logic)
    expect(results).toHaveLength(2)
    
    // Produk 1 (Cek Regex Harga dan Konversi 1.5k -> 1500)
    expect(results[0]).toEqual({
      title: 'Apple iPhone 14 Pro Max',
      price: 15000000,
      rating: null,
      total_sold: 1500,
      source: 'scraping',
      store_name: null,
      product_url: 'https://lazada.co.id/iphone14', // // menjadi https://
    })

    // Produk 2 (Cek URL normal dan teks terjual biasa)
    expect(results[1]).toEqual({
      title: 'iPhone 13',
      price: 10500000,
      rating: null,
      total_sold: 500,
      source: 'scraping',
      store_name: null,
      product_url: 'https://lazada.co.id/iphone13',
    })
  })

  it('harus mengembalikan array kosong jika halaman tidak memuat elemen produk', async () => {
    // Skenario jika terkena blokir atau produk tidak ada
    mockPage.waitForSelector.mockRejectedValueOnce(new Error('Timeout Error'))
    mockPage.content.mockResolvedValue('<html><body><h1>Tidak ada produk</h1></body></html>')

    // Menonaktifkan console.log sementara agar terminal test bersih
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const results = await scrapeProducts('macbook')

    expect(consoleSpy).toHaveBeenCalledWith('[Warning] Gagal memuat halaman produk atau produk tidak ditemukan.')
    expect(results).toHaveLength(0)
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  it('harus melempar AppError jika Puppeteer gagal berjalan (misal: browser error)', async () => {
    // Skenario error fatal di mana browser gagal launch (misal ENOENT seperti error sebelumnya)
    const errorMessage = 'Failed to launch the browser process'
    puppeteer.launch.mockRejectedValue(new Error(errorMessage))

    await expect(scrapeProducts('iphone')).rejects.toThrow(AppError)
    await expect(scrapeProducts('iphone')).rejects.toThrow(`Failed to scrape products with Puppeteer: ${errorMessage}`)
  })
})