// Variable and Function Renaming Module

class Renaming {
    constructor() {
        this.characterSets = {
            jawa: this.getJawaCharacters(),
            arab: this.getArabCharacters(),
            chinese: this.getChineseCharacters(),
            emoji: this.getEmojiCharacters(),
            mixed: this.getMixedCharacters()
        };
        
        this.reservedWords = new Set([
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while', 'goto'
        ]);
        
        this.luauReserved = new Set([
            'continue', 'type', 'typeof'
        ]);
        
        this.builtinFunctions = new Set([
            'print', 'require', 'tostring', 'tonumber', 'type', 'next',
            'pairs', 'ipairs', 'pcall', 'xpcall', 'assert', 'error',
            'getfenv', 'setfenv', 'getmetatable', 'setmetatable',
            'rawget', 'rawset', 'rawequal', 'loadstring', 'dofile',
            'loadfile', 'module', 'select', 'unpack', 'coroutine',
            'string', 'table', 'math', 'bit32', 'io', 'os', 'debug'
        ]);
    }

    renameIdentifiers(code, renameType = 'mixed', obfuscateBuiltin = true) {
        // Extract all identifiers
        const identifiers = this.extractIdentifiers(code);
        
        // Generate new names
        const nameMap = new Map();
        const characterSet = this.characterSets[renameType] || this.characterSets.mixed;
        
        identifiers.forEach(ident => {
            if (!this.reservedWords.has(ident) && 
                !this.luauReserved.has(ident) &&
                !(obfuscateBuiltin && this.builtinFunctions.has(ident))) {
                
                if (!nameMap.has(ident)) {
                    let newName;
                    do {
                        newName = this.generateName(characterSet, renameType);
                    } while (nameMap.has(newName) || this.reservedWords.has(newName));
                    
                    nameMap.set(ident, newName);
                }
            }
        });
        
        // Replace identifiers in code
        let result = code;
        
        // Sort by length (longest first) to avoid partial replacements
        const sortedIdents = Array.from(nameMap.entries())
            .sort((a, b) => b[0].length - a[0].length);
        
        sortedIdents.forEach(([oldName, newName]) => {
            // Use regex with word boundaries to avoid partial replacements
            const regex = new RegExp(`\\b${this.escapeRegExp(oldName)}\\b`, 'g');
            result = result.replace(regex, newName);
        });
        
        return result;
    }

    extractIdentifiers(code) {
        const identifiers = new Set();
        
        // Match variable names and function names
        const patterns = [
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g,  // Variable assignment
            /\bfunction\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,  // Function definition
            /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,  // Local variables
            /\.([a-zA-Z_][a-zA-Z0-9_]*)\b/g,  // Table keys
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g  // Function calls
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                identifiers.add(match[1]);
            }
        });
        
        return Array.from(identifiers);
    }

    generateName(characterSet, type) {
        const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
        
        let name = '';
        
        if (type === 'emoji') {
            // For emoji, use a single emoji with numbers
            name = characterSet[Math.floor(Math.random() * characterSet.length)] +
                   Math.floor(Math.random() * 1000);
        } else if (type === 'mixed') {
            // Mix different character sets
            const sets = [
                this.characterSets.jawa,
                this.characterSets.arab,
                this.characterSets.chinese,
                this.getAsciiCharacters()
            ];
            
            for (let i = 0; i < length; i++) {
                const set = sets[Math.floor(Math.random() * sets.length)];
                name += set[Math.floor(Math.random() * set.length)];
            }
        } else {
            // Use specified character set
            for (let i = 0; i < length; i++) {
                name += characterSet[Math.floor(Math.random() * characterSet.length)];
            }
        }
        
        return name;
    }

    getJawaCharacters() {
        // Aksara Jawa characters
        return [
            'ꦄ', 'ꦅ', 'ꦆ', 'ꦇ', 'ꦈ', 'ꦉ', 'ꦊ', 'ꦋ', 'ꦌ', 'ꦍ',
            'ꦎ', 'ꦏ', 'ꦐ', 'ꦑ', 'ꦒ', 'ꦓ', 'ꦔ', 'ꦕ', 'ꦖ', 'ꦗ',
            'ꦘ', 'ꦙ', 'ꦚ', 'ꦛ', 'ꦜ', 'ꦝ', 'ꦞ', 'ꦟ', 'ꦠ', 'ꦡ',
            'ꦢ', 'ꦣ', 'ꦤ', 'ꦥ', 'ꦦ', 'ꦧ', 'ꦨ', 'ꦩ', 'ꦪ', 'ꦫ',
            'ꦬ', 'ꦭ', 'ꦮ', 'ꦯ', 'ꦰ', 'ꦱ', 'ꦲ', 'ꦄ', 'ꦅ', 'ꦆ'
        ];
    }

    getArabCharacters() {
        // Arabic characters
        return [
            'ء', 'آ', 'أ', 'ؤ', 'إ', 'ئ', 'ا', 'ب', 'ة', 'ت',
            'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
            'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل',
            'م', 'ن', 'ه', 'و', 'ى', 'ي', '٠', '١', '٢', '٣',
            '٤', '٥', '٦', '٧', '٨', '٩'
        ];
    }

    getChineseCharacters() {
        // Chinese characters (common ones)
        return [
            '的', '一', '是', '在', '不', '了', '有', '和', '人', '这',
            '中', '大', '为', '上', '个', '国', '我', '以', '要', '他',
            '时', '来', '用', '们', '生', '到', '作', '地', '于', '出',
            '就', '分', '对', '成', '会', '可', '主', '发', '年', '动',
            '同', '工', '也', '能', '下', '过', '子', '说', '产', '种'
        ];
    }

    getEmojiCharacters() {
        return [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
            '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
            '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
            '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
            '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬'
        ];
    }

    getMixedCharacters() {
        return [
            ...this.getAsciiCharacters(),
            ...this.getJawaCharacters().slice(0, 10),
            ...this.getArabCharacters().slice(0, 10),
            ...this.getChineseCharacters().slice(0, 10),
            ...this.getEmojiCharacters().slice(0, 10)
        ];
    }

    getAsciiCharacters() {
        const chars = [];
        for (let i = 65; i <= 90; i++) chars.push(String.fromCharCode(i)); // A-Z
        for (let i = 97; i <= 122; i++) chars.push(String.fromCharCode(i)); // a-z
        for (let i = 48; i <= 57; i++) chars.push(String.fromCharCode(i)); // 0-9
        chars.push('_', '$');
        return chars;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
