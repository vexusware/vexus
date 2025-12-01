local Games = loadstring(game:HttpGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/notif.vexusware.lua"))()

local URL = Games[game.GameId]

if URL then
  loadstring(game:HttpGet(URL))()
end
