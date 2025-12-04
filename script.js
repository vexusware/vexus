// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const fileInput = document.getElementById('fileInput');
    const browseLink = document.getElementById('browseLink');
    const obfLevel = document.getElementById('obfLevel');
    const levelValue = document.getElementById('levelValue');
    const varObf = document.getElementById('varObf');
    const antiTamper = document.getElementById('antiTamper');
    const stringEncrypt = document.getElementById('stringEncrypt');
    const controlFlow = document.getElementById('controlFlow');
    const deadCode = document.getElementById('deadCode');
    
    const lineCount = document.getElementById('lineCount');
    const varCount = document.getElementById('varCount');
    const sizeCount = document.getElementById('sizeCount');
    const securityLevel = document.getElementById('securityLevel');
    
    const obfuscator = new LuaObfuscator();
    
    // Update level value display
    obfLevel.addEventListener('input', function() {
        const levels = ['Rendah', 'Sedang', 'Tinggi'];
        levelValue.textContent = levels[this.value - 1];
    });
    
    // Load sample code
    sampleBtn.addEventListener('click', function() {
        const sampleCode = `-- Contoh script Lua untuk Roblox
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local hrp = character:WaitForChild("HumanoidRootPart")

function calculateDamage(baseDamage, multiplier)
    local totalDamage = baseDamage * multiplier
    if totalDamage > 100 then
        totalDamage = 100
    end
    return totalDamage
end

local items = {"Sword", "Shield", "Potion", "Armor"}
local inventory = {}

for i, itemName in pairs(items) do
    inventory[itemName] = {
        id = i,
        durability = 100,
        equipped = false
    }
end

local function equipItem(itemName)
    if inventory[itemName] then
        inventory[itemName].equipped = true
        print("Item equipped: " .. itemName)
        return true
    else
        warn("Item not found: " .. itemName)
        return false
    end
end

-- Main game loop
while true do
    wait(1)
    for itemName, data in pairs(inventory) do
        if data.equipped then
            data.durability = data.durability - 1
            if data.durability <= 0 then
                print(itemName .. " has broken!")
                data.equipped = false
            end
        end
    end
end`;
        
        inputCode.value = sampleCode;
        updateStats();
        showToast('Contoh kode dimuat!', 'success');
    });
    
    // Clear input
    clearBtn.addEventListener('click', function() {
        inputCode.value = '';
        outputCode.textContent = 'Hasil obfuscasi akan muncul di sini...';
        resetStats();
        showToast('Input dibersihkan!', 'info');
    });
    
    // File upload handling
    browseLink.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            inputCode.value = event.target.result;
            updateStats();
            showToast(`File "${file.name}" berhasil dimuat!`, 'success');
        };
        reader.readAsText(file);
    });
    
    // Drag and drop functionality
    const uploadArea = document.querySelector('.upload-area');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#4299e1';
        uploadArea.style.background = 'rgba(66, 153, 225, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#4a5568';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#4a5568';
        uploadArea.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (!file || !file.name.match(/\.(lua|luau|txt)$/i)) {
            showToast('Hanya file Lua/Luau yang didukung!', 'error');
            return;
        }
        
        fileInput.files = e.dataTransfer.files;
        const reader = new FileReader();
        reader.onload = function(event) {
            inputCode.value = event.target.result;
            updateStats();
            showToast(`File "${file.name}" berhasil dimuat!`, 'success');
        };
        reader.readAsText(file);
    });
    
    // Obfuscate button
    obfuscateBtn.addEventListener('click', function() {
        const code = inputCode.value.trim();
        if (!code) {
            showToast('Masukkan kode Lua terlebih dahulu!', 'error');
            return;
        }
        
        // Disable button dan tampilkan loading
        obfuscateBtn.disabled = true;
        obfuscateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        
        // Get options
        const options = {
            obfLevel: parseInt(obfLevel.value),
            varObf: varObf.value,
            antiTamper: antiTamper.checked,
            stringEncrypt: stringEncrypt.checked,
            controlFlow: controlFlow.checked,
            deadCode: deadCode.checked
        };
        
        // Lakukan obfuscation dengan timeout untuk mencegah blocking UI
        setTimeout(() => {
            try {
                const result = obfuscator.obfuscate(code, options);
                
                // Tampilkan hasil
                outputCode.textContent = result.code;
                
                // Update stats
                updateOutputStats(result.stats);
                
                // Enable tombol aksi
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
                
                showToast('Obfuscation berhasil!', 'success');
            } catch (error) {
                console.error('Obfuscation error:', error);
                outputCode.textContent = `-- Error saat obfuscation:\n-- ${error.message}\n\n-- Pastikan kode Lua Anda valid.`;
                showToast(`Error: ${error.message}`, 'error');
            } finally {
                // Reset button
                obfuscateBtn.disabled = false;
                obfuscateBtn.innerHTML = '<i class="fas fa-magic"></i> Obfuscate Kode';
            }
        }, 100);
    });
    
    // Copy output
    copyBtn.addEventListener('click', function() {
        if (outputCode.textContent.includes('Hasil obfuscasi akan muncul')) {
            showToast('Tidak ada kode untuk disalin!', 'error');
            return;
        }
        
        navigator.clipboard.writeText(outputCode.textContent)
            .then(() => {
                showToast('Kode berhasil disalin ke clipboard!', 'success');
            })
            .catch(err => {
                console.error('Copy failed:', err);
                showToast('Gagal menyalin kode!', 'error');
            });
    });
    
    // Download output
    downloadBtn.addEventListener('click', function() {
        if (outputCode.textContent.includes('Hasil obfuscasi akan muncul')) {
            showToast('Tidak ada kode untuk diunduh!', 'error');
            return;
        }
        
        const blob = new Blob([outputCode.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `obfuscated_${Date.now()}.lua`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('File berhasil diunduh!', 'success');
    });
    
    // Update input stats
    function updateStats() {
        const code = inputCode.value;
        const lines = code.split('\n').length;
        const size = (new TextEncoder().encode(code).length / 1024).toFixed(2);
        
        lineCount.textContent = lines;
        sizeCount.textContent = `${size} KB`;
        
        // Estimate variable count
        const varMatches = code.match(/\b(local|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g);
        const estimatedVars = varMatches ? varMatches.length : 0;
        varCount.textContent = estimatedVars;
    }
    
    // Update output stats
    function updateOutputStats(stats) {
        lineCount.textContent = stats.obfuscatedLength > 0 ? Math.ceil(stats.obfuscatedLength / 50) : 0;
        varCount.textContent = stats.variablesObfuscated;
        sizeCount.textContent = `${(stats.obfuscatedLength / 1024).toFixed(2)} KB`;
        
        const securityLevels = ['Rendah', 'Sedang', 'Tinggi'];
        securityLevel.textContent = securityLevels[stats.securityLevel - 1] || '-';
        securityLevel.style.color = stats.securityLevel === 3 ? '#2ecc71' : stats.securityLevel === 2 ? '#f1c40f' : '#e74c3c';

        if (stats.junkPercentage) {
        securityLevel.textContent += ` (${stats.junkPercentage}% junk)`;
    }
    
    // Reset stats
    function resetStats() {
        lineCount.textContent = '0';
        varCount.textContent = '0';
        sizeCount.textContent = '0 KB';
        securityLevel.textContent = '-';
        securityLevel.style.color = '';
    }
    
    // Toast notification
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';
        
        // Set color based on type
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        
        toast.style.borderLeftColor = colors[type] || '#3498db';
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Auto-update input stats
    inputCode.addEventListener('input', updateStats);
    
    // Initial stats update
    updateStats();
    
    // Display initial message
    console.log('Lua/Luau Obfuscator siap digunakan!');
});
