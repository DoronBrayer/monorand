// /shuffrand/test.crypto-shuffle.007-realworld-regression.ts

import { expect, type Page, test } from '@playwright/test'

const testPageUrl = new URL('test.crypto-shuffle.007b-webpage.html', import.meta.url).href

test.describe('E2E: cryptoShuffle Real-World Regression', () => {
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

    test('should return an empty array with default parameters', async () => {
        const outputLocator = page.locator('#output01')
        const resultText = await outputLocator.textContent()
        expect(resultText).toBe('[]')
    })

    test('should perform a destructive shuffle correctly', async () => {
        const outputLocator = page.locator('#output02')
        const resultText = await outputLocator.textContent()
        // The result should be a permutation of ['x', 'y', 'z']
        const resultArray = JSON.parse(resultText ?? '[]')
        expect(resultArray).toEqual(expect.arrayContaining(['x', 'y', 'z']))
        expect(resultArray.length).toBe(3)
        // Note: We don't assert the specific order as it's random,
        // just that it's a valid permutation.
    })

    test('should handle preventIdentical correctly', async () => {
        const outputLocator = page.locator('#output03')
        const resultText = await outputLocator.textContent()
        // The result should be a permutation of ['x', 'y'] but NOT ['x', 'y'] itself.
        // For a 2-element array with preventIdentical, the only other permutation is ['y', 'x'].
        expect(resultText).toBe('["y","x"]')
    })

    test('should shuffle a subarray correctly', async () => {
        const outputLocator = page.locator('#output04')
        const resultText = await outputLocator.textContent()
        const resultArray = JSON.parse(resultText ?? '[]')

        // Check length
        expect(resultArray.length).toBe(26)

        // Check elements before startIndex (index 2) are unchanged
        expect(resultArray[0]).toBe('a')
        expect(resultArray[1]).toBe('b')

        // Check elements after endIndex (index 24, exclusive, so index 23) are unchanged
        // endIndex is 24, so index 24 ('y') and 25 ('z') should be unchanged
        expect(resultArray.at(-2)).toBe('y')
        expect(resultArray.at(-1)).toBe('z')

        // Check that the subarray from index 2 to 23 (indices 2-23, elements 'c'-'x')
        // has been shuffled (is a permutation of the original subarray)
        const originalSubarray = 'cdefghijklmnopqrstuvwx'.split('') // 'c' to 'x' = 22 chars
        const shuffledSubarray = resultArray.slice(2, 24) // Elements from index 2 to 23
        expect(shuffledSubarray).toEqual(expect.arrayContaining(originalSubarray))
        expect(shuffledSubarray.length).toBe(originalSubarray.length)

        // Verify the entire result contains all original letters
        const originalFullArray = 'abcdefghijklmnopqrstuvwxyz'.split('')
        expect(resultArray).toEqual(expect.arrayContaining(originalFullArray))
    })
})
