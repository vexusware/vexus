// Control Flow Flattening Module for ZiaanVeil

class ControlFlowFlattener {
    constructor() {
        this.stateVariableCount = 0;
        this.switchVariableCount = 0;
    }
    
    // Flatten control flow in Lua code
    flatten(code, settings) {
        if (!settings.controlFlowEnabled) return code;
        
        let result = code;
        const intensity = settings.controlFlowIntensity;
        
        // Apply flattening based on intensity
        switch (intensity) {
            case 'low':
                result = this.flattenSimpleFunctions(result);
                break;
            case 'medium':
                result = this.flattenFunctions(result);
                result = this.flattenLoops(result);
                break;
            case 'high':
                result = this.flattenFunctions(result);
                result = this.flattenLoops(result);
                result = this.flattenConditionals(result);
                break;
            case 'extreme':
                result = this.flattenAllControlFlow(result);
                if (settings.controlFlowJunk) {
                    result = this.insertJunkCode(result);
                }
                if (settings.controlFlowFake) {
                    result = this.insertFakeConditions(result);
                }
                break;
        }
        
        return result;
    }
    
    // Flatten simple functions
    flattenSimpleFunctions(code) {
        // Find function definitions
        const functionRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/g;
        let result = code;
        
        return result.replace(functionRegex, (match, funcName, params) => {
            return this.createFlattenedFunction(funcName, params, 'simple');
        });
    }
    
    // Flatten functions with switch statements
    flattenFunctions(code) {
        // Find function definitions
        const functionRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/g;
        let result = code;
        let lastIndex = 0;
        let flattened = '';
        
        while (true) {
            const match = functionRegex.exec(code);
            if (!match) break;
            
            // Add text before function
            flattened += code.substring(lastIndex, match.index);
            
            // Create flattened function
            flattened += this.createFlattenedFunction(match[1], match[2], 'complex');
            
            lastIndex = match.index + match[0].length;
        }
        
        // Add remaining code
        flattened += code.substring(lastIndex);
        
        return flattened || result;
    }
    
    // Create flattened function
    createFlattenedFunction(name, params, complexity) {
        this.stateVariableCount++;
        const stateVar = `_ZV_state_${this.stateVariableCount}`;
        
        if (complexity === 'simple') {
            return `function ${name}(${params})
    local ${stateVar} = 0
    while true do
        if ${stateVar} == 0 then
            ${stateVar} = 1
            -- Function body will be inserted here
        elseif ${stateVar} == 1 then
            break
        end
    end
end`;
        } else {
            this.switchVariableCount++;
            const switchVar = `_ZV_switch_${this.switchVariableCount}`;
            
            return `function ${name}(${params})
    local ${stateVar} = 0
    local ${switchVar} = 0
    
    while true do
        ${switchVar} = ${stateVar}
        
        if ${switchVar} == 0 then
            ${stateVar} = 1
            -- Block 0
        elseif ${switchVar} == 1 then
            ${stateVar} = 2
            -- Block 1
        elseif ${switchVar} == 2 then
            ${stateVar} = 3
            -- Block 2
        elseif ${switchVar} == 3 then
            break
        end
    end
end`;
        }
    }
    
    // Flatten loops
    flattenLoops(code) {
        let result = code;
        
        // Flatten for loops
        const forLoopRegex = /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^,]+),([^,]+)(?:,([^)]+))?\s+do/g;
        result = result.replace(forLoopRegex, (match, varName, start, end, step) => {
            const stepVal = step || '1';
            return `do
    local ${varName} = ${start}
    local _ZV_end = ${end}
    local _ZV_step = ${stepVal}
    while true do
        if _ZV_step > 0 and ${varName} > _ZV_end then break end
        if _ZV_step < 0 and ${varName} < _ZV_end then break end
        -- Loop body`;
        });
        
        // Close for loops
        result = result.replace(/\bend\b(?=\s*-- Loop body)/g, '');
        result = result.replace(/-- Loop body/g, `        ${varName} = ${varName} + _ZV_step
    end
end`);
        
        // Flatten while loops
        const whileLoopRegex = /while\s+(.+)\s+do/g;
        result = result.replace(whileLoopRegex, (match, condition) => {
            return `while true do
    if not (${condition}) then break end
    -- While body`;
        });
        
        result = result.replace(/-- While body/g, '    -- While body');
        
        return result;
    }
    
    // Flatten conditionals
    flattenConditionals(code) {
        let result = code;
        
        // Flatten if statements
        const ifRegex = /if\s+(.+)\s+then/g;
        result = result.replace(ifRegex, (match, condition) => {
            return `do
    local _ZV_cond = (${condition})
    if _ZV_cond then
        -- If body`;
        });
        
        // Handle elseif
        result = result.replace(/elseif\s+(.+)\s+then/g, (match, condition) => {
            return `    elseif (${condition}) then
        -- Elseif body`;
        });
        
        // Handle else
        result = result.replace(/\belse\b/g, '    else\n        -- Else body');
        
        // Close if statements
        result = result.replace(/\bend\b(?=\s*-- (?:If|Elseif|Else) body)/g, '');
        result = result.replace(/-- (?:If|Elseif|Else) body/g, '    -- Body placeholder\nend');
        
        return result;
    }
    
    // Flatten all control flow
    flattenAllControlFlow(code) {
        let result = this.flattenFunctions(code);
        result = this.flattenLoops(result);
        result = this.flattenConditionals(result);
        return result;
    }
    
    // Insert junk code
    insertJunkCode(code) {
        const junkPatterns = [
            'local _ = math.random(1, 100)',
            'if false then print("This never executes") end',
            'for i = 1, 0 do end',
            'local x = 1; x = x + 1; x = x - 1',
            'do local y = {} end',
            'while false do end',
            'repeat until true',
            'local a, b, c = 1, 2, 3',
            'if 1 == 2 then return end',
            'local function unused() return "junk" end'
        ];
        
        const lines = code.split('\n');
        const result = [];
        
        for (let i = 0; i < lines.length; i++) {
            result.push(lines[i]);
            
            // Randomly insert junk code
            if (Math.random() < 0.3 && i < lines.length - 1) {
                const junk = junkPatterns[Math.floor(Math.random() * junkPatterns.length)];
                result.push(`    ${junk}`);
            }
        }
        
        return result.join('\n');
    }
    
    // Insert fake conditions
    insertFakeConditions(code) {
        const fakeConditions = [
            'if math.random() > 0.5 then',
            'if os.time() % 2 == 0 then',
            'if tick() % 3 == 0 then',
            'if #_G > 0 then',
            'if type({}) == "table" then',
            'if tostring(1) == "1" then',
            'if bit32.band(1, 1) == 1 then',
            'if string.len("a") == 1 then',
            'if table.getn({}) == 0 then',
            'if next({}) == nil then'
        ];
        
        const lines = code.split('\n');
        const result = [];
        
        for (let i = 0; i < lines.length; i++) {
            // Skip lines that are already control structures
            if (lines[i].includes('if ') || lines[i].includes('while ') || 
                lines[i].includes('for ') || lines[i].includes('function ')) {
                result.push(lines[i]);
                continue;
            }
            
            // Randomly wrap lines in fake conditions
            if (Math.random() < 0.2 && lines[i].trim() && !lines[i].trim().startsWith('--')) {
                const condition = fakeConditions[Math.floor(Math.random() * fakeConditions.length)];
                result.push(condition);
                result.push(`    ${lines[i]}`);
                result.push('end');
            } else {
                result.push(lines[i]);
            }
        }
        
        return result.join('\n');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ControlFlowFlattener = ControlFlowFlattener;
}
