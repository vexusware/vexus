local Games = loadstring(game:HttpGet("https://raw.githubusercontent.com/vexusware/vexus/refs/heads/main/src/vexus/vexusware.lua"))()

local URL = Games[game.GameId]

if URL then
  loadstring(game:HttpGet(URL))()
end
