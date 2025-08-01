### 🔐 Password Character Set Summary
| Category     | Characters Included                     | Count |
|--------------|------------------------------------------|-------|
| Lowercase    | `a` to `z`                               | 26    |
| Uppercase    | `A` to `Z`                               | 26    |
| Digits       | `0` to `9`                               | 10    |
| Special      | !"#$%&'()*+,-./:;<=>?@[]^_`{\|}~         | 31+2  |

_The `+2` in "Special" represents Backslash (`\`) and Space, which are optional_

✅ That **31-character special string** (or 33) includes *all* the standard non-alphanumeric symbols typically found on a US QWERTY keyboard.

So if we're crafting a password generator or validation function, our total pool is:
- **26 + 26 + 10 + 31 = 93 characters**
- **26 + 26 + 10 + 33 = 95 characters**