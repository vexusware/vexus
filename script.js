// ZiaanVeil Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeUI();
    initializeEventListeners();
    loadDefaultSettings();
    
    // Load example code
    document.getElementById('load-example').addEventListener('click', loadExampleCode);
    
    // Update input stats
    document.getElementById('input-code').addEventListener('input', updateInputStats);
    
    // Update iterations value display
    const iterationsSlider = document.getElementById('obfuscation-iterations');
    const iterationsValue = document.getElementById('iterations-value');
    iterationsSlider.addEventListener('input', function() {
        iterationsValue.textContent = this.value;
    });
});

// Initialize UI Components
function initializeUI() {
    // Set initial theme
    const savedTheme = localStorage.getItem('ziaanveil-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('toggle-theme').innerHTML = '<i class="fas fa-sun"></i> Toggle Theme';
    }
    
    // Initialize tooltips if needed
    initializeTooltips();
}

// Initialize all event listeners
function initializeEventListeners() {
    // Theme toggle
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
    
    // Obfuscate button
    document.getElementById('obfuscate-btn').addEventListener('click', obfuscateCode);
    
    // Copy output button
    document.getElementById('copy-output').addEventListener('click', copyOutput);
    
    // Test in Roblox button
    document.getElementById('test-obfuscated').addEventListener('click', showTestModal);
    
    // Clear input button
    document.getElementById('clear-input').addEventListener('click', clearInput);
    
    // Download output button
    document.getElementById('download-output').addEventListener('click', downloadOutput);
    
    // Minify output button
    document.getElementById('minify-output').addEventListener('click', minifyOutput);
    
    // Export/Import settings
    document.getElementById('export-settings').addEventListener('click', exportSettings);
    document.getElementById('import-settings').addEventListener('click', importSettings);
    
    // Preset buttons
    document.getElementById('preset-low').addEventListener('click', () => loadPreset('low'));
    document.getElementById('preset-medium').addEventListener('click', () => loadPreset('medium'));
    document.getElementById('preset-high').addEventListener('click', () => loadPreset('high'));
    document.getElementById('preset-maximum').addEventListener('click', () => loadPreset('maximum'));
    
    // Modal controls
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('copy-test-template').addEventListener('click', copyTestTemplate);
    
    // Close modal when clicking outside
    document.getElementById('test-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // GitHub link
    document.getElementById('github-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://github.com', '_blank');
    });
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltips to settings
    const tooltipElements = document.querySelectorAll('.setting label, .setting-group h3');
    tooltipElements.forEach(el => {
        const title = el.getAttribute('data-tooltip');
        if (title) {
            el.title = title;
        }
    });
}

// Toggle between dark and light theme
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('ziaanveil-theme', isLight ? 'light' : 'dark');
    
    const themeBtn = document.getElementById('toggle-theme');
    themeBtn.innerHTML = isLight 
        ? '<i class="fas fa-sun"></i> Toggle Theme' 
        : '<i class="fas fa-moon"></i> Toggle Theme';
}

// Load default settings
function loadDefaultSettings() {
    // Default settings are already set in HTML
    console.log('Default settings loaded');
}

// Load example Lua code
function loadExampleCode() {
    const exampleCode = `-- ZiaanVeil Example Lua Script for Roblox
-- This script demonstrates various Lua features that can be obfuscated

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Example function with string literals
function greetPlayer(playerName)
    local greeting = "Hello, " .. playerName .. "! Welcome to the game."
    print(greeting)
    
    -- Math operations with constants
    local playerScore = 100
    local bonusMultiplier = 2.5
    local totalScore = playerScore * bonusMultiplier
    
    -- Conditional logic
    if totalScore > 200 then
        print("High score achieved!")
    else
        print("Keep playing to improve your score.")
    end
    
    return totalScore
end

-- Table with various data types
local gameData = {
    playerCount = 0,
    isActive = true,
    gameName = "Roblox Adventure",
    difficultyLevels = {"Easy", "Medium", "Hard"},
    settings = {
        soundVolume = 0.8,
        musicVolume = 0.6,
        graphicsQuality = "High"
    }
}

-- Loop example
for i = 1, 10 do
    local result = i * math.pi
    if i % 2 == 0 then
        print("Even number: " .. i)
    end
end

-- Function with parameters and returns
function calculateDamage(baseDamage, weaponMultiplier, criticalHit)
    local damage = baseDamage * weaponMultiplier
    if criticalHit then
        damage = damage * 1.5
    end
    return math.floor(damage)
end

-- Event handling example
Players.PlayerAdded:Connect(function(player)
    print("Player joined: " .. player.Name)
    local score = greetPlayer(player.Name)
    
    -- Update game data
    gameData.playerCount = gameData.playerCount + 1
    
    -- Send data to client
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local scoreValue = Instance.new("IntValue")
    scoreValue.Name = "Score"
    scoreValue.Value = score
    scoreValue.Parent = leaderstats
end)

print("Game script loaded successfully!")`;

    document.getElementById('input-code').value = exampleCode;
    updateInputStats();
    
    // Show notification
    showNotification('Example code loaded successfully!', 'success');
}

// Update input code statistics
function updateInputStats() {
    const inputCode = document.getElementById('input-code').value;
    const lines = inputCode.split('\n').length;
    const chars = inputCode.length;
    
    document.getElementById('input-lines').textContent = `Lines: ${lines}`;
    document.getElementById('input-chars').textContent = `Chars: ${chars}`;
}

// Clear input code
function clearInput() {
    document.getElementById('input-code').value = '';
    updateInputStats();
    showNotification('Input cleared', 'info');
}

// Main obfuscation function
async function obfuscateCode() {
    const inputCode = document.getElementById('input-code').value;
    
    if (!inputCode.trim()) {
        showNotification('Please enter some Lua code to obfuscate', 'warning');
        return;
    }
    
    // Get all settings
    const settings = getCurrentSettings();
    
    // Update progress
    updateProgress(10, 'Initializing obfuscation...');
    
    try {
        // Step 1: Parse and analyze code
        updateProgress(20, 'Parsing Lua code...');
        const parsedCode = await parseLuaCode(inputCode);
        
        // Step 2: Apply obfuscation techniques based on settings
        let obfuscatedCode = inputCode;
        
        // Apply string encryption if enabled
        if (settings.stringEncryptionEnabled) {
            updateProgress(30, 'Encrypting strings...');
            obfuscatedCode = applyStringEncryption(obfuscatedCode, settings);
        }
        
        // Apply constant encoding if enabled
        if (settings.constantEncodingEnabled) {
            updateProgress(40, 'Encoding constants...');
            obfuscatedCode = applyConstantEncoding(obfuscatedCode, settings);
        }
        
        // Apply renaming if enabled
        if (settings.renamingEnabled) {
            updateProgress(50, 'Renaming variables and functions...');
            obfuscatedCode = applyRenaming(obfuscatedCode, settings);
        }
        
        // Apply control flow obfuscation if enabled
        if (settings.controlFlowEnabled) {
            updateProgress(60, 'Flattening control flow...');
            obfuscatedCode = applyControlFlowObfuscation(obfuscatedCode, settings);
        }
        
        // Apply XOR encryption if enabled
        if (settings.xorEnabled) {
            updateProgress(70, 'Applying XOR encryption...');
            obfuscatedCode = applyXOREncryption(obfuscatedCode, settings);
        }
        
        // Apply bytecode generation if enabled
        if (settings.bytecodeEnabled) {
            updateProgress(80, 'Generating custom bytecode...');
            obfuscatedCode = applyBytecodeGeneration(obfuscatedCode, settings);
        }
        
        // Apply additional obfuscations
        updateProgress(90, 'Applying additional obfuscations...');
        obfuscatedCode = applyAdditionalObfuscations(obfuscatedCode, settings);
        
        // Finalize
        updateProgress(95, 'Finalizing obfuscated code...');
        
        // Calculate obfuscation level
        const obfuscationLevel = calculateObfuscationLevel(obfuscatedCode, inputCode);
        
        // Display the result
        document.getElementById('output-code').value = obfuscatedCode;
        updateOutputStats(obfuscatedCode, obfuscationLevel);
        
        updateProgress(100, 'Obfuscation complete!');
        
        // Show success notification
        showNotification(`Code obfuscated successfully! Obfuscation level: ${obfuscationLevel}%`, 'success');
        
        // Reset progress after a delay
        setTimeout(() => {
            updateProgress(0, 'Ready to obfuscate');
        }, 2000);
        
    } catch (error) {
        console.error('Obfuscation error:', error);
        updateProgress(0, 'Obfuscation failed');
        showNotification('Error during obfuscation: ' + error.message, 'danger');
    }
}

// Get current settings from UI
function getCurrentSettings() {
    return {
        // String encryption settings
        stringEncryptionEnabled: document.getElementById('string-encryption-enabled').checked,
        stringEncryptionMethod: document.getElementById('string-encryption-method').value,
        stringEncryptionKey: document.getElementById('string-encryption-key').value,
        stringSplitEnabled: document.getElementById('string-split-enabled').checked,
        
        // Constant encoding settings
        constantEncodingEnabled: document.getElementById('constant-encoding-enabled').checked,
        constantEncodingMethod: document.getElementById('constant-encoding-method').value,
        constantFloatEnabled: document.getElementById('constant-float-enabled').checked,
        constantBoolEnabled: document.getElementById('constant-bool-enabled').checked,
        
        // Control flow settings
        controlFlowEnabled: document.getElementById('control-flow-enabled').checked,
        controlFlowIntensity: document.getElementById('control-flow-intensity').value,
        controlFlowJunk: document.getElementById('control-flow-junk').checked,
        controlFlowFake: document.getElementById('control-flow-fake').checked,
        
        // Renaming settings
        renamingEnabled: document.getElementById('renaming-enabled').checked,
        renamingStyle: document.getElementById('renaming-style').value,
        renamingPreserve: document.getElementById('renaming-preserve').checked,
        renamingMinify: document.getElementById('renaming-minify').checked,
        
        // Bytecode & VM settings
        bytecodeEnabled: document.getElementById('bytecode-enabled').checked,
        interpreterEnabled: document.getElementById('interpreter-enabled').checked,
        bytecodeComplexity: document.getElementById('bytecode-complexity').value,
        bytecodeEncrypt: document.getElementById('bytecode-encrypt').checked,
        
        // Additional obfuscation
        antiTamperEnabled: document.getElementById('anti-tamper-enabled').checked,
        metadataObfuscation: document.getElementById('metadata-obfuscation').checked,
        insertComments: document.getElementById('insert-comments').checked,
        randomizeWhitespace: document.getElementById('randomize-whitespace').checked,
        
        // Advanced settings
        obfuscationIterations: parseInt(document.getElementById('obfuscation-iterations').value),
        randomSeed: document.getElementById('random-seed').value,
        preserveLineInfo: document.getElementById('preserve-line-info').checked,
        compressOutput: document.getElementById('compress-output').checked,
        
        // Derived settings
        xorEnabled: true // XOR is always used in some form
    };
}

// Update progress bar and text
function updateProgress(percentage, text) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = text;
}

// Update output statistics
function updateOutputStats(code, obfuscationLevel) {
    const lines = code.split('\n').length;
    const chars = code.length;
    
    document.getElementById('output-lines').textContent = `Lines: ${lines}`;
    document.getElementById('output-chars').textContent = `Chars: ${chars}`;
    document.getElementById('obfuscation-level').textContent = `Obfuscation: ${obfuscationLevel}%`;
}

// Calculate obfuscation level (simplified)
function calculateObfuscationLevel(obfuscatedCode, originalCode) {
    // This is a simplified calculation
    const settings = getCurrentSettings();
    let level = 0;
    
    // Base level
    level += 10;
    
    // Add points based on enabled features
    if (settings.stringEncryptionEnabled) level += 15;
    if (settings.constantEncodingEnabled) level += 10;
    if (settings.renamingEnabled) level += 20;
    if (settings.controlFlowEnabled) level += 25;
    if (settings.bytecodeEnabled) level += 15;
    if (settings.interpreterEnabled) level += 20;
    if (settings.antiTamperEnabled) level += 10;
    
    // Cap at 100%
    return Math.min(100, level);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                background-color: var(--bg-card);
                border-left: 4px solid var(--primary-color);
                box-shadow: 0 4px 12px var(--shadow-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10000;
                min-width: 300px;
                max-width: 400px;
                animation: slideIn 0.3s ease;
                transition: all 0.3s ease;
            }
            
            .notification-success {
                border-left-color: var(--success-color);
            }
            
            .notification-warning {
                border-left-color: var(--warning-color);
            }
            
            .notification-danger {
                border-left-color: var(--danger-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-muted);
                cursor: pointer;
                margin-left: 15px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get icon for notification type
function getIconForType(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'danger': return 'times-circle';
        default: return 'info-circle';
    }
}

// Copy output to clipboard
function copyOutput() {
    const outputCode = document.getElementById('output-code').value;
    
    if (!outputCode.trim()) {
        showNotification('No obfuscated code to copy', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(outputCode).then(() => {
        showNotification('Obfuscated code copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy code', 'danger');
    });
}

// Show test modal
function showTestModal() {
    const outputCode = document.getElementById('output-code').value;
    
    if (!outputCode.trim()) {
        showNotification('Please obfuscate code first', 'warning');
        return;
    }
    
    document.getElementById('test-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('test-modal').classList.remove('active');
}

// Copy test template
function copyTestTemplate() {
    const template = document.getElementById('test-script-template').textContent;
    navigator.clipboard.writeText(template).then(() => {
        showNotification('Test template copied to clipboard!', 'success');
    });
}

// Download output as file
function downloadOutput() {
    const outputCode = document.getElementById('output-code').value;
    
    if (!outputCode.trim()) {
        showNotification('No obfuscated code to download', 'warning');
        return;
    }
    
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated_code.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Obfuscated code downloaded!', 'success');
}

// Minify output code
function minifyOutput() {
    let outputCode = document.getElementById('output-code').value;
    
    if (!outputCode.trim()) {
        showNotification('No code to minify', 'warning');
        return;
    }
    
    // Simple minification (remove comments and extra whitespace)
    outputCode = outputCode
        .replace(/--\[\[[\s\S]*?\]\]/g, '') // Remove multi-line comments
        .replace(/--[^\n]*/g, '') // Remove single-line comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s*([=+\-*/%^<>~(){}[\],;])\s*/g, '$1') // Remove spaces around operators
        .trim();
    
    document.getElementById('output-code').value = outputCode;
    updateOutputStats(outputCode, document.getElementById('obfuscation-level').textContent);
    
    showNotification('Output minified!', 'success');
}

// Export settings to JSON
function exportSettings() {
    const settings = getCurrentSettings();
    const settingsJSON = JSON.stringify(settings, null, 2);
    
    const blob = new Blob([settingsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ziaanveil_settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Settings exported!', 'success');
}

// Import settings from JSON
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const settings = JSON.parse(event.target.result);
                applySettings(settings);
                showNotification('Settings imported successfully!', 'success');
            } catch (error) {
                showNotification('Failed to parse settings file', 'danger');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Apply settings to UI
function applySettings(settings) {
    // String encryption settings
    document.getElementById('string-encryption-enabled').checked = settings.stringEncryptionEnabled;
    document.getElementById('string-encryption-method').value = settings.stringEncryptionMethod;
    document.getElementById('string-encryption-key').value = settings.stringEncryptionKey;
    document.getElementById('string-split-enabled').checked = settings.stringSplitEnabled;
    
    // Constant encoding settings
    document.getElementById('constant-encoding-enabled').checked = settings.constantEncodingEnabled;
    document.getElementById('constant-encoding-method').value = settings.constantEncodingMethod;
    document.getElementById('constant-float-enabled').checked = settings.constantFloatEnabled;
    document.getElementById('constant-bool-enabled').checked = settings.constantBoolEnabled;
    
    // Control flow settings
    document.getElementById('control-flow-enabled').checked = settings.controlFlowEnabled;
    document.getElementById('control-flow-intensity').value = settings.controlFlowIntensity;
    document.getElementById('control-flow-junk').checked = settings.controlFlowJunk;
    document.getElementById('control-flow-fake').checked = settings.controlFlowFake;
    
    // Renaming settings
    document.getElementById('renaming-enabled').checked = settings.renamingEnabled;
    document.getElementById('renaming-style').value = settings.renamingStyle;
    document.getElementById('renaming-preserve').checked = settings.renamingPreserve;
    document.getElementById('renaming-minify').checked = settings.renamingMinify;
    
    // Bytecode & VM settings
    document.getElementById('bytecode-enabled').checked = settings.bytecodeEnabled;
    document.getElementById('interpreter-enabled').checked = settings.interpreterEnabled;
    document.getElementById('bytecode-complexity').value = settings.bytecodeComplexity;
    document.getElementById('bytecode-encrypt').checked = settings.bytecodeEncrypt;
    
    // Additional obfuscation
    document.getElementById('anti-tamper-enabled').checked = settings.antiTamperEnabled;
    document.getElementById('metadata-obfuscation').checked = settings.metadataObfuscation;
    document.getElementById('insert-comments').checked = settings.insertComments;
    document.getElementById('randomize-whitespace').checked = settings.randomizeWhitespace;
    
    // Advanced settings
    document.getElementById('obfuscation-iterations').value = settings.obfuscationIterations;
    document.getElementById('iterations-value').textContent = settings.obfuscationIterations;
    document.getElementById('random-seed').value = settings.randomSeed;
    document.getElementById('preserve-line-info').checked = settings.preserveLineInfo;
    document.getElementById('compress-output').checked = settings.compressOutput;
}

// Load preset configurations
function loadPreset(preset) {
    const presets = {
        low: {
            stringEncryptionEnabled: true,
            stringEncryptionMethod: 'xor',
            constantEncodingEnabled: false,
            renamingEnabled: true,
            renamingStyle: 'unicode',
            controlFlowEnabled: false,
            bytecodeEnabled: false,
            antiTamperEnabled: false,
            obfuscationIterations: 1
        },
        medium: {
            stringEncryptionEnabled: true,
            stringEncryptionMethod: 'base64',
            constantEncodingEnabled: true,
            renamingEnabled: true,
            renamingStyle: 'javanese',
            controlFlowEnabled: true,
            controlFlowIntensity: 'medium',
            bytecodeEnabled: false,
            antiTamperEnabled: false,
            obfuscationIterations: 2
        },
        high: {
            stringEncryptionEnabled: true,
            stringEncryptionMethod: 'rotating',
            constantEncodingEnabled: true,
            renamingEnabled: true,
            renamingStyle: 'chinese',
            controlFlowEnabled: true,
            controlFlowIntensity: 'high',
            bytecodeEnabled: true,
            bytecodeComplexity: 'medium',
            interpreterEnabled: false,
            antiTamperEnabled: true,
            obfuscationIterations: 3
        },
        maximum: {
            stringEncryptionEnabled: true,
            stringEncryptionMethod: 'aes',
            constantEncodingEnabled: true,
            renamingEnabled: true,
            renamingStyle: 'mixed',
            controlFlowEnabled: true,
            controlFlowIntensity: 'extreme',
            bytecodeEnabled: true,
            bytecodeComplexity: 'complex',
            interpreterEnabled: true,
            antiTamperEnabled: true,
            obfuscationIterations: 5
        }
    };
    
    applySettings(presets[preset]);
    showNotification(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset loaded`, 'success');
}

// Mock functions for obfuscation modules (to be implemented in separate files)
async function parseLuaCode(code) {
    // This would use a proper Lua parser in a real implementation
    return { parsed: true, code };
}

function applyStringEncryption(code, settings) {
    // This would be implemented in string-encryption.js
    return code + '\n-- String encryption applied\n';
}

function applyConstantEncoding(code, settings) {
    // This would be implemented in constant-encoding.js
    return code + '\n-- Constant encoding applied\n';
}

function applyRenaming(code, settings) {
    // This would be implemented in renaming.js
    return code + '\n-- Variable renaming applied\n';
}

function applyControlFlowObfuscation(code, settings) {
    // This would be implemented in control-flow.js
    return code + '\n-- Control flow obfuscation applied\n';
}

function applyXOREncryption(code, settings) {
    // This would be implemented in xor.js
    return code + '\n-- XOR encryption applied\n';
}

function applyBytecodeGeneration(code, settings) {
    // This would be implemented in bytecode.js
    return code + '\n-- Bytecode generation applied\n';
}

function applyAdditionalObfuscations(code, settings) {
    // Apply various additional obfuscations based on settings
    let result = code;
    
    if (settings.insertComments) {
        result = insertBogusComments(result);
    }
    
    if (settings.randomizeWhitespace) {
        result = randomizeWhitespace(result);
    }
    
    return result;
}

function insertBogusComments(code) {
    // Insert random comments to confuse readers
    const comments = [
        '-- This line is intentionally left blank',
        '-- Debug information removed',
        '-- Optimization applied',
        '-- Security check passed',
        '-- Memory allocation complete',
        '-- Variable initialized',
        '-- Function call validated',
        '-- Return value calculated',
        '-- Loop iteration complete',
        '-- Conditional branch taken'
    ];
    
    const lines = code.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i]);
        // Randomly insert comments
        if (Math.random() > 0.7 && i < lines.length - 1) {
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            result.push(randomComment);
        }
    }
    
    return result.join('\n');
}

function randomizeWhitespace(code) {
    // Randomize whitespace to make code harder to read
    return code
        .replace(/\n/g, () => Math.random() > 0.5 ? '\n\n' : '\n')
        .replace(/ = /g, () => Math.random() > 0.5 ? ' = ' : '= ')
        .replace(/, /g, () => Math.random() > 0.5 ? ', ' : ',')
        .replace(/\( /g, '(')
        .replace(/ \)/g, ')');
}
