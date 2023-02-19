const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

/**
 * 
 * @param {String[]} embeds 
 * @param {Object} options
 */

async function embedBuilder(data, options) {

    let totalTrophies = 0,
        totalMembers = 0,
        totalClubs = data.length || 0,
        totalRequired = 0,
        totalVp = 0,
        totalS = 0,
        totalM = 0;

    let clubEmbeds = [];
    await splitChunk(data).forEach(async (club) => {
        const embed = new MessageEmbed()
            .setColor(options.color2)
            .setTitle(options.title2)
            .setThumbnail(options.thumbnail)
            .setTimestamp()
            .setFooter(`${options.footer2} | Last Updated`);
        if (options.image2) {
            embed.setImage(image2);
        };

        if (options.footerUrl) {
            embed.setFooter(`${options.footer2} | Last Updated`, options.footerUrl);
        }

        await club.forEach((x) => {
            totalTrophies = totalTrophies + x.trophies;
            totalMembers = totalMembers + x.members.length || 0;
            totalRequired = totalRequired + x.requiredTrophies || 0;
            totalS = totalS + x.members.filter(d => d.role === 'senior').length || 0;
            totalVp = totalVp + x.members.filter(d => d.role === 'vicePresident').length || 0;
            totalM = totalM + x.members.filter(d => d.role === 'member').length || 0;

            const president = x.members.find(p => p.role === 'president');
            /* WIP
            let onlineMembers = await fetchAPI(x.tag);
            if(!onlineMembers.status) onlineMembers = "Unknown";
            */
            const field = [
                `🔗 [Link: \`${x.tag}\`](https://brawlify.com/stats/club/${x.tag.replace("#", "")})`,
                `${entrance(x)}`,
                `<:Trophy_H:794043128432427009> **${separate(x.trophies)}**`,
                `<:Required_Trophies:789425152789053451>  **Req: ${separate(x.requiredTrophies)}**`,
                `<:Member:792430014326898740> **${x.members.length}/100**`,
                `<:President:789425708929253396> [${president.name}](https://brawlify.com/stats/profile/${president.tag.replace("#", "")})`,
            ]
            embed.addField(`${x.name}`, field.join("\n"), true)
        });
        clubEmbeds.push(embed);
    });

    const overViewEmbed = new MessageEmbed()
        .setColor(options.color1)
        .setTitle(options.title1)
        .setThumbnail(options.thumbnail)
        .setTimestamp()
        .setFooter(`${options.footer1} | Last Updated`);
    if (options.image1) {
        overViewEmbed.setImage(options.image1);
    };

    if (options.footerUrl) {
        overViewEmbed.setFooter(`${options.footer1} | Last Updated`, options.footerUrl);
    }
    await overViewEmbed.addFields(
        {
            name: `Total Clubs`,
            value: `<:Club:789421935967862785> ${separate(totalClubs) || "0"}`,
            inline: true
        },
        {
            name: `Total Trophies`,
            value: `<:Club_Trophies:789425841661804544> ${separate(totalTrophies)}`,
            inline: true
        },
        {
            name: `Average Trophies`,
            value: `<:Trophy_B:794043009699545089> ${separate(totalTrophies / totalClubs)}`,
            inline: true
        },
        {
            name: `Average Required`,
            value: `<:Trophy_R:820529622638395463> ${separate(totalRequired / totalClubs)}`,
            inline: true
        },
        {
            name: `Average Members`,
            value: `<:Members:789425597742972948> ${separate(totalMembers / totalClubs)} / 100`,
            inline: true
        },
        {
            name: `Members Information`,
            value: `<:Member:792430014326898740> **Members**: ${separate(totalM)}\n<:Seniors:789425351768014888> **Seniors**: ${totalS}\n<:VicePresidents:789425469375119360> **Vice-Presidents**: ${separate(totalVp)}\n<:President:789425708929253396> **Presidents**: ${separate(totalClubs)}\n\n<:Description:792420384732872784> **Total Members**: ${separate(totalMembers)} / ${separate(totalClubs * 100)}`,
            inline: false
        })


    return [overViewEmbed, ...clubEmbeds];
}

module.exports = embedBuilder;

function splitChunk(array, chunk) {
    const inputArray = array;
    var perChunk = chunk || 15;
    var result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
    return result;
}

function separate(x) {
    const o = Math.round(x);
    return o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function entrance(club) {
    const type = club.type.toString().toLowerCase();
    if (type === "open") return "<:Open:792418812397748264> **Open**";
    if (type === "closed") return "<:Closed:809420167230128188> **Closed**";
    if (type === "inviteonly") return "<:Invite_Only:792419406038433872> **Invite-Only**";

    else return `NOT_FOUND`
}

async function fetchAPI(tag) {
    try {
        const res = await fetch(`https://database.screeneros.repl.co/api/statistics/club/${tag.replace("#", "")}`, {
            headers: {
                "Authorization": "Bearer 1234567890"
            }
        }).then(res => res.json());
        return res;
    } catch (e) {
        return {
            status: false
        }
    }
}