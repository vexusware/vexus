local function SafeRequest(url)
    local response

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
    elseif (xeno and xeno.request) then
        local r = xeno.request({Url = url, Method = "GET"})
        response = r and r.Body

    elseif game and game.HttpGet then
        local ok, result = pcall(function()
            return game:HttpGet(url)
        end)
        response = ok and result or nil
    end

    return response
end

local function SafeGet(url)
    local ok, result = pcall(function()
        return SafeRequest(url)
    end)
    return ok and result or nil
end

local dataURL = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/notif.vexusware.lua"
local database = SafeGet(dataURL)
if not database then return end

local Games = loadstring(database)()
if not Games then return end

local URL = Games[game.PlaceId]
if not URL then return end

local scriptData = SafeGet(URL)
if not scriptData then return end

loadstring(scriptData)()
