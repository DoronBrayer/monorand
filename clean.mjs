import { rmSync } from 'fs'

try {
    rmSync('./dist', { recursive: true, force: true })
    console.log('✓ Clean complete')
} catch {
    console.log('Clean: nothing to remove')
}
