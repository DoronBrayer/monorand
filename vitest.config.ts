// ./vitest.config.ts | Monorepo test configuration

import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        reporters: ['verbose'],
        include: ['**/*.test.ts', '**/*.spec.ts', '**/test.*.ts', '**/spec.*.ts'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.d.ts',
            '**/*benchmark.ts',
            '**/*regression.ts',
            '**/*e2e.ts',
            '**/test.types.ts',
            '**/test.util.*.ts'
        ],
        globals: true,
        environment: 'node',
        outputFile: './reports/vitest-default.json'
    },
    resolve: {
        alias: {
            shuffrand: path.resolve(__dirname, './shuffrand/'),
            datrand: path.resolve(__dirname, './datrand/')
        }
    }
})
