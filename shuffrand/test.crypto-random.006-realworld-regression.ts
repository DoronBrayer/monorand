// ./shuffrand/test.crypto-random.006-realworld-regression.ts

import { expect, type Page, test } from '@playwright/test'

const testPageUrl = new URL('test.crypto-random.006b-webpage.html', import.meta.url).href

test.describe('E2E: cryptoRandom Real-World Regression', () => {
    let page: Page

    // Use 'beforeAll' to create a browser context and page ONCE.
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        await page.goto(testPageUrl)
        // Wait for the final element to be populated, ensuring the script has run.
        await expect(page.locator('#output04')).not.toContainText('incoming…', { timeout: 10000 })
    })

    // Use 'afterAll' to clean up the page and context.
    test.afterAll(async () => {
        await page.close()
    })

    test('should produce a valid integer with default parameters', async () => {
        const outputLocator = page.locator('#output01')
        const resultText = await outputLocator.textContent()
        const resultNumber = Number(resultText)
        expect([0, 1, 2]).toContain(resultNumber)
    })

    test('should produce a valid double when specified', async () => {
        const outputLocator = page.locator('#output02')
        const resultText = await outputLocator.textContent()
        const resultNumber = Number(resultText)
        expect(Number.isInteger(resultNumber)).toBe(false)
        expect(resultNumber).toBeGreaterThanOrEqual(0.001)
        expect(resultNumber).toBeLessThanOrEqual(1.999)
    })

    test('should respect custom integer bounds', async () => {
        const outputLocator = page.locator('#output03')
        const resultText = await outputLocator.textContent()
        const resultNumber = Number(resultText)
        expect(resultNumber).toBeGreaterThanOrEqual(4000)
        expect(resultNumber).toBeLessThanOrEqual(4999)
    })

    test('should respect exclusion rules with default bounds', async () => {
        const outputLocator = page.locator('#output04')
        const resultText = await outputLocator.textContent()
        const resultNumber = Number(resultText)
        expect([1, 2]).toContain(resultNumber)
    })
})
