local games = {
    ["82321750197896"] = "https://ziaanbase.github.io/games/Poop%20a%20Brainrot/main.lua", -- PoopABrainRot  
    ["113604074601559"] = "https://ziaanbase.github.io/games/Build%20a%20Beehive/main.lua", -- Build a Beehive
    ["2753915549"] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 1
    ["4442272183"] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 2
    ["7449423635"] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 3  
    ["10324346056"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade Big Team
    ["9872472334"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade EVADE
    ["10662542523"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade Casual
    ["10324347967"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade Social Space
    ["121271605799901"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade Player Nextbots
    ["10808838353"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade VC Only
    ["11353528705"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua", -- evade Pro
    ["12334109280"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Guts%20and%20Blackpowder/main.lua", -- Guts & Blackpowder
    ["14216737767"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Guts%20and%20Blackpowder/main.lua", -- Guts & Blackpowder Mobile
    ["93978595733734"] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Violence%20District/main.lua", -- Violence District 
}

local currentID = tostring(game.PlaceId) -- Convert to string untuk konsistensi
local scriptURL = games[currentID]

if scriptURL then
    local success, err = pcall(function()
        loadstring(game:HttpGet(scriptURL))()
    end)
    
    if not success then
        warn("Error loading script: " .. err)
        game.Players.LocalPlayer:Kick("Failed to load game script. Please try again.")
    end
else
    game.Players.LocalPlayer:Kick("Game not supported.\nCheck Discord for supported games.")
end
