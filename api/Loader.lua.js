export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`

local HttpService = game:GetService("HttpService")

local blacklistUrl = "https://raw.githubusercontent.com/Nakhun12309/Blacklisted/main/User.lua"
local hubScriptUrl = "https://raw.githubusercontent.com/CookieHubScript/CookieLoader/main/Script.lua"

local function isBlacklisted()
    local success, result = pcall(function()
        return game:HttpGet(blacklistUrl)
    end)
    
    if not success then
        warn("Failed to fetch blacklist!")
        return false
    end

    local blacklistedUsers = {}
    for user in result:gmatch('"(.-)"') do
        table.insert(blacklistedUsers, user)
    end

    local playerName = game.Players.LocalPlayer.Name
    for _, blacklistedName in pairs(blacklistedUsers) do
        if playerName == blacklistedName then
            return true
        end
    end

    return false
end

if isBlacklisted() then
    game.Players.LocalPlayer:Kick("You are blacklisted from using this hub.")
    while true do wait() end
else
    loadstring(game:HttpGet(hubScriptUrl))()
end

  `);
}
