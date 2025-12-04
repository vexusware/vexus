// Constant Encoding Module

class ConstantEncoding {
    constructor() {
        this.encodings = {
            arithmetic: this.encodeArithmetic.bind(this),
            hex: this.encodeHex.bind(this),
            binary: this.encodeBinary.bind(this)
        };
    }

    encodeConstants(code, settings) {
        // Find all numeric constants
        const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
        
        return code.replace(numberRegex, (match, number) => {
            // Skip numbers that are part of other tokens
            if (this.isPartOfIdentifier(match, code)) return match;
            
            const num = parseFloat(number);
            if (isNaN(num)) return match;
            
            // Don't encode 0 and 1 as they're too common
            if (num === 0 || num === 1) return match;
            
            const method = settings.constantMethod || 'arithmetic';
            const encoder = this.encodings[method] || this.encodings.arithmetic;
            
            return encoder(num);
        });
    }

    encodeArithmetic(num) {
        // Generate arithmetic expression that equals to num
        const methods = [
            () => {
                const a = Math.floor(Math.random() * 100);
                const b = num - a;
                return `(${a}+${b})`;
            },
            () => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = num * a;
                return `(${b}/${a})`;
            },
            () => {
                const a = Math.floor(Math.random() * 100);
                const b = num + a;
                return `(${b}-${a})`;
            },
            () => {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = num / a;
                return `(${b}*${a})`;
            },
            () => {
                const a = Math.floor(Math.random() * 100);
                const b = Math.floor(Math.random() * 100);
                return `((${a}*${b})+(${num}-(${a}*${b})))`;
            }
        ];
        
        const method = methods[Math.floor(Math.random() * methods.length)];
        return method();
    }

    encodeHex(num) {
        if (Number.isInteger(num)) {
            return `0x${num.toString(16)}`;
        } else {
            // For floats, use tonumber with hex string
            const intPart = Math.floor(num);
            const fracPart = num - intPart;
            return `(tonumber("0x${intPart.toString(16)}")+${fracPart})`;
        }
    }

    encodeBinary(num) {
        if (Number.isInteger(num)) {
            // Generate binary operations
            const ops = ['&', '|', '<<', '>>', '~'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            
            switch(op) {
                case '&':
                    const mask = Math.floor(Math.random() * 255);
                    const result = num & mask;
                    return `(${result}&${mask})`;
                case '|':
                    const bits = Math.floor(Math.random() * 255);
                    return `(${num}|${bits})`;
                case '<<':
                    const shift = Math.floor(Math.random() * 4);
                    return `(${num >> shift}<<${shift})`;
                case '>>':
                    const shift2 = Math.floor(Math.random() * 4);
                    return `(${num << shift2}>>${shift2})`;
                case '~':
                    return `(~${~num})`;
                default:
                    return num.toString();
            }
        }
        return num.toString();
    }

    isPartOfIdentifier(match, code, index) {
        const matchIndex = code.indexOf(match, index);
        if (matchIndex === -1) return false;
        
        // Check character before the match
        if (matchIndex > 0) {
            const before = code[matchIndex - 1];
            if (/[a-zA-Z_$]/.test(before)) return true;
        }
        
        // Check character after the match
        if (matchIndex + match.length < code.length) {
            const after = code[matchIndex + match.length];
            if (/[a-zA-Z_$]/.test(after)) return true;
        }
        
        return false;
    }
}
