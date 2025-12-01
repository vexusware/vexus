-- Anti-duplikasi
if _VexusExecuted then return end
_VexusExecuted = true

local function SafeGet(url)
    local success, result = pcall(function()
        -- Coba berbagai metode HTTP
        if pcall(function() return game.HttpGet end) then
            return game:HttpGet(url, true)
        elseif pcall(function() return game:GetService("HttpService") end) then
            local http = game:GetService("HttpService")
            return http:GetAsync(url, true)
        else
            return nil
        end
    end)
    
    if success and result then
        return result
    else
        warn("[Vexus] Failed to fetch URL:", url)
        return nil
    end
end

local function FixGitHubURL(url)
    -- Konversi URL GitHub blob ke raw jika diperlukan
    if url:find("github.com") and url:find("/blob/") then
        url = url:gsub("github.com", "raw.githubusercontent.com")
        url = url:gsub("/blob/", "/")
    end
    return url
end

-- Ambil konfigurasi
print("[Vexus] Loading configuration...")
local config = SafeGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/main/src/vexus/vexusware.lua")

if not config then
    warn("[Vexus] Failed to load configuration")
    return
end

-- Load database games
local Games
local success, err = pcall(function()
    Games = loadstring(config)()
end)

if not success or type(Games) ~= "table" then
    warn("[Vexus] Failed to parse configuration:", err)
    return
end

-- Cek game saat ini
local placeId = game.PlaceId
print("[Vexus] Current Place ID:", placeId)
print("[Vexus] Available games in database:", #Games)

-- Konversi ke number jika diperlukan
local URL = Games[placeId] or Games[tostring(placeId)]

if not URL then
    warn("[Vexus] No script available for this game")
    
    -- Debug: Tampilkan semua game ID yang tersedia
    print("[Vexus] Available Game IDs:")
    for id in pairs(Games) do
        print("  -", id, type(id))
    end
    return
end

print("[Vexus] Found script URL:", URL)

-- Perbaiki URL jika diperlukan
URL = FixGitHubURL(URL)

-- Ambil script utama
print("[Vexus] Fetching main script...")
local scriptContent = SafeGet(URL)

if not scriptContent then
    warn("[Vexus] Failed to load main script")
    return
end

-- Eksekusi script
print("[Vexus] Executing main script...")
local success, errorMsg = pcall(function()
    loadstring(scriptContent)()
end)

if not success then
    warn("[Vexus] Error executing script:", errorMsg)
end

print("[Vexus] Execution completed")
