local games = {
    [82321750197896] = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/games/Poop%20a%20Brainrot/main.lua",
    [113604074601559] = "https://github.com/vexusware/vexusware.github.io/blob/main/src/games/Build%20a%20Beehive/main.lua",
    [2753915549] = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/games/Blox%20Fruit/main.lua",
    [4442272183] = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/games/Blox%20Fruit/main.lua",
    [7449423635] = "https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/games/Blox%20Fruit/main.lua",
    [10324346056] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [9872472334] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [10662542523] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [10324347967] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [121271605799901] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [10808838353] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [11353528705] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Evade/main.lua",
    [12334109280] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Guts%20and%20Blackpowder/main.lua",
    [14216737767] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Guts%20and%20Blackpowder/main.lua",
    [93978595733734] = "https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/games/Violence%20District/main.lua",

}

local currentID = game.PlaceId
local scriptURL = games[currentID]

if scriptURL then
    loadstring(game:HttpGet(scriptURL))()
else
    game.Players.LocalPlayer:Kick("Yo! This game ain't on the list.\nCheck the Discord for whitelisted games, homie.")
end
