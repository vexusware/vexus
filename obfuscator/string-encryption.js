// String Encryption Module

class StringEncryption {
    constructor() {
        this.encryptionMethods = {
            xor: this.xorEncrypt.bind(this),
            base64: this.base64Encrypt.bind(this),
            reverse: this.reverseEncrypt.bind(this),
            custom: this.customEncrypt.bind(this)
        };
    }

    encryptStrings(code, settings) {
        // Find all strings in the code
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        
        return code.replace(stringRegex, (match) => {
            // Don't encrypt very short strings
            if (match.length <= 2) return match;
            
            // Don't encrypt strings that look like numbers
            if (/^["']\d+["']$/.test(match)) return match;
            
            // Extract string content without quotes
            const content = match.substring(1, match.length - 1);
            
            let encrypted = content;
            const methods = [];
            
            // Apply XOR encryption
            if (settings.useXOR) {
                const xorKey = this.parseXorKey(settings.xorKey);
                encrypted = this.encryptionMethods.xor(encrypted, xorKey);
                methods.push('XOR');
            }
            
            // Apply Base64 encoding
            if (settings.useBase64) {
                encrypted = this.encryptionMethods.base64(encrypted);
                methods.push('Base64');
            }
            
            // Generate decryption code
            const varName = this.generateVarName();
            const decryptionCode = this.generateDecryptionCode(varName, encrypted, methods.reverse(), settings);
            
            return decryptionCode;
        });
    }

    xorEncrypt(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key);
        }
        return result;
    }

    base64Encrypt(str) {
        // Simple Base64 implementation
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        let i = 0;
        
        do {
            const a = str.charCodeAt(i++);
            const b = str.charCodeAt(i++);
            const c = str.charCodeAt(i++);
            
            const bitmap = (a << 16) | (b << 8) | c;
            
            result += chars.charAt((bitmap >> 18) & 63)
                   + chars.charAt((bitmap >> 12) & 63)
                   + (b ? chars.charAt((bitmap >> 6) & 63) : '=')
                   + (c ? chars.charAt(bitmap & 63) : '=');
        } while (i < str.length);
        
        return result;
    }

    reverseEncrypt(str) {
        return str.split('').reverse().join('');
    }

    customEncrypt(str) {
        // Custom encryption with multiple transformations
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            // Apply multiple transformations
            let transformed = charCode;
            transformed = transformed ^ 0x55;
            transformed = ((transformed << 3) | (transformed >> 5)) & 0xFF;
            transformed = transformed ^ 0xAA;
            result += String.fromCharCode(transformed);
        }
        return result;
    }

    parseXorKey(keyStr) {
        if (keyStr.startsWith('0x')) {
            return parseInt(keyStr.substring(2), 16);
        }
        return parseInt(keyStr) || 0x5A;
    }

    generateVarName() {
        const prefixes = ['_', '__', '___'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let name = prefix;
        for (let i = 0; i < 8; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    }

    generateDecryptionCode(varName, encryptedStr, methods, settings) {
        let code = `(${this.generateDecryptionFunction(methods, settings)})("${this.escapeString(encryptedStr)}")`;
        
        // For multiple encryption layers, wrap the calls
        methods.forEach(method => {
            if (method === 'XOR') {
                const xorKey = this.parseXorKey(settings.xorKey);
                code = `(function(s) local r=""; for i=1,#s do r=r..string.char(string.byte(s,i)~${xorKey}) end return r end)(${code})`;
            } else if (method === 'Base64') {
                code = `(function(s) local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' s=s:gsub('[^'..b..'=]','') return (s:gsub('.', function(x) if (x == '=') then return '' end local r,f='',(b:find(x)-1) for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end return r end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x) if (#x ~= 8) then return '' end local c=0 for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end return string.char(c) end)) end)(${code})`;
            } else if (method === 'Reverse') {
                code = `(function(s) local r=''; for i=#s,1,-1 do r=r..s:sub(i,i) end return r end)(${code})`;
            }
        });
        
        return code;
    }

    generateDecryptionFunction(methods, settings) {
        if (methods.length === 0) {
            return 'function(s) return s end';
        }
        
        const method = methods[0];
        switch(method) {
            case 'XOR':
                const xorKey = this.parseXorKey(settings.xorKey);
                return `function(s) local r=""; for i=1,#s do r=r..string.char(string.byte(s,i)~${xorKey}) end return r end`;
            case 'Base64':
                return `function(s) local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' s=s:gsub('[^'..b..'=]','') return (s:gsub('.', function(x) if (x == '=') then return '' end local r,f='',(b:find(x)-1) for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end return r end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x) if (#x ~= 8) then return '' end local c=0 for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end return string.char(c) end)) end`;
            case 'Reverse':
                return `function(s) local r=''; for i=#s,1,-1 do r=r..s:sub(i,i) end return r end`;
            default:
                return 'function(s) return s end';
        }
    }

    escapeString(str) {
        return str.replace(/\\/g, '\\\\')
                  .replace(/"/g, '\\"')
                  .replace(/'/g, "\\'")
                  .replace(/\n/g, '\\n')
                  .replace(/\r/g, '\\r')
                  .replace(/\t/g, '\\t');
    }
}
