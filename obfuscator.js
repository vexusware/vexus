class ZiaanVeilObfuscator {
    constructor() {
        this.jawaChars = "ꦄꦅꦆꦇꦈꦉꦊꦋꦌꦍꦎꦏꦐꦑꦒꦓꦔꦕꦖꦗꦘꦙꦚꦛꦜꦝꦞꦟꦠꦡꦢꦣꦤꦥꦦꦧꦨꦩꦪꦫꦬꦭꦮꦯꦰꦱꦲ꧀꧁꧂꧃꧄꧅꧆";
        this.chinaChars = "甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥";
        this.arabChars = "ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىي";
        this.customBytecodes = ["Ѫ", "Ѩ", "Ѧ", "Ѭ", "Ѯ", "Ѱ", "Ѳ", "Ѵ", "Ѷ", "Ѹ", "Ѻ", "Ѽ", "Ѿ", "Ҁ", "҂", "Ҋ", "Ҍ", "Ҏ"];
        this.xorKey = 135;
        this.obfuscationMethods = [];
        this.junkCodeTemplates = [
            "local _={[{}]=function() end};",
            "if math.random()>2 then while true do end end;",
            "for _=1,0 do break end;",
            "local __=tonumber('0')or nil;",
            "pcall(function()error('')end);",
            "getfenv().__index=nil;",
            "debug.setmetatable(0,{});",
            "rawset(_G,'',nil);",
            "table.insert({},'');",
            "string.sub('',math.huge);",
        ];
    }
    
    setOptions(options) {
        this.options = options;
        this.xorKey = options.xorKey || 135;
    }
    
    obfuscate(code) {
        const startTime = performance.now();
        let obfuscated = code;
        
        // Langkah 1: String encryption
        if (this.options.enableStringEnc) {
            obfuscated = this.encryptStrings(obfuscated);
        }
        
        // Langkah 2: Renaming variables
        if (this.options.enableRenaming) {
            obfuscated = this.renameVariables(obfuscated, this.options.renameType);
        }
        
        // Langkah 3: Constant encoding
        if (this.options.enableConstantEnc) {
            obfuscated = this.encodeConstants(obfuscated);
        }
        
        // Langkah 4: Control-flow flattening
        if (this.options.enableControlFlow) {
            obfuscated = this.flattenControlFlow(obfuscated);
        }
        
        // Langkah 5: Add junk code
        if (this.options.enableJunkCode) {
            obfuscated = this.addJunkCode(obfuscated, this.options.junkLevel);
        }
        
        // Langkah 6: Bytecode generator
        if (this.options.enableBytecode) {
            obfuscated = this.generateBytecode(obfuscated);
        }
        
        // Langkah 7: XOR encryption
        if (this.options.enableXOR) {
            obfuscated = this.xorEncrypt(obfuscated, this.xorKey);
        }
        
        // Langkah 8: Base64 encoding
        if (this.options.enableBase64) {
            obfuscated = this.base64Encode(obfuscated);
        }
        
        // Langkah 9: Interpreter wrapper
        if (this.options.enableInterpreter) {
            obfuscated = this.wrapWithInterpreter(obfuscated);
        }
        
        // Langkah 10: Compression (single line)
        if (this.options.enableCompression) {
            obfuscated = this.compressCode(obfuscated);
        }
        
        const endTime = performance.now();
        this.processTime = endTime - startTime;
        
        return obfuscated;
    }
    
    encryptStrings(code) {
        // Find and encrypt all string literals
        const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
        return code.replace(stringRegex, (match) => {
            // XOR encryption for string
            let xorEncrypted = "";
            for (let i = 0; i < match.length; i++) {
                xorEncrypted += String.fromCharCode(match.charCodeAt(i) ^ this.xorKey);
            }
            
            // Create decryption function
            const varName = this.generateRandomName("jawa");
            const decryptFunc = `
            local function ${varName}_d(s)
                local r=""
                for i=1,#s do 
                    r=r..string.char(string.byte(s,i,i)~${this.xorKey})
                end
                return r
            end
            `;
            
            this.obfuscationMethods.push(decryptFunc);
            
            return `${varName}_d("${this.base64EncodeRaw(xorEncrypted)}")`;
        });
    }
    
    renameVariables(code, type) {
        // Extract variable names (simple approach)
        const varRegex = /\b(local\s+)([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        const usedNames = new Set();
        const nameMap = new Map();
        
        // Find all variable names
        let match;
        while ((match = varRegex.exec(code)) !== null) {
            const varName = match[2];
            if (!nameMap.has(varName) && varName.length > 1) {
                nameMap.set(varName, this.generateRandomName(type));
            }
        }
        
        // Replace variable names
        let result = code;
        nameMap.forEach((newName, oldName) => {
            const regex = new RegExp(`\\b${oldName}\\b`, 'g');
            result = result.replace(regex, newName);
        });
        
        return result;
    }
    
    generateRandomName(type) {
        let charset = "";
        switch(type) {
            case "jawa": charset = this.jawaChars; break;
            case "china": charset = this.chinaChars; break;
            case "arab": charset = this.arabChars; break;
            case "mix": charset = this.jawaChars + this.chinaChars + this.arabChars; break;
            default: charset = this.jawaChars;
        }
        
        const length = Math.floor(Math.random() * 3) + 2;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += charset[Math.floor(Math.random() * charset.length)];
        }
        return name;
    }
    
    encodeConstants(code) {
        // Encode numbers
        const numberRegex = /\b(\d+)\b/g;
        return code.replace(numberRegex, (match) => {
            const methods = [
                `bit32.bxor(${match},0)`,
                `#{}+#{}+#{${match}}`,
                `math.floor(math.sin(${match})*0+${match})`,
                `tonumber("${match}")`,
                `${match}*math.max(1,1)`
            ];
            return methods[Math.floor(Math.random() * methods.length)];
        });
    }
    
    flattenControlFlow(code) {
        // Simple control flow flattening
        const lines = code.split('\n');
        let flattened = `
        local _={}
        local _i=1
        while _i<=#_ do
            if _i==1 then
                ${lines[0] or ''}
                _i=_i+1
        `;
        
        for (let i = 1; i < lines.length; i++) {
            flattened += `
            elseif _i==${i+1} then
                ${lines[i]}
                _i=_i+1
            `;
        }
        
        flattened += `
        else
            break
        end
        end
        `;
        
        return flattened;
    }
    
    addJunkCode(code, level) {
        let junkCount = level * 3;
        let result = code;
        
        for (let i = 0; i < junkCount; i++) {
            const junk = this.junkCodeTemplates[Math.floor(Math.random() * this.junkCodeTemplates.length)];
            const insertPos = Math.floor(Math.random() * result.length);
            result = result.slice(0, insertPos) + junk + result.slice(insertPos);
        }
        
        return result;
    }
    
    generateBytecode(code) {
        // Simulate bytecode generation
        const bytecodeVar = this.generateRandomName("mix");
        let bytecode = "";
        
        for (let i = 0; i < code.length; i++) {
            bytecode += this.customBytecodes[code.charCodeAt(i) % this.customBytecodes.length];
        }
        
        const decoder = `
        local ${bytecodeVar}="${bytecode}"
        local function ${bytecodeVar}_dec(s)
            local r=""
            for i=1,#s do
                local c=string.sub(s,i,i)
                local n=0
                for j=1,#{${JSON.stringify(this.customBytecodes)}} do
                    if c=={${JSON.stringify(this.customBytecodes)}}[j] then n=j break end
                end
                r=r..string.char((n*17)%256)
            end
            return loadstring(r)()
        end
        `;
        
        return decoder + `\n${bytecodeVar}_dec(${bytecodeVar})\n` + code;
    }
    
    xorEncrypt(text, key) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key);
        }
        return result;
    }
    
    base64Encode(text) {
        return this.base64EncodeRaw(text);
    }
    
    base64EncodeRaw(text) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        let i = 0;
        
        while (i < text.length) {
            const a = text.charCodeAt(i++);
            const b = i < text.length ? text.charCodeAt(i++) : 0;
            const c = i < text.length ? text.charCodeAt(i++) : 0;
            
            const bits = (a << 16) | (b << 8) | c;
            
            result += chars.charAt((bits >> 18) & 0x3F);
            result += chars.charAt((bits >> 12) & 0x3F);
            result += chars.charAt((bits >> 6) & 0x3F);
            result += chars.charAt(bits & 0x3F);
        }
        
        // Add padding
        const padding = text.length % 3;
        if (padding === 1) {
            result = result.slice(0, -2) + '==';
        } else if (padding === 2) {
            result = result.slice(0, -1) + '=';
        }
        
        return result;
    }
    
    wrapWithInterpreter(code) {
        const vmName = this.generateRandomName("mix");
        return `
        -- ZiaanVeil VM Runner
        local ${vmName}={
            ex=function(c)
                local f,err=loadstring(c)
                if f then return f() else error(err) end
            end
        }
        
        local ${vmName}_c=[[${this.base64EncodeRaw(code)}]]
        ${vmName}.ex(${vmName}_c)
        `;
    }
    
    compressCode(code) {
        // Remove comments and extra whitespace
        let compressed = code
            .replace(/--\[\[[\s\S]*?\]\]/g, '')  // Remove multi-line comments
            .replace(/--[^\n]*\n/g, ' ')         // Remove single-line comments
            .replace(/\s+/g, ' ')                // Collapse whitespace
            .replace(/\s*([=+\-*/%^<>(),;{}])\s*/g, '$1')  // Remove space around operators
            .trim();
        
        return compressed;
    }
}
