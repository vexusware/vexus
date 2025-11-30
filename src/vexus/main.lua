local games = {
  [82321750197896] = "https://ziaanbase.github.io/games/Poop%20a%20Brainrot/main.lua", -- PoopABrainRot  
  [113604074601559] = "https://ziaanbase.github.io/games/Build%20a%20Beehive/main.lua",  -- "Build a Beehive
  [2753915549] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 1
  [4442272183] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 2
  [7449423635] = "https://ziaanbase.github.io/games/Blox%20Fruit/main.lua", -- Blox Fruit Sea 3  
  [10324346056] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade Big Team
  [9872472334] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade EVADE
  [10662542523] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade Casual
  [10324347967] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade Social Space
  [121271605799901] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade Player Nextbots
  [10808838353] = "https://ziaanbase.github.io/games/Evade/main.lua", -- evade VC Only
  [11353528705] = "https://ziaanbase.github.io/games/Evade/main.lua",  -- evade Pro
  [12334109280] = "https://ziaanbase.github.io/games/Guts%20and%20Blackpowder/main.lua", -- Guns & Black Powder
  [14216737767] = "https://ziaanbase.github.io/games/Guts%20and%20Blackpowder/main.lua", -- Guns & Black Powder Mobile
  [93978595733734] = "https://ziaanbase.github.io/games/Violence%20District/main.lua", -- Violence District 
}

local currentID = game.PlaceId
local scriptURL = games[currentID]

if scriptURL then
    loadstring(game:HttpGet(scriptURL))()
else
    game.Players.LocalPlayer:Kick("Yo! This game ain't on the list.\nCheck the Discord for whitelisted games, homie.")
end
