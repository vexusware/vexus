loadstring(game:HttpGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/notif.lua"))()

if _VexusExecuted then return end
_VexusExecuted = true

local function SafeGet(url)
    local success, result = pcall(function()
        if pcall(function() return game.HttpGet end) then
            return game:HttpGet(url, true)
        elseif pcall(function() return game:GetService("HttpService") end) then
            local http = game:GetService("HttpService")
            return http:GetAsync(url, true)
        end
        return nil
    end)
    
    if success and result then
        return result
    else
        warn("[Ziaan] Failed to fetch URL")
        return nil
    end
end

local function FixGitHubURL(url)
    if url:find("github.com") and url:find("/blob/") then
        url = url:gsub("github.com", "raw.githubusercontent.com")
        url = url:gsub("/blob/", "/")
    end
    return url
end

local config = SafeGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/main/src/vexus/vexusware.lua")
if not config then return end

local Games
local success, err = pcall(function()
    Games = loadstring(config)()
end)

if not success or type(Games) ~= "table" then
    warn("[Ziaan] Failed to parse configuration")
    return
end

local placeId = game.PlaceId
local URL = Games[placeId] or Games[tostring(placeId)]

if not URL then
    warn("[Ziaan] No script available for this game")
    return
end

URL = FixGitHubURL(URL)

local scriptContent = SafeGet(URL)
if not scriptContent then return end

local success, errorMsg = pcall(function()
    loadstring(scriptContent)()
end)

if not success then
    warn("[Ziaan] Error executing script")
end
