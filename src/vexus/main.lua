local Games = loadstring(game:HttpGet("https://vexusware.github.io/src/vexus/vexusware.lua"))()

local URL = Games[game.GameId]

if URL then
  loadstring(game:HttpGet(URL))()
end
