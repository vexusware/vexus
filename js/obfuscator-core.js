class ZiaanVeilObfuscator {
    constructor() {
        this.stringEncryptor = new StringEncryptor();
        this.constantEncoder = new ConstantEncoder();
        this.flowFlattener = new ControlFlowFlattener();
        this.renamingEngine = new RenamingEngine();
        this.bytecodeGenerator = new BytecodeGenerator();
        this.interpreter = new Interpreter();
        
        this.settings = {
            stringEncryption: true,
            stringMethod: 'xor',
            stringObfuscateChars: true,
            constantEncoding: true,
            constantLevel: 'medium',
            constantMath: true,
            controlFlow: true,
            flowIntensity: 'medium',
            addJunkBlocks: true,
            renaming: true,
            renameCharset: 'javanese',
            preserveBuiltins: true,
            bytecodeGen: false,
            addVM: false,
            vmComplexity: 'medium',
            addJunkcode: true,
            junkAmount: 'medium',
            antiTamper: true,
            intensity: 5
        };
    }

    obfuscate(code, settings = null) {
        const startTime = performance.now();
        
        if (settings) {
            this.settings = {...this.settings, ...settings};
        }
        
        let obfuscatedCode = code;
        const steps = [];
        
        // Step 1: String Encryption
        if (this.settings.stringEncryption) {
            steps.push('String Encryption');
            obfuscatedCode = this.applyStringEncryption(obfuscatedCode);
        }
        
        // Step 2: Constant Encoding
        if (this.settings.constantEncoding) {
            steps.push('Constant Encoding');
            obfuscatedCode = this.applyConstantEncoding(obfuscatedCode);
        }
        
        // Step 3: Renaming
        if (this.settings.renaming) {
            steps.push('Variable/Function Renaming');
            obfuscatedCode = this.renamingEngine.renameIdentifiers(
                obfuscatedCode, 
                this.settings.renameCharset,
                this.settings.preserveBuiltins
            );
        }
        
        // Step 4: Control Flow Flattening
        if (this.settings.controlFlow) {
            steps.push('Control Flow Flattening');
            obfuscatedCode = this.flowFlattener.flattenCode(
                obfuscatedCode,
                this.settings.flowIntensity
            );
        }
        
        // Step 5: Add Junk Code
        if (this.settings.addJunkcode) {
            steps.push('Junk Code Insertion');
            obfuscatedCode = this.addJunkCode(obfuscatedCode);
        }
        
        // Step 6: Bytecode Generation
        if (this.settings.bytecodeGen) {
            steps.push('Bytecode Generation');
            const bytecodeData = this.bytecodeGenerator.generateFromLua(obfuscatedCode);
            obfuscatedCode = this.bytecodeGenerator.generateVMCode(bytecodeData);
        }
        
        // Step 7: Add VM
        if (this.settings.addVM) {
            steps.push('VM Wrapping');
            obfuscatedCode = this.interpreter.generateVM(
                obfuscatedCode,
                this.settings.vmComplexity
            );
        }
        
        // Step 8: Anti-Tamper
        if (this.settings.antiTamper) {
            steps.push('Anti-Tamper Protection');
            obfuscatedCode = this.interpreter.addAntiTamper(obfuscatedCode);
        }
        
        // Step 9: Final Obfuscation Pass
        obfuscatedCode = this.finalObfuscationPass(obfuscatedCode);
        
        const endTime = performance.now();
        const processingTime = Math.round(endTime - startTime);
        
        return {
            code: obfuscatedCode,
            steps: steps,
            processingTime: processingTime,
            originalSize: code.length,
            obfuscatedSize: obfuscatedCode.length,
            obfuscationLevel: this.calculateObfuscationLevel(code, obfuscatedCode)
        };
    }

    applyStringEncryption(code) {
        // Find and encrypt string literals
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        
        return code.replace(stringRegex, (match) => {
            // Skip very short strings
            if (match.length < 4) return match;
            
            const content = match.substring(1, match.length - 1);
            const encrypted = this.stringEncryptor.encryptString(
                content,
                this.settings.stringMethod,
                this.settings.stringObfuscateChars
            );
            
            if (typeof encrypted === 'object') {
                return `(${encrypted.decryptionCode})`;
            }
            
            return match;
        });
    }

    applyConstantEncoding(code) {
        // Find numeric constants
        const numberRegex = /\b(\d+\.?\d*)\b/g;
        
        return code.replace(numberRegex, (match) => {
            if (parseFloat(match) < 1000) { // Only encode reasonably sized numbers
                return this.constantEncoder.encodeConstant(
                    parseFloat(match),
                    this.settings.constantLevel
                );
            }
            return match;
        });
    }

    addJunkCode(code) {
        const junkAmounts = {
            low: 5,
            medium: 15,
            high: 30,
            extreme: 50
        };
        
        const amount = junkAmounts[this.settings.junkAmount] || 15;
        
        let lines = code.split('\n');
        const junkLines = [];
        
        for (let i = 0; i < amount; i++) {
            const junkType = ZiaanUtils.randomInt(1, 6);
            
            switch(junkType) {
                case 1:
                    junkLines.push(`local _junk${i} = function() return ${ZiaanUtils.randomInt(1, 1000)} end`);
                    break;
                case 2:
                    junkLines.push(`if false then ${ZiaanUtils.randomString(20)} = "${ZiaanUtils.randomString(30)}" end`);
                    break;
                case 3:
                    junkLines.push(`for _=1,${ZiaanUtils.randomInt(0, 5)} do local _x = math.random(${ZiaanUtils.randomInt(1, 100)}) end`);
                    break;
                case 4:
                    junkLines.push(`local _t${i} = {${Array.from({length: ZiaanUtils.randomInt(3, 10)}, () => ZiaanUtils.randomInt(1, 100)).join(',')}}`);
                    break;
                case 5:
                    junkLines.push(`local function _f${i}() return function() return function() end end end`);
                    break;
                case 6:
                    junkLines.push(`while false do print("${ZiaanUtils.randomString(20)}") end`);
                    break;
            }
        }
        
        // Insert junk lines at random positions
        junkLines.forEach(junkLine => {
            const insertPos = ZiaanUtils.randomInt(0, lines.length - 1);
            lines.splice(insertPos, 0, junkLine);
        });
        
        return lines.join('\n');
    }

    finalObfuscationPass(code) {
        // Add random whitespace and comments removal simulation
        let lines = code.split('\n');
        
        // Remove empty lines randomly
        lines = lines.filter(line => line.trim() !== '' || Math.random() > 0.5);
        
        // Add random indentation
        lines = lines.map(line => {
            if (line.trim() === '') return '';
            const indent = Math.random() > 0.7 ? '    '.repeat(ZiaanUtils.randomInt(0, 3)) : '';
            return indent + line.trim();
        });
        
        return lines.join('\n');
    }

    calculateObfuscationLevel(original, obfuscated) {
        const sizeRatio = obfuscated.length / Math.max(original.length, 1);
        const entropyDiff = this.calculateEntropy(obfuscated) - this.calculateEntropy(original);
        
        let level = 0;
        
        // Size increase contributes to level
        level += Math.min((sizeRatio - 1) * 20, 30);
        
        // Entropy increase contributes to level
        level += Math.min(entropyDiff * 10, 40);
        
        // Techniques applied
        if (this.settings.stringEncryption) level += 10;
        if (this.settings.constantEncoding) level += 10;
        if (this.settings.controlFlow) level += 15;
        if (this.settings.renaming) level += 10;
        if (this.settings.bytecodeGen) level += 20;
        if (this.settings.addVM) level += 25;
        
        return Math.min(Math.round(level), 100);
    }

    calculateEntropy(str) {
        const freq = {};
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            freq[char] = (freq[char] || 0) + 1;
        }
        
        let entropy = 0;
        const len = str.length;
        
        for (const char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
        }
        
        return entropy;
    }

    applyPreset(presetName) {
        const presets = {
            light: {
                stringEncryption: true,
                stringMethod: 'xor',
                constantEncoding: false,
                controlFlow: false,
                renaming: true,
                renameCharset: 'javanese',
                bytecodeGen: false,
                addVM: false,
                addJunkcode: false,
                intensity: 3
            },
            medium: {
                stringEncryption: true,
                stringMethod: 'xor',
                constantEncoding: true,
                constantLevel: 'medium',
                controlFlow: true,
                flowIntensity: 'medium',
                renaming: true,
                renameCharset: 'unicode',
                bytecodeGen: false,
                addVM: false,
                addJunkcode: true,
                junkAmount: 'medium',
                intensity: 5
            },
            heavy: {
                stringEncryption: true,
                stringMethod: 'aes',
                constantEncoding: true,
                constantLevel: 'high',
                controlFlow: true,
                flowIntensity: 'high',
                renaming: true,
                renameCharset: 'chinese',
                bytecodeGen: true,
                addVM: true,
                vmComplexity: 'medium',
                addJunkcode: true,
                junkAmount: 'high',
                antiTamper: true,
                intensity: 8
            },
            extreme: {
                stringEncryption: true,
                stringMethod: 'custom',
                stringObfuscateChars: true,
                constantEncoding: true,
                constantLevel: 'extreme',
                constantMath: true,
                controlFlow: true,
                flowIntensity: 'high',
                addJunkBlocks: true,
                renaming: true,
                renameCharset: 'emoji',
                preserveBuiltins: false,
                bytecodeGen: true,
                addVM: true,
                vmComplexity: 'complex',
                addJunkcode: true,
                junkAmount: 'extreme',
                antiTamper: true,
                intensity: 10
            }
        };
        
        return presets[presetName] || this.settings;
    }
}
