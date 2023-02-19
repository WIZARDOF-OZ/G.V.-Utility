const { MessageAttachment, MessageEmbed } = require("discord.js");
const ChartJsImage = require("chartjs-to-image");
const DiscordInvite = require("discord-inv");
const fetch = require("node-fetch");
const moment = require("moment");
const chartColor = require("../../../JSON/Chart_Colors.json");

module.exports = {
    name: 'chart',
    category: "Information",
    requiredPermissions: [],
    execute: async (client, message, args, text, instance) => {
        const { guild, channel, author, member } = message;

        const argument = args[0] || "";

        switch (argument.toLowerCase()) {
            case "state":
            case "status":
                await guild.members.fetch();
                const all = await guild.members.cache;
                const online = all.filter(x => x.presence.status === "online").map(x => x.user.id).length || "0"
                const idle = all.filter(x => x.presence.status === "idle").map(x => x.user.id).length || "0"
                const dnd = all.filter(x => x.presence.status === "dnd").map(x => x.user.id).length || "0"
                const offline = all.filter(x => x.presence.status === "offline").map(x => x.user.id).length || "0"

                const res0 = await fetch(`https://proxy.statbot.net/servermemstatus/590184040808579082`).then(r => r.json());
                const res0Sorted = res0.statusFlow.sort((a, b) => new Date(moment.unix(a.unixTimestamp).toISOString()) - new Date(moment.unix(b.unixTimestamp).toISOString()));
                const stateColors = [
                    "#43B581", //Online
                    "#FAA61A", //Idle
                    "#F04747", //Dnd
                ]
                const myChart = new ChartJsImage();
                myChart.setConfig({
                    type: "line",
                    data: {
                        labels: res0Sorted.map(x => moment.unix(x.unixTimestamp).format("DD. MMM")),
                        datasets: [
                            {
                                borderColor: stateColors[0],
                                lineTension: 0.2,
                                data: res0Sorted.map(x => x.onlineCount)
                            },
                            {
                                borderColor: stateColors[1],
                                lineTension: 0.2,
                                data: res0Sorted.map(x => x.idleCount)
                            },
                            {
                                borderColor: stateColors[2],
                                lineTension: 0.2,
                                data: res0Sorted.map(x => x.dndCount)
                            }
                        ],
                    },
                    options: {
                        title: {
                            display: true,
                            text: `Member Account Status Trends | TKE`,
                            fontColor: "#FFFFFF"
                        },
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        }
                    }
                });
                myChart.setBackgroundColor("#1E1E1E");

                const buffer0 = await myChart.toBinary();
                const presenceEmbed = new MessageEmbed()
                    .setDescription(`>>> <:Online:804265466758823936> **Online:** ${online}\n<:Idle:804265515546968094> **Idle:** ${idle}\n<:Dnd:804265613861978134> **Do Not Disturb:** ${dnd}\n<:Offline:804265571436331029> **Offline:** ${offline}`)
                    .attachFiles(new MessageAttachment(buffer0, "chart.png"))
                    .setImage('attachment://chart.png');
                channel.send(presenceEmbed)
                break;

            case "link":
            case "invite":
                try {

                    const tlink = args[1]
                    if (!tlink) return channel.send("Please provide a discord invite link.");

                    const linkcode = DiscordInvite.getCodeFromUrl(tlink);
                    const serverInfo = await DiscordInvite.getInv(linkcode, null, true);

                    const ServerinfoEmbed = new MessageEmbed()
                        .setThumbnail(serverInfo.guild.iconURL)
                        .setDescription(`**Invite Link**: [Click Here](https://discord.gg/${serverInfo.code})`)
                        .addField(`Server Name`, serverInfo.guild.name || "Not_Found", true)
                        .addField(`Server ID`, serverInfo.guild.id || "Not_Found", true)
                        .addField(`Member Count (Approx)`, serverInfo.approximate_member_count || "Not_Found", false)
                        .addField(`Inviter`, `${serverInfo.inviter.tag} (${serverInfo.inviter.id})`, false);

                    channel.send(ServerinfoEmbed)
                } catch (error) {
                    channel.send(`Error while retrieveing the data.\nError-Code: \`${error}\``)
                }
                break;

            case "message":
            case "messages":
                const res = await fetch("https://proxy.statbot.net/servermessage/590184040808579082").then(res => res.json())
                const myChart2 = new ChartJsImage()
                myChart2.setConfig({
                    type: "line",
                    data: {
                        labels: res.data.sort((a, b) => new Date(moment.unix(a.unixTimestamp).toISOString()) - new Date(moment.unix(b.unixTimestamp).toISOString())).map(x => moment.unix(x.unixTimestamp).format("DD. MMM")),
                        datasets: [
                            {
                                data: res.data.sort((a, b) => new Date(moment.unix(a.unixTimestamp).toISOString()) - new Date(moment.unix(b.unixTimestamp).toISOString())).map(x => x.count),
                                backgroundColor: "#171717",
                                fill: true,
                                lineTension: 0.2
                            },
                        ],
                    },
                    options: {
                        title: {
                            display: true,
                            text: `Message Statistics | TKE`,
                            fontColor: "#FFFFFF"
                        },
                        legend: {
                            display: false,
                        }
                    }
                })
                myChart2.setBackgroundColor("#1E1E1E")
                const buffer = await myChart2.toBinary();
                const embed2 = new MessageEmbed()
                    .attachFiles(new MessageAttachment(buffer, 'chart.png'))
                    .setImage("attachment://chart.png");
                channel.send(embed2)
                break;

            case "memberflow":
            case "userflow":
                const res2 = await fetch(`https://proxy.statbot.net/serverhome/590184040808579082/memberflow`).then(res => res.json())
                const myChart3 = new ChartJsImage()
                myChart3.setConfig({
                    type: "line",
                    data: {
                        labels: res2.members.sort((a, b) => new Date(moment.unix(a.unixTimestamp).toISOString()) - new Date(moment.unix(b.unixTimestamp).toISOString())).map(x => moment.unix(x.unixTimestamp).format("DD. MMM")),
                        datasets: [
                            {
                                data: res2.members.sort((a, b) => new Date(moment.unix(a.unixTimestamp).toISOString()) - new Date(moment.unix(b.unixTimestamp).toISOString())).map(x => x.count),
                                backgroundColor: "#171717",
                                fill: true,
                                lineTension: 0.2
                            },
                        ],
                    },
                    options: {
                        title: {
                            display: true,
                            text: `Member Flow | TKE`,
                            fontColor: "#FFFFFF"
                        },
                        legend: {
                            display: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        }
                    }
                })
                myChart3.setBackgroundColor("#1E1E1E")
                const buffer2 = await myChart3.toBinary();
                const embed3 = new MessageEmbed()
                    .attachFiles(new MessageAttachment(buffer2, 'chart.png'))
                    .setImage("attachment://chart.png");
                channel.send(embed3)
                break;

            case "presence":
            case "activity":
                const res3 = await fetch(`https://proxy.statbot.net/serverhome/590184040808579082/activity`).then(r => r.json());
                const myChart4 = new ChartJsImage();
                myChart4.setConfig({
                    type: "bar",
                    data: {
                        labels: res3.activityFlow.map(x => x.name),
                        datasets: [
                            {
                                data: res3.activityFlow.map(x => x.count),
                                backgroundColor: res3.activityFlow.map((_, i) => chartColor.map(x => `#${x}`)[i] || null)
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: `Activity Info | TKE`,
                            fontColor: "#FFFFFF"
                        },
                        legend: {
                            display: false,
                        }
                    }
                })
                myChart4.setBackgroundColor("#1E1E1E")
                const buffer3 = await myChart4.toBinary();
                const embed4 = new MessageEmbed()
                    .attachFiles(new MessageAttachment(buffer3, 'chart.png'))
                    .setImage("attachment://chart.png");
                channel.send(embed4)
                break;
            default:
                const subCmds = [
                    `${instance.prefix}chart <status | state> - Shows the status of all server members.`,
                    `${instance.prefix}chart <message | messages> - Shows the message statistics.`,
                    `${instance.prefix}chart <memberflow | userflow> - Shows the member flow of the server.`,
                    `${instance.prefix}chart <activity | presence> - Shows the activity stats of members.`
                ]

                const embed = new MessageEmbed()
                    .setTitle(`Command: -chart`)
                    .addField(`Sub Commands`, subCmds.join("\n"));
                channel.send(embed)
                break;
        }
    }
}

/**
 const myChart = new ChartJsImage();
                myChart.setConfig({
                    type: 'pie',
                    data: {
                        labels: ["Online", "Idle", "Do Not Disturb", "Offline"],
                        datasets: [
                            {
                                data: [online, idle, dnd, offline],
                                backgroundColor: [
                                    "#43B581", //Online
                                    "#FAA61A", //Idle
                                    "#F04747", //Dnd
                                    "#747F8D" //Offline
                                ]
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            datalabels: {
                                display: false
                            },
                            outlabels: {
                                display: true
                            }
                        },
                        legend: {
                            labels: {
                                fontColor: "white",
                                fontSize: 18
                            }
                        }
                    }

                }).setBackgroundColor();
 */