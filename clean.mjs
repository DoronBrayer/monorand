// ./clean.mjs

import { rmSync, readdirSync } from 'fs'
import { join } from 'path'

const dirsToRemove = ['dist', 'reports']

try {
    // Get all top-level directories (i.e., packages)
    const packages = readdirSync('.', { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && dirent.name !== 'node_modules')
        .map((dirent) => dirent.name)

    // Clean directories in the monorepo root
    for (const dir of dirsToRemove) {
        rmSync(dir, { recursive: true, force: true })
    }

    // Clean directories within each package
    for (const pkg of packages) {
        for (const dir of dirsToRemove) {
            const packagePath = join(pkg, dir)
            rmSync(packagePath, { recursive: true, force: true })
        }
    }

    console.log(`✓ The cleanup has been SUCCESSfully completed.`)
} catch {
    console.log(`The cleanup has been skipped—nothing to remove.`)
}
