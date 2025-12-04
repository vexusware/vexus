// Utility Functions for ZiaanVeil Obfuscator

class ZiaanVeilUtils {
    constructor() {
        // Character sets for various purposes
        this.characterSets = {
            // Basic character sets
            alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            hex: '0123456789ABCDEF',
            base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            
            // Unicode character sets for renaming
            javanese: this.generateJavaneseSet(),
            chinese: this.generateChineseSet(),
            arabic: this.generateArabicSet(),
            emoji: this.generateEmojiSet(),
            mathematical: this.generateMathematicalSet(),
            
            // Special sets
            invisible: '\u200B\u200C\u200D\u2060\uFEFF', // Zero-width characters
            confusing: 'Il1O0', // Easily confused characters
        };
        
        // Lua keywords and reserved words
        this.luaKeywords = [
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
            'function', 'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 
            'repeat', 'return', 'then', 'true', 'until', 'while'
        ];
        
        // Roblox API functions to preserve
        this.robloxAPI = [
            // Services
            'game', 'Workspace', 'Players', 'Lighting', 'ReplicatedStorage',
            'ServerStorage', 'ServerScriptService', 'StarterPlayer', 'StarterGui',
            'StarterPack', 'UserInputService', 'RunService', 'HttpService',
            'TweenService', 'PathfindingService', 'MarketplaceService',
            
            // Common functions
            'wait', 'spawn', 'delay', 'tick', 'time', 'clock', 'date',
            'difftime', 'print', 'warn', 'error', 'assert', 'pcall', 'xpcall',
            
            // Table functions
            'table', 'concat', 'insert', 'remove', 'sort',
            
            // String functions
            'string', 'sub', 'find', 'gsub', 'gmatch', 'match', 'rep',
            'reverse', 'byte', 'char', 'format', 'len', 'lower', 'upper',
            
            // Math functions
            'math', 'abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos',
            'cosh', 'deg', 'exp', 'floor', 'fmod', 'frexp', 'ldexp', 'log',
            'log10', 'max', 'min', 'modf', 'pow', 'rad', 'random', 'randomseed',
            'sin', 'sinh', 'sqrt', 'tan', 'tanh',
            
            // Bit32 functions
            'bit32', 'band', 'bnot', 'bor', 'bxor', 'btest', 'extract',
            'replace', 'lshift', 'rshift', 'arshift',
            
            // Coroutine functions
            'coroutine', 'create', 'resume', 'running', 'status', 'wrap', 'yield'
        ];
    }
    
    // Generate Javanese character set
    generateJavaneseSet() {
        // Javanese script Unicode range
        const javanese = [];
        for (let i = 0xA980; i <= 0xA9DF; i++) {
            javanese.push(String.fromCharCode(i));
        }
        return javanese.join('');
    }
    
    // Generate Chinese character set
    generateChineseSet() {
        // Common Chinese characters
        return '的一是不了人我在有他这为之大来以个中上们' +
               '到说国和地也子时道出而要于就下得可你年生' +
               '自会那后能对着事其里所去行过家十用发天如' +
               '然作方成者多日都三小军二无同么经法当起与' +
               '好看学进种将还分此心前面又定见只主没公从' +
               '今天内去因件利相由化及本很代名想意体全点';
    }
    
    // Generate Arabic character set
    generateArabicSet() {
        // Arabic script Unicode range
        const arabic = [];
        for (let i = 0x0600; i <= 0x06FF; i++) {
            arabic.push(String.fromCharCode(i));
        }
        return arabic.join('');
    }
    
    // Generate emoji set
    generateEmojiSet() {
        // Common emojis
        return '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚' +
               '😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹😣' +
               '😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓' +
               '🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪' +
               '😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀' +
               '☠👽👾🤖🎃😺😸😹😻😼😽🙀😿😾';
    }
    
    // Generate mathematical symbols set
    generateMathematicalSet() {
        // Mathematical operators and symbols
        const mathSymbols = [];
        for (let i = 0x2200; i <= 0x22FF; i++) {
            mathSymbols.push(String.fromCharCode(i));
        }
        return mathSymbols.join('');
    }
    
    // Generate random string of specified length and character set
    randomString(length = 10, charset = 'alphanumeric') {
        const chars = this.characterSets[charset] || this.characterSets.alphanumeric;
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }
    
    // Generate random identifier name based on style
    randomIdentifier(style = 'unicode', length = null) {
        let charset;
        
        switch (style) {
            case 'javanese':
                charset = this.characterSets.javanese;
                break;
            case 'chinese':
                charset = this.characterSets.chinese;
                break;
            case 'arabic':
                charset = this.characterSets.arabic;
                break;
            case 'emoji':
                charset = this.characterSets.emoji;
                break;
            case 'mathematical':
                charset = this.characterSets.mathematical;
                break;
            case 'invisible':
                charset = this.characterSets.invisible;
                break;
            case 'unicode':
                // Mix of various Unicode characters
                charset = this.characterSets.javanese + 
                         this.characterSets.chinese + 
                         this.characterSets.arabic +
                         this.characterSets.mathematical;
                break;
            default:
                charset = this.characterSets.alphanumeric;
        }
        
        const actualLength = length || (Math.floor(Math.random() * 3) + 2);
        return this.randomString(actualLength, charset);
    }
    
    // Generate a random number with arithmetic obfuscation
    obfuscatedNumber(value) {
        if (value === 0) return '0';
        if (value === 1) return '1';
        
        const methods = [
            // Multiplication/division
            () => `(${value * 2} / 2)`,
            () => `(${value * 3} / 3)`,
            () => `(${value * 5} / 5)`,
            
            // Addition/subtraction
            () => `(${value + 17} - 17)`,
            () => `(${value + 42} - 42)`,
            () => `(${value + 100} - 100)`,
            
            // Bitwise operations
            () => `bit32.bxor(${value ^ 0xFF}, ${0xFF})`,
            () => `bit32.band(${value | 0xF0}, ${0x0F})`,
            () => `bit32.bor(${value & 0x0F}, ${0xF0})`,
            
            // Complex expressions
            () => `(math.floor(${value * 1.5} / 1.5))`,
            () => `(math.ceil(${value * 0.75} / 0.75))`,
            () => `(tonumber("${value}"))`,
        ];
        
        return methods[Math.floor(Math.random() * methods.length)]();
    }
    
    // Obfuscate boolean value
    obfuscatedBoolean(value) {
        const trueExpressions = [
            'not false',
            '1 == 1',
            '2 > 1',
            '3 >= 3',
            '5 ~= 6',
            '("a" == "a")',
            '(function() return true end)()',
            'type({}) == "table"',
            'tonumber("1") == 1',
            'bit32.band(1, 1) == 1'
        ];
        
        const falseExpressions = [
            'not true',
            '1 == 2',
            '2 < 1',
            '3 <= 2',
            '5 == 6',
            '("a" == "b")',
            '(function() return false end)()',
            'type(nil) == "nil"',
            'tonumber("a") == nil',
            'bit32.band(1, 0) == 1'
        ];
        
        const expressions = value ? trueExpressions : falseExpressions;
        return expressions[Math.floor(Math.random() * expressions.length)];
    }
    
    // Obfuscate nil value
    obfuscatedNil() {
        const expressions = [
            '(function() return end)()',
            '(({}).nonexistent)',
            'type(function() end) == "nil" and nil or nil',
            'select(2, pcall(error))',
            'rawget({}, "key")'
        ];
        
        return expressions[Math.floor(Math.random() * expressions.length)];
    }
    
    // Hash a string to a consistent integer
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    // Generate a seeded random number generator
    createSeededRandom(seed) {
        let state = this.hashString(seed);
        
        return function() {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        };
    }
    
    // Convert string to hexadecimal
    stringToHex(str) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return hex;
    }
    
    // Convert hexadecimal to string
    hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }
    
    // Base64 encode (browser-safe)
    base64Encode(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode('0x' + p1);
            }));
        } catch (e) {
            // Fallback for Unicode strings
            const bytes = new TextEncoder().encode(str);
            const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
            return btoa(binString);
        }
    }
    
    // Base64 decode (browser-safe)
    base64Decode(str) {
        try {
            return decodeURIComponent(atob(str).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            // Fallback
            const binString = atob(str);
            const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
            return new TextDecoder().decode(bytes);
        }
    }
    
    // Split string into chunks
    chunkString(str, chunkSize) {
        const chunks = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            chunks.push(str.substring(i, i + chunkSize));
        }
        return chunks;
    }
    
    // Shuffle array using Fisher-Yates algorithm
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Escape string for Lua
    escapeLuaString(str) {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/\v/g, '\\v')
            .replace(/\f/g, '\\f')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]');
    }
    
    // Unescape Lua string
    unescapeLuaString(str) {
        return str
            .replace(/\\\\/g, '\\')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\v/g, '\v')
            .replace(/\\f/g, '\f')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');
    }
    
    // Validate Lua syntax (basic validation)
    validateLuaSyntax(code) {
        const errors = [];
        
        // Check for unmatched quotes
        let inString = false;
        let stringChar = '';
        let escapeNext = false;
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
            } else if (inString && char === stringChar) {
                inString = false;
                stringChar = '';
            }
        }
        
        if (inString) {
            errors.push('Unterminated string literal');
        }
        
        // Check for basic bracket matching
        const stack = [];
        const bracketPairs = {
            '(': ')',
            '[': ']',
            '{': '}'
        };
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            
            // Skip brackets inside strings
            if (inString) {
                // Check if we're ending the string
                if (char === stringChar && code[i-1] !== '\\') {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            // Check for string start
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                continue;
            }
            
            // Handle brackets
            if (bracketPairs[char]) {
                stack.push(char);
            } else if (Object.values(bracketPairs).includes(char)) {
                const last = stack.pop();
                if (!last || bracketPairs[last] !== char) {
                    errors.push(`Mismatched bracket: ${char} at position ${i}`);
                }
            }
        }
        
        if (stack.length > 0) {
            errors.push(`Unclosed brackets: ${stack.join(', ')}`);
        }
        
        // Check for common syntax errors
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            // Check for "then" without "if"
            if (line.includes('then') && !line.includes('if') && !line.includes('elseif')) {
                errors.push(`Line ${index + 1}: 'then' without 'if' or 'elseif'`);
            }
            
            // Check for "end" without block start
            if (line.includes('end') && 
                !line.includes('function') && 
                !line.includes('if') && 
                !line.includes('for') && 
                !line.includes('while') && 
                !line.includes('repeat')) {
                // This is a weak check, but can catch some errors
            }
        });
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: []
        };
    }
    
    // Minify Lua code
    minifyLua(code, aggressive = false) {
        let minified = code;
        
        // Remove comments
        minified = minified.replace(/--\[\[[\s\S]*?\]\]/g, ''); // Multi-line comments
        minified = minified.replace(/--[^\n]*/g, ''); // Single-line comments
        
        if (aggressive) {
            // Remove all unnecessary whitespace
            minified = minified
                .replace(/\s+/g, ' ')
                .replace(/\s*([=+\-*/%^<>~(){}[\],;])\s*/g, '$1')
                .replace(/\s*\.\.\.\s*/g, '...')
                .replace(/\s*\.\.\s*/g, '..')
                .replace(/\s*:\s*/g, ':')
                .replace(/\s*\.\s*/g, '.')
                .trim();
            
            // Remove unnecessary semicolons
            minified = minified.replace(/;(\s*[)}\]])/g, '$1');
        } else {
            // Conservative minification
            minified = minified
                .replace(/\r\n/g, '\n') // Normalize line endings
                .replace(/\n\s*\n/g, '\n') // Remove empty lines
                .replace(/^\s+/gm, '') // Remove leading whitespace from lines
                .replace(/\s+$/gm, ''); // Remove trailing whitespace from lines
        }
        
        return minified;
    }
    
    // Calculate code metrics
    calculateCodeMetrics(code) {
        const lines = code.split('\n');
        const totalLines = lines.length;
        
        let codeLines = 0;
        let commentLines = 0;
        let emptyLines = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '') {
                emptyLines++;
            } else if (trimmed.startsWith('--')) {
                commentLines++;
            } else {
                codeLines++;
            }
        }
        
        const characters = code.length;
        const words = code.split(/\s+/).filter(word => word.length > 0).length;
        
        // Calculate complexity (simplified)
        const complexityIndicators = [
            (code.match(/\bif\b/g) || []).length,
            (code.match(/\bfor\b/g) || []).length,
            (code.match(/\bwhile\b/g) || []).length,
            (code.match(/\bfunction\b/g) || []).length,
            (code.match(/[{}]/g) || []).length / 2
        ];
        
        const complexity = complexityIndicators.reduce((a, b) => a + b, 0);
        
        return {
            totalLines,
            codeLines,
            commentLines,
            emptyLines,
            characters,
            words,
            complexity,
            readability: Math.max(0, 100 - (complexity * 5)) // Simple readability score
        };
    }
    
    // Generate a random Lua code snippet (for testing)
    generateRandomLuaSnippet(complexity = 'medium') {
        const snippets = {
            simple: `local x = 10
local y = 20
local sum = x + y
print("Sum: " .. sum)`,

            medium: `function calculateArea(radius)
    local pi = 3.14159
    return pi * radius * radius
end

local r = 5
local area = calculateArea(r)
print("Area of circle with radius " .. r .. " is " .. area)`,

            complex: `local function fibonacci(n)
    if n <= 1 then
        return n
    end
    return fibonacci(n - 1) + fibonacci(n - 2)
end

local function processTable(tbl)
    local result = {}
    for key, value in pairs(tbl) do
        if type(value) == "number" then
            result[key] = value * 2
        elseif type(value) == "string" then
            result[key] = string.upper(value)
        end
    end
    return result
end

local data = {a = 1, b = "hello", c = 3.14}
local processed = processTable(data)
for k, v in pairs(processed) do
    print(k .. ": " .. tostring(v))
end`
        };
        
        return snippets[complexity] || snippets.medium;
    }
    
    // Check if identifier should be preserved (Roblox API, Lua keywords, etc.)
    shouldPreserveIdentifier(identifier) {
        // Check Lua keywords
        if (this.luaKeywords.includes(identifier)) {
            return true;
        }
        
        // Check Roblox API (case-sensitive)
        if (this.robloxAPI.includes(identifier)) {
            return true;
        }
        
        // Check if it's a common pattern (like _G, _VERSION, etc.)
        const preservedPatterns = [
            /^_[A-Z]/,
            /^[A-Z][A-Z0-9_]*$/,
            /^[A-Z]/ // Preserve likely class names
        ];
        
        for (const pattern of preservedPatterns) {
            if (pattern.test(identifier)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Generate a unique ID
    generateUniqueId(length = 8) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2);
        const id = (timestamp + random).substr(-length);
        return id.padStart(length, '0');
    }
    
    // Format code with indentation
    formatCode(code, indentSize = 4) {
        const lines = code.split('\n');
        let indentLevel = 0;
        const indentStr = ' '.repeat(indentSize);
        const formatted = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                formatted.push('');
                continue;
            }
            
            // Decrease indent before certain keywords
            if (trimmed.startsWith('end') || 
                trimmed.startsWith('else') || 
                trimmed.startsWith('elseif') ||
                trimmed.startsWith('until')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Add indentation
            formatted.push(indentStr.repeat(indentLevel) + trimmed);
            
            // Increase indent after certain keywords
            if (trimmed.endsWith('then') || 
                trimmed.startsWith('function') ||
                trimmed.startsWith('do') ||
                trimmed.startsWith('repeat') ||
                (trimmed.includes('=') && trimmed.includes('function'))) {
                indentLevel++;
            }
            
            // Special handling for if/elseif
            if (trimmed.startsWith('if') || trimmed.startsWith('elseif')) {
                if (!trimmed.endsWith('then')) {
                    indentLevel++;
                }
            }
        }
        
        return formatted.join('\n');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ZiaanVeilUtils = new ZiaanVeilUtils();
}
