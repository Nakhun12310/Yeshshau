local HttpService = game:GetService("HttpService")
local Player = game.Players.LocalPlayer

-- YOUR KEY
local script_key = "PASTEKEYHERE"

-- Check the key
local success, result = pcall(function()
    return HttpService:JSONDecode(game:HttpPost("https://getrealcookiehubscript.vercel.app/api/key.js", HttpService:JSONEncode({key = script_key}), Enum.HttpContentType.ApplicationJson, false))
end)

if success and result.valid then
    -- Key valid, load the hub
    (loadstring or load)(game:HttpGet("https://getrealcookiehubscript.vercel.app/api/Loader.lua"))()
else
    -- Key invalid or expired
    Player:Kick("Invalid or expired key. Please get a new key!")
end
