--// UNIVERSAL HTTP FUNCTION
local function SafeRequest(url)
    local response
    
    -- Prioritas fungsi modern
    if request then
        local r = request({Url = url, Method = "GET"})
        response = r and r.Body
    elseif http and http.request then
        local r = http.request({Url = url, Method = "GET"})
        response = r and r.Body
    elseif (syn and syn.request) then
        local r = syn.request({Url = url, Method = "GET"})
        response = r and r.Body
    elseif (fluxus and fluxus.request) then
        local r = fluxus.request({Url = url, Method = "GET"})
        response = r and r.Body
    elseif (delta and delta.request) then
        local r = delta.request({Url = url, Method = "GET"})
        response = r and r.Body

    -- Fallback ke HttpGet (executor lama)
    elseif game and game.HttpGet then
        local ok, result = pcall(function()
            return game:HttpGet(url)
        end)
        response = ok and result or nil
    end

    return response
end

-- Wrapper agar tetap aman
local function SafeGet(url)
    local ok, result = pcall(function()
        return SafeRequest(url)
    end)
    return ok and result or nil
end

--// LOAD NOTIFICATION SCRIPT
local function LoadNotification()
    local notifUrl = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/notif.vexusware.lua"
    local notifScript = SafeGet(notifUrl)
    if notifScript then
        loadstring(notifScript)()
    end
end

--// TRY METHOD 1 (UNIVERSAL HTTP)
local function TryMethod1()
    local success = false
    
    local dataURL = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/vexusware.lua"
    local database = SafeGet(dataURL)
    
    if database then
        local Games = loadstring(database)()
        if Games then
            -- Coba PlaceId terlebih dahulu
            local URL = Games[game.PlaceId]
            if not URL then
                -- Fallback ke GameId jika PlaceId tidak ditemukan
                URL = Games[game.GameId]
            end
            
            if URL then
                local scriptData = SafeGet(URL)
                if scriptData then
                    loadstring(scriptData)()
                    success = true
                end
            end
        end
    end
    
    return success
end

--// TRY METHOD 2 (DIRECT HTTPGET)
local function TryMethod2()
    local success = false
    
    -- Load notification
    LoadNotification()
    
    -- Try to get database directly
    local ok1, Games = pcall(function()
        return loadstring(game:HttpGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/vexusware.lua"))()
    end)
    
    if ok1 and Games then
        -- Coba PlaceId terlebih dahulu
        local URL = Games[game.PlaceId]
        if not URL then
            -- Fallback ke GameId jika PlaceId tidak ditemukan
            URL = Games[game.GameId]
        end
        
        if URL then
            local ok2, scriptData = pcall(function()
                return game:HttpGet(URL)
            end)
            
            if ok2 and scriptData then
                loadstring(scriptData)()
                success = true
            end
        end
    end
    
    return success
end

--// MAIN EXECUTION
local function Main()
    -- First, try Method 1 (Universal HTTP)
    local method1Success = TryMethod1()
    
    -- If Method 1 fails, try Method 2 (Direct HttpGet)
    if not method1Success then
        local method2Success = TryMethod2()
        
        -- If both methods fail
        if not method2Success then
            warn("ZiaanHub: Failed to load script using both methods.")
            LoadNotification() -- Still try to load notification if available
        end
    end
end

-- Run the main function
Main()
