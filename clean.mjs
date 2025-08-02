// clean.mjs
// This script removes the 'dist' directory, which is typically used for build outputs.
// It uses Node.js’s 'fs' module to perform the deletion synchronously.
// The 'recursive' option allows for deleting directories and their contents, and 'force' ensures
// that the operation does not fail if the directory does not exist.

import { rmSync } from 'fs'

try {
    rmSync('./dist', { recursive: true, force: true })
    console.log(`✓\u200AThe cleanup has been SUCCESSfully completed.`)
} catch {
    console.log(`The cleanup has been skipped\u200A—\u200Anothing to remove.`)
}
