// Engine Obfuscator Lua/Luau
class LuaObfuscator {
    constructor() {
        this.jawaChars = "ꦄꦆꦇꦈꦉꦊꦋꦌꦍꦎꦏꦐꦑꦒꦓꦔꦕꦖꦗꦘꦙꦚꦛꦜꦝꦞꦟꦠꦡꦢꦣꦤꦥꦦꦧꦨꦩꦪꦫꦬꦭꦮꦯꦰꦱꦲꦴꦵꦶꦷꦸꦹꦺꦻꦼꦽꦾꦿꦀꦁꦂꦃ꦳ꦽꦾꦿꦀ";
        this.cinaChars = "的一是不了人我在有他这为之大来以个中上们到说国和地也子时道出而要于就下得可你年生自会那后能对着事其里所去行过家十用发天如然作方成者多日都三小军二无同么经法当起与好看学进种将还分此心前面又定见只主没公从今回很己最但现前些所同起好长看被进";
        this.unicodeRanges = [
            { start: 0x0400, end: 0x04FF },   // Cyrillic
            { start: 0x0370, end: 0x03FF },   // Greek
            { start: 0x0900, end: 0x097F },   // Devanagari
            { start: 0x0600, end: 0x06FF },   // Arabic
            { start: 0x0E00, end: 0x0E7F },   // Thai
            { start: 0xAC00, end: 0xD7AF },   // Hangul
        ];
        
        this.obfuscatedVars = new Map();
        this.varCounter = 0;
        this.stringEncryptionKey = null;
    }
    
    // Generate random aksara Jawa
    generateJawaName(length = 6) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.jawaChars.charAt(Math.floor(Math.random() * this.jawaChars.length));
        }
        return result;
    }
    
    // Generate random karakter Cina
    generateCinaName(length = 3) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.cinaChars.charAt(Math.floor(Math.random() * this.cinaChars.length));
        }
        return result;
    }
    
    // Generate random Unicode
    generateUnicodeName(length = 4) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const range = this.unicodeRanges[Math.floor(Math.random() * this.unicodeRanges.length)];
            const charCode = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
            result += String.fromCharCode(charCode);
        }
        return result;
    }
    
    // Generate nama variabel berdasarkan setting
    generateVarName(type = 'campur') {
        this.varCounter++;
        
        if (type === 'jawa') return this.generateJawaName();
        if (type === 'cina') return this.generateCinaName();
        if (type === 'unicode') return this.generateUnicodeName();
        
        // Campuran Jawa + Cina
        if (Math.random() > 0.5) {
            return this.generateJawaName(4) + this.generateCinaName(2);
        } else {
            return this.generateCinaName(2) + this.generateJawaName(4);
        }
    }
    
    // Simple string encryption (base64 dengan XOR)
    encryptString(str, key = null) {
        if (!key) {
            key = Math.floor(Math.random() * 255) + 1;
            this.stringEncryptionKey = key;
        }
        
        // XOR encryption
        let encrypted = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i) ^ key;
            encrypted += String.fromCharCode(charCode);
        }
        
        // Convert to base64 untuk tampilan
        const base64 = btoa(encrypted);
        return { encrypted: base64, key: key };
    }
    
    // Generate decryption function untuk string
    generateDecryptFunction() {
        const funcName = this.generateVarName('campur');
        return `
local function ${funcName}(str, key)
    local result = ""
    local decoded = string.char(table.unpack({string.byte(str, 1, #str)}))
    for i = 1, #decoded do
        result = result .. string.char(string.byte(decoded, i) ~ key)
    end
    return result
end
`;
    }
    
    // Parse dan extract variabel dari kode Lua
    extractVariables(code) {
        const variablePatterns = [
            /local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[=,\n]?/g,
            /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*[^=\n]+/g,
            /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+/g,
            /\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[,)]/g
        ];
        
        const variables = new Set();
        const protectedVars = new Set(['game', 'workspace', 'script', 'wait', 'print', 'tick', 'time', 'spawn', 'delay', 'Instance', 'Vector3', 'CFrame', 'Color3', 'UDim2', 'Enum', 'require', 'math', 'string', 'table', 'coroutine', 'os', 'debug', 'bit32', 'utf8', '_G', 'self', 'arg', '...']);
        
        for (const pattern of variablePatterns) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                const varName = match[1];
                if (varName && !protectedVars.has(varName) && varName.length > 1) {
                    variables.add(varName);
                }
            }
        }
        
        return Array.from(variables);
    }
    
    // Replace variabel dengan nama baru
    replaceVariables(code, varType) {
        const variables = this.extractVariables(code);
        this.obfuscatedVars.clear();
        
        // Generate nama baru untuk setiap variabel
        for (const varName of variables) {
            const newName = this.generateVarName(varType);
            this.obfuscatedVars.set(varName, newName);
        }
        
        // Lakukan replacement
        let obfuscatedCode = code;
        const sortedVars = Array.from(this.obfuscatedVars.entries())
            .sort((a, b) => b[0].length - a[0].length); // Sort panjang descending
        
        for (const [oldName, newName] of sortedVars) {
            const regex = new RegExp(`\\b${oldName}\\b`, 'g');
            obfuscatedCode = obfuscatedCode.replace(regex, newName);
        }
        
        return { code: obfuscatedCode, count: variables.length };
    }
    
    // Obfuscate string literals
    encryptStrings(code, enableEncryption) {
        if (!enableEncryption) return { code, encryptedStrings: [] };
        
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const encryptedStrings = [];
        let match;
        let lastIndex = 0;
        let result = '';
        
        while ((match = stringRegex.exec(code)) !== null) {
            result += code.substring(lastIndex, match.index);
            
            const str = match[0];
            // Skip string pendek (kurang dari 3 karakter)
            if (str.length <= 5) {
                result += str;
            } else {
                const encrypted = this.encryptString(str.slice(1, -1));
                const varName = this.generateVarName('jawa');
                encryptedStrings.push({
                    varName,
                    encrypted: encrypted.encrypted,
                    key: encrypted.key
                });
                result += `${varName}()`;
            }
            
            lastIndex = match.index + str.length;
        }
        
        result += code.substring(lastIndex);
        return { code: result, encryptedStrings };
    }
    
    // Tambahkan dead code (kode tidak berguna)
    addDeadCode(code, level) {
        if (level < 2) return code;
        
        const deadCodeTemplates = [
            `local ${this.generateVarName()} = function() return ${Math.floor(Math.random() * 1000)} end`,
            `do local ${this.generateVarName()} = "${this.generateCinaName(10)}" end`,
            `if false then ${this.generateJawaName()} = ${Math.random() * 100} end`,
            `for ${this.generateVarName()} = 1, 0 do end`,
            `while false do local ${this.generateVarName()} = nil end`,
            `local ${this.generateVarName()} = nil; ${this.generateVarName()} = ${this.generateVarName()}`,
            `local function ${this.generateVarName()}() return; end; ${this.generateVarName()}()`
        ];
        
        const lines = code.split('\n');
        const resultLines = [];
        const insertFrequency = level === 3 ? 5 : 10;
        
        for (let i = 0; i < lines.length; i++) {
            resultLines.push(lines[i]);
            // Insert dead code setiap beberapa baris
            if (i > 0 && i % insertFrequency === 0) {
                const randomTemplate = deadCodeTemplates[Math.floor(Math.random() * deadCodeTemplates.length)];
                resultLines.push(`\t-- Dead code untuk pengacakan`);
                resultLines.push(`\t${randomTemplate}`);
            }
        }
        
        return resultLines.join('\n');
    }
    
    // Tambahkan anti-tamper protection
    addAntiTamper(code, level) {
        if (level < 2) return code;
        
        const tamperFunc = `
-- Anti-tamper protection
local function ${this.generateVarName('cina')}()
    local ${this.generateVarName()} = tostring(script)
    local ${this.generateVarName()} = #${this.generateVarName()}
    if ${this.generateVarName()} < 10 then
        error("Script integrity check failed")
    end
    return true
end

${this.generateVarName('cina')}()
`;
        
        return tamperFunc + '\n' + code;
    }
    
    // Tambahkan control flow obfuscation
    addControlFlowObfuscation(code, level) {
        if (level < 3) return code;
        
        // Simple control flow: wrap code in meaningless conditionals
        const wrapperStart = `
-- Control flow obfuscation
local ${this.generateVarName()} = true
if (${Math.random() > 0.5 ? 'not not' : '!!'} ${this.generateVarName()}) then
`;
        
        const wrapperEnd = `
else
    local ${this.generateVarName()} = nil
end
`;
        
        return wrapperStart + code + wrapperEnd;
    }
    
    // Main obfuscation function
    obfuscate(code, options) {
        const {
            obfLevel = 3,
            varObf = 'campur',
            antiTamper = true,
            stringEncrypt = true,
            controlFlow = true,
            deadCode = true
        } = options;
        
        console.log(`Starting obfuscation with level: ${obfLevel}`);
        
        // Reset counter
        this.varCounter = 0;
        
        // Step 1: Replace variables
        console.log("Step 1: Replacing variables...");
        const varResult = this.replaceVariables(code, varObf);
        let obfuscated = varResult.code;
        const varCount = varResult.count;
        
        // Step 2: Encrypt strings
        console.log("Step 2: Encrypting strings...");
        const stringResult = this.encryptStrings(obfuscated, stringEncrypt);
        obfuscated = stringResult.code;
        const encryptedStrings = stringResult.encryptedStrings;
        
        // Step 3: Add decryption function if strings were encrypted
        if (encryptedStrings.length > 0) {
            console.log("Adding string decryption function...");
            const decryptFunc = this.generateDecryptFunction();
            obfuscated = decryptFunc + '\n' + obfuscated;
            
            // Add the actual string variables
            let stringVars = '\n-- Encrypted strings\n';
            encryptedStrings.forEach(s => {
                stringVars += `local ${s.varName} = function() return ${this.generateVarName('cina')}("${s.encrypted}", ${s.key}) end\n`;
            });
            obfuscated = stringVars + '\n' + obfuscated;
        }
        
        // Step 4: Add dead code
        if (deadCode) {
            console.log("Step 4: Adding dead code...");
            obfuscated = this.addDeadCode(obfuscated, obfLevel);
        }
        
        // Step 5: Add control flow obfuscation
        if (controlFlow && obfLevel > 2) {
            console.log("Step 5: Adding control flow obfuscation...");
            obfuscated = this.addControlFlowObfuscation(obfuscated, obfLevel);
        }
        
        // Step 6: Add anti-tamper protection
        if (antiTamper) {
            console.log("Step 6: Adding anti-tamper protection...");
            obfuscated = this.addAntiTamper(obfuscated, obfLevel);
        }
        
        // Step 7: Add header comment
        const header = `--[[
    Lua/Luau Obfuscator
    Obfuscated with Roblox Lua Obfuscator v2.0
    Security Level: ${obfLevel === 1 ? 'Low' : obfLevel === 2 ? 'Medium' : 'High'}
    Variables Obfuscated: ${varCount}
    Strings Encrypted: ${encryptedStrings.length}
    Timestamp: ${new Date().toLocaleString()}
--]]

`;
        
        obfuscated = header + obfuscated;
        
        console.log("Obfuscation complete!");
        
        return {
            code: obfuscated,
            stats: {
                variablesObfuscated: varCount,
                stringsEncrypted: encryptedStrings.length,
                originalLength: code.length,
                obfuscatedLength: obfuscated.length,
                securityLevel: obfLevel
            }
        };
    }
}

// Buat instance global
window.LuaObfuscator = LuaObfuscator;
