class RenamingEngine {
    constructor() {
        this.reservedWords = new Set([
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
            'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true',
            'until', 'while', 'game', 'workspace', 'script', 'wait', 'print', 'warn',
            'error', 'spawn', 'delay', 'tick', 'time', 'typeof', 'assert', 'getfenv',
            'getmetatable', 'ipairs', 'loadstring', 'newproxy', 'next', 'pairs', 'pcall',
            'rawequal', 'rawget', 'rawset', 'select', 'setfenv', 'setmetatable', 'tonumber',
            'tostring', 'unpack', 'xpcall', '_G', '_VERSION'
        ]);
        
        this.builtInFunctions = new Set([
            'math', 'string', 'table', 'coroutine', 'os', 'io', 'debug'
        ]);
        
        this.nameMap = new Map();
        this.generatedNames = new Set();
    }

    renameIdentifiers(code, charset = 'javanese', preserveBuiltins = true) {
        // Extract identifiers (simplified - in reality use proper parser)
        const identifierRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
        const identifiers = new Set();
        
        let match;
        while ((match = identifierRegex.exec(code)) !== null) {
            const identifier = match[0];
            if (!this.reservedWords.has(identifier) && 
                !(preserveBuiltins && this.builtInFunctions.has(identifier.split('.')[0]))) {
                identifiers.add(identifier);
            }
        }
        
        // Generate new names
        identifiers.forEach(identifier => {
            if (!this.nameMap.has(identifier)) {
                let newName;
                do {
                    newName = ZiaanUtils.generateRandomName(charset, ZiaanUtils.randomInt(6, 12));
                } while (this.generatedNames.has(newName));
                
                this.nameMap.set(identifier, newName);
                this.generatedNames.add(newName);
            }
        });
        
        // Replace identifiers in code
        let renamedCode = code;
        const sortedIdentifiers = Array.from(this.nameMap.keys()).sort((a, b) => b.length - a.length);
        
        sortedIdentifiers.forEach(oldName => {
            const newName = this.nameMap.get(oldName);
            const regex = new RegExp(`\\b${oldName}\\b`, 'g');
            renamedCode = renamedCode.replace(regex, newName);
        });
        
        return renamedCode;
    }

    generateAliasCode() {
        // Create aliases for common functions to confuse decompilers
        const aliases = [];
        
        const aliasPairs = [
            ['print', '_输出'],
            ['warn', '_警告'],
            ['error', '_错误'],
            ['wait', '_等待'],
            ['spawn', '_创建线程'],
            ['delay', '_延迟'],
            ['tick', '_时间戳'],
            ['typeof', '_类型']
        ];
        
        aliasPairs.forEach(([original, alias]) => {
            if (Math.random() > 0.5) {
                aliases.push(`local ${alias}=${original}`);
            }
        });
        
        return aliases.join(' ');
    }

    obfuscateFunctionCalls(code) {
        // Obfuscate function calls with indirect references
        return code.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\(/g, (match, funcName) => {
            if (this.reservedWords.has(funcName) || funcName.length < 3) {
                return match;
            }
            
            const obfuscations = [
                `(getfenv()[${JSON.stringify(funcName)}] or ${funcName})`,
                `((function() return ${funcName} end)())`,
                `(rawget(_G, ${JSON.stringify(funcName)}) or ${funcName})`
            ];
            
            if (Math.random() > 0.7) {
                return obfuscations[ZiaanUtils.randomInt(0, obfuscations.length - 1)] + '(';
            }
            
            return match;
        });
    }
}
