class ZiaanUtils {
    static randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static xorEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    static base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
    }

    static base64Decode(str) {
        return decodeURIComponent(atob(str).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    static generateRandomMathExpression(value) {
        const operations = [
            { op: '+', val: this.randomInt(1, 100) },
            { op: '-', val: this.randomInt(1, 100) },
            { op: '*', val: this.randomInt(2, 5) },
            { op: '/', val: this.randomInt(2, 5) },
            { op: '^', val: 2 }
        ];
        
        const operation = operations[this.randomInt(0, operations.length - 1)];
        
        switch(operation.op) {
            case '+':
                return `(${value + operation.val} - ${operation.val})`;
            case '-':
                return `(${value - operation.val} + ${operation.val})`;
            case '*':
                return `(${value * operation.val} / ${operation.val})`;
            case '/':
                return `(${value / operation.val} * ${operation.val})`;
            case '^':
                return `math.sqrt(${value * value})`;
            default:
                return value.toString();
        }
    }

    static getUnicodeCharset(name) {
        const charsets = {
            javanese: ['ꦄ', 'ꦅ', 'ꦆ', 'ꦇ', 'ꦈ', 'ꦉ', 'ꦊ', 'ꦋ', 'ꦌ', 'ꦍ', 'ꦎ', 'ꦏ', 'ꦐ', 'ꦑ', 'ꦒ', 'ꦓ', 'ꦔ', 'ꦕ', 'ꦖ', 'ꦗ', 'ꦘ', 'ꦙ', 'ꦚ', 'ꦛ', 'ꦜ', 'ꦝ', 'ꦞ', 'ꦟ', 'ꦠ', 'ꦡ', 'ꦢ', 'ꦣ', 'ꦤ', 'ꦥ', 'ꦦ', 'ꦧ', 'ꦨ', 'ꦩ', 'ꦪ', 'ꦫ', 'ꦬ', 'ꦭ', 'ꦮ', 'ꦯ', 'ꦰ', 'ꦱ', 'ꦲ'],
            chinese: ['你', '好', '世', '界', '编', '码', '加', '密', '变', '量', '函', '数', '表', '达', '式', '逻', '辑', '运', '算', '符', '控', '制', '流', '程', '数', '据', '结', '构', '对', '象', '类', '型', '字', '符', '串', '数', '组', '列', '表', '集', '合', '映', '射', '枚', '举', '接', '口'],
            arabic: ['ء', 'آ', 'أ', 'ؤ', 'إ', 'ئ', 'ا', 'ب', 'ة', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ى', 'ي', 'ـ', 'ً', 'ٌ', 'ٍ', 'َ', 'ُ', 'ِ', 'ّ', 'ْ', 'ٰ'],
            emoji: ['😀', '😎', '🤖', '👾', '💀', '👻', '👽', '🤡', '💩', '🔥', '🌟', '💫', '✨', '⚡', '☄️', '💥', '🛸', '🚀', '🔮', '🎯', '🦄', '🐉', '🦖', '🦕', '🐲', '🌌', '🌠', '🪐', '☀️', '🌙', '⭐', '🌈', '☁️', '❄️', '🔥', '💧', '🌊'],
            unicode: ['⍺', '⍵', '⍶', '⍷', '⍸', '⍹', '⍺', '⎕', '⏎', '⌹', '⍋', '⍒', '⍉', '⌽', '⍟', '⍱', '⍲', '⍠', '⍡', '⍢', '⍣', '⍤', '⍥', '⍨', '⍩', '⍪', '⍫', '⍬', '⍭', '⍮', '⍯', '⍰', '⍳', '⍴', '⍵', '⍶', '⍷', '⍸', '⍹', '⍺']
        };
        
        return charsets[name] || charsets.javanese;
    }

    static generateRandomName(charset, length = 8) {
        const chars = this.getUnicodeCharset(charset);
        let name = '';
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static hexToBytes(hex) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return bytes;
    }

    static bytesToHex(bytes) {
        return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}
