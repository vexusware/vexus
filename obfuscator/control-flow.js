// Control Flow Flattening Module

class ControlFlow {
    flattenControlFlow(code, complexity = 'medium') {
        // Parse functions in the code
        const functions = this.extractFunctions(code);
        
        let result = code;
        
        functions.forEach(func => {
            const flattened = this.flattenFunction(func, complexity);
            result = result.replace(func.body, flattened);
        });
        
        return result;
    }

    extractFunctions(code) {
        const functions = [];
        const functionRegex = /\bfunction\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)\s*(.*?)\bend\b/gs;
        
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            functions.push({
                name: match[1],
                params: match[2],
                body: match[3],
                fullMatch: match[0]
            });
        }
        
        return functions;
    }

    flattenFunction(func, complexity) {
        const lines = func.body.split('\n');
        const flattened = [];
        
        // Add dispatcher variable
        flattened.push(`local ${this.generateDispatcherName()} = 1`);
        flattened.push(`local ${this.generateStateName()} = {`);
        
        // Create states for each significant line
        const states = [];
        let stateId = 1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('--')) {
                states.push({
                    id: stateId++,
                    code: line
                });
            }
        }
        
        // Add state transitions
        states.forEach((state, index) => {
            flattened.push(`  [${state.id}] = function()`);
            flattened.push(`    ${state.code}`);
            
            if (index < states.length - 1) {
                // Transition to next state
                flattened.push(`    ${this.generateDispatcherName()} = ${states[index + 1].id}`);
            } else {
                // Last state
                flattened.push(`    ${this.generateDispatcherName()} = -1`);
            }
            
            flattened.push(`  end,`);
        });
        
        flattened.push(`}`);
        
        // Add dispatcher loop
        flattened.push(`while ${this.generateDispatcherName()} ~= -1 do`);
        flattened.push(`  local stateFunc = ${this.generateStateName()}[${this.generateDispatcherName()}]`);
        flattened.push(`  if stateFunc then`);
        flattened.push(`    stateFunc()`);
        flattened.push(`  else`);
        flattened.push(`    break`);
        flattened.push(`  end`);
        flattened.push(`end`);
        
        // Add junk code based on complexity
        if (complexity === 'high') {
            this.addJunkCode(flattened);
        }
        
        return flattened.join('\n');
    }

    generateDispatcherName() {
        const names = ['_disp', '_switch', '_ctrl', '_flow', '_state_machine'];
        return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
    }

    generateStateName() {
        const names = ['_states', '_funcs', '_blocks', '_labels', '_jumps'];
        return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
    }

    addJunkCode(codeLines) {
        const junkTemplates = [
            `local _junk${Math.floor(Math.random() * 1000)} = function() return math.random(1, 1000) end`,
            `if false then for i = 1, 10 do end end`,
            `local _tmp${Math.floor(Math.random() * 1000)} = {${Array.from({length: 5}, () => Math.floor(Math.random() * 100)).join(', ')}}`,
            `repeat until true`,
            `while false do print("never") end`
        ];
        
        // Insert junk code at random positions
        const insertCount = Math.floor(codeLines.length * 0.3);
        for (let i = 0; i < insertCount; i++) {
            const insertPos = Math.floor(Math.random() * codeLines.length);
            const junk = junkTemplates[Math.floor(Math.random() * junkTemplates.length)];
            codeLines.splice(insertPos, 0, junk);
        }
    }
}
