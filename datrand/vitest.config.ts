// ./datrand/vitest.config.ts | Package build configuration
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from '../vitest.config.ts'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            // The brutal truth: You must specify a pattern for Vitest to find your test files.
            // This pattern is more flexible for all test files in the directory.
            include: ['test.*.ts']
        }
    })
)
