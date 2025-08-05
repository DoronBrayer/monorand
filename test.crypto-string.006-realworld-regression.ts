// test.crypto-string.006-realworld-regression.ts

import { test, expect, type Page } from '@playwright/test'

// Note: Correcting the assumed filename for this pair.
const testPageUrl = new URL('test.crypto-string.006b-webpage.html', import.meta.url).href

test.describe('E2E: cryptoString Real-World Regression', () => {
    let page: Page

    // Use 'beforeAll' to create a browser context and page ONCE.
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        await page.goto(testPageUrl)
        // Wait for the final element to be populated, ensuring the script has run.
        await expect(page.locator('#output06')).not.toContainText('incoming…', { timeout: 10000 })
    })

    // Use 'afterAll' to clean up the page and context.
    test.afterAll(async () => {
        await page.close()
    })

    test('should generate a default 16-character alphanumeric string', async () => {
        const outputLocator = page.locator('#output01')
        const resultText = await outputLocator.textContent()

        expect(resultText).toBeTruthy()
        expect(typeof resultText).toBe('string')
        expect(resultText?.length).toBe(16)
        // Basic check: Ensure it only contains alphanumeric characters (a-z, A-Z, 0-9)
        expect(resultText).toMatch(/^[a-zA-Z0-9]+$/)
    })

    test('should generate a hex string with specified length', async () => {
        const outputLocator = page.locator('#output02')
        const resultText = await outputLocator.textContent()

        expect(resultText).toBeTruthy()
        expect(typeof resultText).toBe('string')
        expect(resultText?.length).toBe(8)
        // Check: Ensure it only contains hex characters (0-9, a-f, A-F)
        expect(resultText).toMatch(/^[0-9a-fA-F]+$/)
    })

    test('should generate a string with a custom character set', async () => {
        const outputLocator = page.locator('#output03')
        const resultText = await outputLocator.textContent()

        expect(resultText).toBeTruthy()
        expect(typeof resultText).toBe('string')
        expect(resultText?.length).toBe(5)
        // Check: Ensure it only contains characters from the custom set '!@#$%'
        const customSet = '!@#$%'
        for (const char of resultText!) {
            expect(customSet).toContain(char)
        }
    })

    test('should generate different strings on subsequent calls with noRepeat', async () => {
        const output04Locator = page.locator('#output04')
        const output05Locator = page.locator('#output05')

        const result04 = await output04Locator.textContent()
        const result05 = await output05Locator.textContent()

        expect(result04).toBeTruthy()
        expect(result05).toBeTruthy()
        expect(result04?.length).toBe(6) // Check length for noRepeat string 1
        expect(result05?.length).toBe(10) // Check length for noRepeat string 2

        // Check uniqueness within each string (noRepeat feature)
        if (result04) {
            const uniqueChars04 = new Set(result04)
            expect(uniqueChars04.size).toBe(result04.length)
        }
        if (result05) {
            const uniqueChars05 = new Set(result05)
            expect(uniqueChars05.size).toBe(result05.length)
        }
    })

    test('should handle edge case of zero length correctly', async () => {
        const outputLocator = page.locator('#output06')
        const resultText = await outputLocator.textContent()

        expect(resultText).toBe('') // Expecting an empty string
    })
})
