function loadStatus(client) {
    const status = [
        {
            "status": "online",
            "activity": {
                "name": "for commands",
                "type": "WATCHING"
            }
        },
        {
            "status": "idle",
            "activity": {
                "name": "Anime",
                "type": "WATCHING"
            }
        },
        {
            "status": "idle",
            "activity": {
                "name": "TO MY DEV:WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ#4090 ",
                "type": "LISTENING"
            }
        },
         {
            "status": "online",
            "activity": {
                "name": "Dm me for help!",
                "type": "PLAYING"
            }
        },
        {
            "status": "dnd",
            "activity": {
                "name": `with ${client.users.cache.size} users!`,
                "type": "PLAYING"
            }
        },
        {
            "status": "online",
            "activity": {
                "name": "Dev:WIZARDOFOZᶫᵒᵛᵉᵧₒᵤ#4090",
                "type": "PLAYING"
            }
        }
    ]

    x = 0;
    setInterval(() => {
        if (x == status.length) return x = 0;
        client.user.setPresence(status[x])
        x++
    }, 1000 * 15)
}

module.exports = loadStatus;