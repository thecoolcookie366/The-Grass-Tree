addLayer("qwertyuiopasdfghjklzxcvbnm", {
    name: "something", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🔊", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f42dad",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "decibels", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.12345, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(2)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (2)
        return exp
    },
    passiveGeneration() {
        let Gen = 1
        return Gen
    },
    autoUpgrade() {return true},
    upgrades: {
        11: {
            title: "so loud...",
            description: "get the 'loud' role in the discord server",
            cost: new Decimal("100"),
        },
        12: {
            title: "you too can be loud and annoying",
            description: "get the 'louder' role in the discord server",
            cost: new Decimal("1e50"),
        },
        13: {
            title: "how loud can you get?",
            description: "get the 'loudest' role in the discord server",
            cost: new Decimal("1e2500"),
        },
        14: {
            title: "okay you can stop now",
            description: "get the 'loudester' role in the discord server",
            cost: new Decimal("1e123456"),
        },
        15: {
            title: "no",
            description: "get the 'loudestest' role in the discord server",
            cost: new Decimal("1e8258258"),
        },

    },
    row: 101, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    canReset(){return false},


})

addLayer("p", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🍪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    nodeStyle: {
        background: "linear-gradient( #ff0000, #00ff00, #0000ff)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(0,0,0,0.5)",
        color: "rgb(255, 255, 255)",
    },
    color: "#ffffff",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('multi', 21)) mult = mult.times(upgradeEffect('multi', 21))
        if (hasUpgrade('s', 11)) mult = mult.times(upgradeEffect('s', 11))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('p', 41)) exp = exp.times(upgradeEffect('p', 41))
        if (hasUpgrade('exp', 11)) exp = exp.times(upgradeEffect('exp', 11))
        if (hasUpgrade('exp', 21)) exp = exp.pow(upgradeEffect('exp', 21))
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasUpgrade('s',11)) Gen = 0.1
        if(hasUpgrade('u',41)) Gen += 0.9
        if(inChallenge('sst',11)) Gen = 0
        return Gen
    },
    autoUpgrade() {return hasMilestone('lv', 0)},
    hotkeys:[{key:"p",description:"P: Reset for points (universe 1)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Points (Universe 1, Part 1/2)",
                titleStyle: {'color': '#8d8d8d'},
                body: "<b>Welcome to the first layer!</b> <br> Spacetime is your universal currency, which can be used for many things. <br> <i>Pro tip: Use the enter key to spam Points resets. (sorry mobile users)</i>",
                bodyStyle: {'background-color': "#313131"}
            }
        },
    branches:['e'],
    upgrades: {
        11: {
            title: "[#1] Start",
            description: "+1 spacetime per second.",
            cost: new Decimal(1),
        },

        21: {
            title: "[#2 1/5] Up! (about 100m)",
            description: "x3 spacetime.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade(this.layer, 11); }
        },

        22: {
            title: "[#2 2/5] Up! (about 10km)",
            description: "x3 spacetime again.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade(this.layer, 21); }
        },

        23: {
            title: "[#2 3/5] Up! (about 1 light year)",
            description: "x3 spacetime again again.",
            cost: new Decimal(40),
            unlocked() { return hasUpgrade(this.layer, 22); }
        },

        24: {
            title: "[#2 4/5] Up! (5 hours or so)",
            description: "x3 spacetime again again again.",
            cost: new Decimal(84),
            unlocked() { return hasUpgrade(this.layer, 23); }
        },

        25: {
            title: "[#2 5/5] Up! (okay let's go onto something new)",
            description: "x3 spacetime again<sup>2</sup>.",
            cost: new Decimal(150),
            unlocked() { return hasUpgrade(this.layer, 24); }
        },

        31: {
            title: "[#3] Hmm...",
            description: "x6 spacetime but /3 spacetime.",
            cost: new Decimal(315),
            unlocked() { return hasUpgrade(this.layer, 25); }
        },

        41: {
            title: "[#4] Yellow",
            description: "Unlock energy. Energy boosts points.",
            tooltip: "(E+5)^0.03",
            cost: new Decimal(420),
            unlocked() { return hasUpgrade(this.layer, 31); },
            effect() {
        return player.e.points.add(5).pow(0.03)
    },
    effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        51: {
            title: "[#5] Super Inflation",
            description: "Unlock Super. <i>Not required after doing your first super reset.</i>",
            cost: new Decimal(10e6),
            unlocked() { return hasUpgrade("e", 21); }
        },

        61: {
            title: "<i>Relic 2/7 - The Relic of Simplicity</i>",
            description: "<i>x100 spacetime. Nothing much to say about this one.</i> <h2>The new relic is here, somewhere.</h2>",
            cost: new Decimal(1e14),
            unlocked() { return hasUpgrade("plus", 31) && hasUpgrade("p", 51);},
        },

        71: {
            title: "[#6] Welcome back!",
            description: "Point upgrades are classic. For this one you get x1.11e111 spacetime. (I am not calling it 'all ones')",
            cost: new Decimal("1e655800"),
            unlocked() { return hasMilestone("lv", 0);},
        },

        72: {
            title: "[#7] Continue with the big numbers",
            description: "'all twos' x2.22e222 spacetime.",
            cost: new Decimal("1e657370"),
            unlocked() { return hasMilestone("lv", 0);},
        },

        73: {
            title: "[#8] Fine this one is called all OF THE fours",
            description: "Because you get x4.44e444 xp!",
            cost: new Decimal("1e660500"),
            unlocked() { return hasMilestone("lv", 1);},
        },

        81: {
            title: "[#9] hi",
            description: "This upgrade is literally unobtainable. Wait wrong layer. x1e15 spacetime!",
            cost: new Decimal("0"),
            unlocked() { return hasUpgrade("tierone", 11);},
        },
        82: {
            title: "[#10] hii",
            description: "Why does this have two i's!! x1e150 spacetime...",
            cost: new Decimal("1e100"),
            unlocked() { return hasUpgrade("tierone", 11);},
        },
        83: {
            title: "[#11] hiii",
            description: "Aren't these literally recovery upgrades... x1e1.5k spacetime",
            cost: new Decimal("1e100000"),
            unlocked() { return hasUpgrade("tierone", 11);},
        },
        84: {
            title: "[#12] hiiii",
            description: "Stop it and just take the 1e15k spacetime multi!",
            cost: new Decimal("1e100e6"),
            unlocked() { return hasUpgrade("tierone", 11);},
        },
        85: {
            title: "[#13] hiiiii",
            description: "ENOUGH STOP PUTTING THE LETTER I OVER AND OVER AGAIN. Like i said.. x1e150k spacetime.",
             cost: new Decimal("1e100e9"),
            unlocked() { return hasUpgrade("tierone", 11);},
        },

    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return !inChallenge('sst', 11)},


})

addLayer("np", {
    name: "negativepoints", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#1c1c1c",
    requires: new Decimal("1e1090"), // Can be a function that takes requirement increases into account
    resource: "negative points", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasMilestone('nm', 0)) exp = exp.times(20)
        if (hasMilestone('nm', 1)) exp = exp.times(20)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Negative Points (Universe 0, Part 2/1)",
                titleStyle: {'color': '#8d8d8d'},
                body: "<b>Welcome to the true first layer!</b> <br> DESCRIPTION NOT FOUND <br> <i>Use the click button to do resets!</i>",
                bodyStyle: {'background-color': "#313131"}
            }
        },
    branches:['p'],
    upgrades: {
        11: {
            title: "[#-1] Pre-Start",
            description: "-1 spacetime per second. (This actually does nothing, just unlocks the next upgrade)",
            cost: new Decimal(10000),
        },
        12: {
            title: "[#-2] Down!",
            description: "<i>/1e1,099 spacetime.</i>",
            cost: new Decimal(100000),
            unlocked() { return hasUpgrade("np", 11); }
        },
        13: {
            title: "[#-3] Wait a minute",
            description: "<i>-1x spacetime. Wait a minute are we going negative (also revert the effect of #-2)</i>",
            cost: new Decimal(1e6),
            unlocked() { return hasUpgrade("np", 12); }
        },
        14: {
            title: "[#-4] This upgrade is literally unobtainable",
            description: "hi",
            cost: new Decimal("1e1425000"),
            unlocked() { return hasUpgrade("np", 13); }
        },
        15: {
            title: "[#-5] More content?????",
            description: "If you followed my instructions correctly, you should've never gotten here... unless you already have the first Negative Magnet milestone. Unlock even more negative upgrades!",
            cost: new Decimal("1e1425100"),
            unlocked() { return hasUpgrade("np", 14); }
        },
        21: {
            title: "[#-6] Back at it",
            description: "Let's fix the points! Now you'll gain positive spacetime again.",
            cost: new Decimal("1e1425200"),
            onPurchase() {return player.points = new Decimal ("0")},
            unlocked() { return hasUpgrade("np", 15); }
        },
        22: {
            title: "[#-7] Added by PM, removed by NM, readded by NP",
            description: "And let's just bring back that x2.22e22,222 boost...",
            cost: new Decimal("1e1425300"),
            unlocked() { return hasUpgrade("np", 15); }
        },
        23: {
            title: "[#-8] No stop breaking the 4th wall",
            description: "^13 Positive Magnets.",
            cost: new Decimal("1e16823500"),
            unlocked() { return hasUpgrade("np", 15); }
        },
        24: {
            title: "[#-9] The void is coming",
            description: "1. -0x your spacetime. (does nothing... get it?)<br>2. Give a non-negative boost to spacetime of x1.23e45,678!",
            cost: new Decimal("1e241470000"),
            unlocked() { return hasUpgrade("np", 15); }
        },
        25: {
            title: "[#-10] The void is <i>here.</i>",
            description: "Unlock Void.",
            cost: new Decimal("1e698253000"),
            unlocked() { return hasUpgrade("np", 24); }
        },

    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return inChallenge('sst', 12)},


})

addLayer("v", {
    name: "void", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⨀", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#000000",
    requires: new Decimal("1e698256000"), // Can be a function that takes requirement increases into account
    resource: "voids", // Name of prestige currency
    baseResource: "negative points", // Name of resource prestige is based on
    baseAmount() {return player.np.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.000009, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Void (Universe 0, Part 3/1)",
                titleStyle: {'color': '#5c5c5c'},
                body: "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
                bodyStyle: {'background-color': "#1c1c1c"}
            }
        },
    branches:['np'],
    upgrades: {
        11: {
            title: "[#-11]",
            description: "What is going on...",
            cost: new Decimal(1),
            onPurchase() {
                completeChallenge('sst',12)
                doReset("sst", true)
                player.mm.points = new Decimal ("2")},
        },

    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade('np', 25)},


})

addLayer("e", {
    name: "energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#eaff00",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s', 11)) mult = mult.times(25)
        if (hasUpgrade('s', 21)) mult = mult.times(10000)
        if (hasUpgrade('u', 11)) mult = mult.times(1e6)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('exp', 21)) exp = exp.pow(upgradeEffect('exp', 21))
        return exp
    },
    update() {
        if (player.e.points.gt("100")) player.e.points = new Decimal("100")
    },
    passiveGeneration() {
        let Gen = 0
        if(hasUpgrade('u',41)) Gen = 100
        return Gen
    },
    autoUpgrade() {return hasMilestone('lv', 0)},
    hotkeys:[{key:"e",description:"E: Reset for energy (universe 1)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Energy (Universe 1, Part 2/2)",
                titleStyle: {'color': '#7d8900'},
                body: "<b>Welcome to Energy!</b> <br> This layer does not reset anything, your only goal is to get as much energy as possible. <br> <i>Remember: more energy means more points!</i>",
                bodyStyle: {'background-color': "#596100"}
            }
        },
    branches:['p'],
    upgrades: {
        11: {
            title: "[E1] Energy!",
            description: "Little boost to get you going. <b>x120</b> spacetime.",
            cost: new Decimal(3),
        },

        21: {
            title: "[E2] This isn't auto energy...",
            description: "But you like numbers, right? <h2>x1,000,000</h2> spacetime. Also unlock upgrade 5.",
            cost: new Decimal(6),
            unlocked() { return hasUpgrade(this.layer, 11); },
        },

        31: {
            title: "<i>Relic 3/7 - The Relic of Numbers</i>",
            description: "<i>You still like numbers, right? Okay then. For each energy, add +5M to the super gain multiplier, capping out at x500M. (+ unexplained spacetime boost)</i> <h2>No more relics until Ultra.</h2>",
            cost: new Decimal(22),
            tooltip: "+5M multi per energy",
            unlocked() { return hasUpgrade("p", 61);},
            effect() {
                return player.e.points.mul(5e6).clamp(1, 5e9)
            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
        41: {
            title: "[E3] Energy reset",
            description: "x3 super exponent.",
            cost: new Decimal("100"),
            unlocked() { return hasMilestone("lv", 1);},
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('p', 41)) || player.e.unlocked}

})

addLayer("w", {
    name: "water", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00ffff",
    requires: new Decimal("2"), // Can be a function that takes requirement increases into account
    resource: "water", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    update() {
        if (player.e.points.gt("100")) player.e.points = new Decimal("100")
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('gr',2)) Gen = 2222
        if(inChallenge('sst',11)) Gen = 0
        return Gen
    },
    autoUpgrade() {return hasMilestone('lv', 1)},
    hotkeys:[{key:"w",description:"W: Reset for water (universe 1)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Water (Universe 4, Part 2 / a while)",
                titleStyle: {'color': '#00bcbc'},
                body: "<b>Welcome to Water! i should stop using that should i</b> <br> Helpful info: The water cap is 6, however this is not a hardcap. <br> <i>Remember: more water means more energy (someone check if this is true)</i>",
                bodyStyle: {'background-color': "#006161"}
            }
        },
    branches:['e','gr'],
    upgrades: {
        11: {
            title: "[W1] it's blue mate",
            description: "Inflation? Is it <b>x1e1,000</b> spacetime?",
            cost: new Decimal(2),
        },

        21: {
            title: "[W2] This isn't auto water...",
            description: "A less dynamic self-boosting boost that self-boosts the boost of spacetime (^0.08 instead of ^0.9)",
            cost: new Decimal(6),
            tooltip: "(spacetime+1)^0.08",
            unlocked() { return hasUpgrade(this.layer, 11); },
            effect() {
            return player.points.add(1).pow(0.08)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        31: {
            title: "[W3] Water reset (but you have auto water anyway)",
            description: "x3 ultra exponent",
            cost: new Decimal(1e4),
            unlocked() { return hasUpgrade(this.layer, 21); },
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('gr', 11)) || player.w.unlocked}

})

addLayer("s", {
    name: "super", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(10e6), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('plus', 11)) mult = mult.times(upgradeEffect('plus', 11))
        if (hasUpgrade('plus', 21)) mult = mult.times(upgradeEffect('plus', 21))
        if (hasUpgrade('plus', 31)) mult = mult.times(upgradeEffect('plus', 31))
        if (hasUpgrade('multi', 11)) mult = mult.times(upgradeEffect('multi', 11))
        if (hasUpgrade('multi', 21)) mult = mult.times(upgradeEffect('multi', 21))
        if (hasUpgrade('e', 31)) mult = mult.times(upgradeEffect('e', 31))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('meta', 12)) exp = exp.add(1)
        if (hasMilestone('lv', 0)) exp = exp.add(3)
        if (hasUpgrade('e', 41)) exp = exp.times(3)
        return exp
    },
    update() {
        if (player.s.points.gt("1e225000") && !hasUpgrade("u", 11)) player.s.points = new Decimal("2e225000")
            else if (player.s.points.gt("1e1e9") && hasUpgrade("u", 11)) player.s.points = new Decimal("1e1e9")
    },
    passiveGeneration() {
        let Gen = 0
        if(hasUpgrade('u',11)) Gen = 0.001
        if(hasUpgrade('u',41)) Gen += 0.009
        if(hasUpgrade('meta',41)) Gen += 0.04
        if(hasMilestone('lv',0)) Gen += 0.96
        return Gen
    },
    autoUpgrade() {return hasMilestone('gr', 1)},
    hotkeys:[{key:"s",description:"S: Reset for super (universe 2)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Super (Universe 2, Part 1/3)",
                titleStyle: {'color': '#890000'},
                body: "<b>This is your first reset layer.</b> <br> Reset spacetime, points (along with their upgrades), energy (and their upgrades too) to get Super starting from 10M points.<br> <i>Yes, these upgrades are serious.</i>",
                bodyStyle: {'background-color': "#610000"}
            }
        },
    branches:['p','e'],
    upgrades: {
        11: {
            title: "[S1] Woah.",
            description: "Energy is x25 more expensive but you get x50,000 spacetime. You'll even generate 10% of points on reset! Also, each super up to 5 super gives +5 multiplier to your points. <i>psst... here's a free layer for you :)</i>",
            cost: new Decimal(1),
            tooltip: "+5 multi per super",
            effect() {
                return player.s.points.mul(5).clamp(1, 25)
            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        21: {
            title: "[S2] This one maybe?",
            description: "Energy is x10,000 more expensive but you get x500,000 spacetime. <i>One more free layer appears. Enjoy, or not.</i> Finally, <h2>prepare for inflation...</h2>",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade(this.layer, 11); },
        },

        31: {
            title: "[S3] Finally something new!",
            description: "Unlock Ultra. <i>Once again, not required after doing your first ultra reset.</i>",
            cost: new Decimal("1e225000"),
            unlocked() { return hasUpgrade(this.layer, 21); },
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('p', 51)) || player.s.unlocked }

    
})

addLayer("u", {
    name: "ultra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#e600ff",
    requires: new Decimal("1e225000"), // Can be a function that takes requirement increases into account
    resource: "ultra", // Name of prestige currency
    baseResource: "super", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.00000625, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('inf', 11)) mult = mult.times(2)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('meta', 13)) exp = exp.add(1)
        if (hasUpgrade('inf', 31)) exp = exp.add(3)
        if (hasUpgrade('w', 31)) exp = exp.times(3)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('gr',0)) Gen = 1
        return Gen
    },
    autoUpgrade() {return hasMilestone('gr', 0)},
    hotkeys:[{key:"u",description:"U: Reset for ultra (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Ultra (Universe 3, Part 1/?)",
                titleStyle: {'color': '#a00293'},
                body: "<b>Are you ready? No you aren't.</b> <br> It's time to reset EVERYTHING! Reset everything super does, but also reset super, super upgrades, plus, plus upgs, multi, multi upgs and the first 3 relics for ultra, starting at 1e225,000 super.<br> <i>You're about to crash out.</i>",
                bodyStyle: {'background-color': "#61004c"}
            }
        },
    branches:['s','exp'],
    upgrades: {
        11: {
            title: "[U1] One more time",
            description: "Let's do this one more time. First of all, you get x1e12 spacetime. Second of all... <i>well, I think you know what you're gonna get now!</i> Finally, uncap your super amount. (it can now go above 1e225,000). Oh right i forgot, x1M your energy cost. Wait wait wait, 0.1% passive super too.",
            cost: new Decimal(1),
        },

        21: {
            title: "<i>Relic 4/7 - The Relic of Infinity</i>",
            description: "<i>I'm sorry I reset your progress like that. To compensate, unlock a new layer for free that requires</i> <h2>1e100</h2> <i>spacetime. Good luck!</i>",
            cost: new Decimal(0),
            unlocked() { return hasUpgrade("u", 11);},
        },

        31: {
            title: "[U2] Exponents",
            description: "Unlock Meta. <b>WARNING: If you lose U2, you can no longer access Meta.</b>",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("u", 21);},
        },

        41: {
            title: "[U3] e<h2>XP</h2>onents",
            description: "Unlock XP. And increase super passive gain from 0.1% to 1%. And increase points passive gain from 10% to 100%.",
            cost: new Decimal(10000),
            unlocked() { return hasUpgrade("u", 31);},
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('s', 31)) || player.u.unlocked }

    
})

addLayer("inf", {
    name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#a05f19",
    requires: new Decimal("1e100"), // Can be a function that takes requirement increases into account
    resource: "infinities", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.001, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('meta', 14)) mult = mult.times(6)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('meta', 14)) exp = exp.add(5)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('gr',0)) Gen = 1
        return Gen
    },
    autoUpgrade() {return hasMilestone('gr', 0)},
    hotkeys:[{key:"i",description:"I: Reset for infinities (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Infinity (Universe ∞, Part ∞/∞)",
                titleStyle: {'color': '#784510'},
                body: "<b>Not actually Universe ∞, it's still U3...</b> <br> Same thing as the ultra reset, but now you get Infinities!<br> <i>This is not a reference.</i>",
                bodyStyle: {'background-color': "#402406"}
            }
        },
    branches:['u'],
    upgrades: {
        11: {
            title: "[∞1] Infinite",
            description: "You get 2 things. <br> The first thing you get is <h1>big text</h1>, but the second thing you get is more ultra! x2 of it!",
            cost: new Decimal(1),
        },

        21: {
            title: "[∞2] Let's go Infinite!",
            description: "About time i made a spacetime boost that scales based on your spacetime!",
            cost: new Decimal("50000"),
            tooltip: "(spacetime+1)^0.9",
            unlocked() { return hasMilestone("lv", 1);},
            effect() {
            return player.points.add(1).pow(0.9)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        31: {
            title: "[∞3] The final push!",
            description: "You now get two things: Coolness points (does nothing) and ^3.33 ultra.",
            cost: new Decimal("1e30"),
            tooltip: "Coolness Points: (spacetime+1)^<br>(spcaetime^<br>(spacetime^<br>(spacetime)))",
            unlocked() { return hasMilestone("mlv", 0);},
            effect() {
            return player.points.add(1).pow(player.points.pow(player.points.pow(player.points)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" coolness points" },
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('u', 21)) || player.inf.unlocked }

    
})

addLayer("etr", {
    name: "eternity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∆", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 6, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#9c0fbc",
    requires: new Decimal("1.79e308"), // Can be a function that takes requirement increases into account
    resource: "eternities", // Name of prestige currency
    baseResource: "infinities", // Name of resource prestige is based on
    baseAmount() {return player.inf.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.001, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasUpgrade('etr',11)) Gen = 10e30
        return Gen
    },
    autoUpgrade() {return hasMilestone('gr', 0)},
    infoboxes:{
            coolInfo: {
                title: "Eternity (Universe ∆, Part ∆/∆)",
                titleStyle: {'color': '#641076'},
                body: "<b>It's not Universe ∆, it's U4!! </b> <br> Okay this one is accurate as you need 1.79e308 infinities<br> <i>This IS a reference.</i>",
                bodyStyle: {'background-color': "#3f084b"}
            }
        },
    branches:['u','gr'],
    upgrades: {
        11: {
            title: "[∆1] Eternal",
            description: "Get 1e33% of eternities per second. You'll see why.",
            cost: new Decimal(1),
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('gr', 13)) || player.etr.unlocked }

    
})

addLayer("meta", {
    name: "meta", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "μ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1.001),
    }},
    color: "#ffffffa1",
    requires: new Decimal("(e^1000)3"), // Can be a function that takes requirement increases into account
    resource: "meta", // Name of prestige currency
    baseResource: "meta", // Name of resource prestige is based on
    baseAmount() {return player.meta.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.001, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update() {
        if (player.meta.points.gt("1e1e1e1.796e308")) player.meta.points = new Decimal("1e1e1e1.796e308")
        if (hasMilestone('gr',0)) player.meta.points = new Decimal("1e1e9")
    },
    autoUpgrade() {return hasMilestone('gr', 0)},
    infoboxes:{
            coolInfo: {
                title: "Meta (Universe 3, Part 3/?)",
                titleStyle: {'color': '#ffffffa1'},
                body: "<b>So meta... I wish it was no longer meta.</b> <br> This layer is by default always unlocked and you start with 1.001 meta. However, you cannot use your currencies to get more meta by resetting, you must use the clickable.<br> <i>Why is this so meta?!</i>",
                bodyStyle: {'background-color': "#414141a1"}
            }
        },
    branches:['inf', 'p', 's', 'u'],
    upgrades: {
        11: {
            title: "[μ1] Meta Spacetime",
            description: "Upgrades are categorised into 2 categories: μ[x] (which are regular upgrades) and +μ[x] which add new features to Meta. For this one, get a x10 boost to spacetime!",
            cost: new Decimal("100"),
        },

        12: {
            title: "[μ2] Meta Super",
            description: "<i>This is super cool!</i> ^2 your super.",
            cost: new Decimal("25000"),
            unlocked() { return hasUpgrade("meta", 11);},
        },

        13: {
            title: "[μ3] Meta Ultra",
            description: "This is just as ridiculous as the previous meta. ^2 your ultra.",
            cost: new Decimal("250000"),
            unlocked() { return hasUpgrade("meta", 12);},
        },

        14: {
            title: "[μ4] Meta Infinity",
            description: "And now let's break infinity. x6 infinity, then ^6 infinity.",
            cost: new Decimal("1.79e308"),
            unlocked() { return hasUpgrade("meta", 13);},
        },

        21: {
            title: "[+μ1] Meta Meta",
            description: "Unlock the x1.01 Meta button!",
            cost: new Decimal("150"),
        },

        31: {
            title: "[+μ2] Meta Meta Meta Meta Meta Meta Meta Meta Meta Meta Meta Meta...",
            description: "Unlock the ^1.01 Meta button!",
            cost: new Decimal("2.5e6"),
            unlocked() { return hasUpgrade("meta", 21);},
        },

        41: {
            title: "[+μ3] When the",
            description: "Unlock the ^Meta Meta button! Wait what- (oh yeah! and increase your super passive gain from 1% to 5%!)",
            cost: new Decimal("1.11e11111"),
            unlocked() { return hasUpgrade("meta", 31);},
        },
    },
    clickables: {
        11: {
           display() { return "Fix your Meta." },
           tooltip() { return "Set your Meta to 1.001 after doing a row 4+ reset to make Meta work. (should be fixed by now)"},
           canClick() { return true },
           color() { return "#ffffff93" },
            onClick() {
                player.meta.points = new Decimal(1.001)
            }
        },

        21: {
           display() { return "+1.01 your Meta." },
           tooltip() { return "Who made this button?!"},
           canClick() { return true },
           color() { return "#ffffff93" },
            onClick() {
                player.meta.points = player.meta.points.add(1.01)
            }
        },

        22: {
           display() { return "x1.01 your Meta." },
           tooltip() { return "This isn't really <i>that</i> meta, but hey, it works!"},
           canClick() { return hasUpgrade("meta", 21); },
           color() { return "#ffffff93" },
            onClick() {
                player.meta.points = player.meta.points.mul(1.01)
            }
        },

        23: {
           display() { return "^1.01 your Meta." },
           tooltip() { return "All meta thingies must have inflation in them, right?"},
           canClick() { return hasUpgrade("meta", 31); },
           color() { return "#ffffff93" },
            onClick() {
                player.meta.points = player.meta.points.pow(1.01)
            }
        },

        24: {
           display() { return "^Meta your Meta." },
           tooltip() { return "WOAH"},
           canClick() { return hasUpgrade("meta", 41); },
           color() { return "#ffffff93" },
            onClick() {
                player.meta.points = player.meta.points.pow(player.meta.points)
            }
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('u', 31)) && player.meta.unlocked }

    
})

addLayer("xp", {
    name: "experience", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "XP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#2c7941",
    requires: new Decimal("10000"), // Can be a function that takes requirement increases into account
    resource: "XP", // Name of prestige currency
    baseResource: "ultra", // Name of resource prestige is based on
    baseAmount() {return player.u.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('xp', 11)) mult = mult.times(500)
        if (hasUpgrade('p', 73)) mult = mult.times("4.44e444")
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('lv', 11)) exp = exp.add(9)
        if (hasUpgrade('lv', 11)) exp = exp.add(5)
        if (hasUpgrade('xp', 21)) exp = exp.times(6)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('gr',0)) Gen = 1
        return Gen
    },
    autoUpgrade() {return hasMilestone('gr', 0)},
    hotkeys:[{key:"x",description:"X: Reset for XP (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Experience (Universe 3, Part 4/?)",
                titleStyle: {'color': '#4ca464'},
                body: "<b>Already?!</b> <br>Ultra can now turn into XP, which can be used for more XP! <br> <i>Did you know? This layer doesn't have ids on upgrades, so no [XP1] or anything.</i>",
                bodyStyle: {'background-color': "#184524"}
            }
        },
    branches:['u'],
    upgrades: {
        11: {
            title: "Get an XP Boost role on the discord server",
            description: "No, you don't actually get +500% xp on the real server, but you do get x500 xp here!",
            cost: new Decimal("1000"),
        },
        12: {
            title: "Add a leveling bot to your own server",
            description: "Unlock Levels.",
            cost: new Decimal("2e6"),
        },
        21: {
            title: "Remove the leveling bot because it broke after only 1e21 XP",
            description: "x6 the XP exponent.",
            cost: new Decimal("1e9800"),
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('u', 41)) || player.xp.unlocked}

    
})

addLayer("lv", {
    name: "level", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LV", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(1),
    }},
    color: "#174523",
    requires: new Decimal("1e6"), // Can be a function that takes requirement increases into account
    resource: "Levels", // Name of prestige currency
    baseResource: "XP", // Name of resource prestige is based on
    baseAmount() {return player.xp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 8.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('gr', 0)},
    resetsNothing() {return hasMilestone('gr', 0)},
    autoUpgrade() {return hasMilestone('gr', 0)},
    hotkeys:[{key:"l",description:"L: Reset for levels (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Levels (Universe 3, Part 4.5/?)",
                titleStyle: {'color': '#2f7341'},
                body: "<b>Let's just go on with the... THAT'S A LOT OF XP</b> <br>XP can now turn into Levels which can give MILESTONES! <br> <i>No upgrades in this layer! Except for the relic...</i>",
                bodyStyle: {'background-color': "#0d2915"}
            }
        },
    branches:['xp'],
    milestones: {
        0: {
        requirementDescription: "Level 2",
        effectDescription: "Get the following: <br> - Add 3 to the exponent of super <br> - Unlock more point upgrades (#6 and #7) <br> - Unlock Relic 5 <br> - Unlock Auto Points + Energy Upgrades <br> - 100% super passive gain",
        done() { return player.lv.points.gte(2) }
        },

        1: {
        requirementDescription: "Level 3",
        effectDescription: "Get the following: <br> - Unlock a new infinity upgrade. <br> - Unlock an energy upgrade (E3) <br> - Unlock upgrade #8 <br> - Unlock Auto Water Upgrades (you'll unlock this later)",
        done() { return player.lv.points.gte(3) }
        },

        2: {
        requirementDescription: "Level 4",
        effectDescription: "Get the following: <br> - Unlock Mega Levels",
        done() { return player.lv.points.gte(4) }
        },
    },
    upgrades: {
        11: {
            title: "Relic 5/7 - The Relic of Big Numbers",
            description: "^10 XP. Then, add 5 to the exponent of XP. <h2>Next relic in 5 (layers)</h2>",
            cost: new Decimal("0"),
            unlocked() { return hasMilestone("lv", 0);},
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('xp', 12)) || player.lv.unlocked}

    
})

addLayer("mlv", {
    name: "megalevel", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MLV", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(1),
    }},
    color: "#0c2913",
    requires: new Decimal("1e15382"), // Can be a function that takes requirement increases into account
    resource: "Mega Levels", // Name of prestige currency
    baseResource: "XP", // Name of resource prestige is based on
    baseAmount() {return player.xp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 88.44, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('gr', 0)},
    resetsNothing() {return hasMilestone('gr', 0)},
    autoUpgrade() {return hasMilestone('gr', 0)},
    hotkeys:[{key:"m",description:"M: Reset for mega levels (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Mega Levels (Universe 3, Part 5/?)",
                titleStyle: {'color': '#0a1b0e'},
                body: "<b>The finale.</b> <br>Levels can now turn into- okay nevermind. <br> <i>Milestones!</i>",
                bodyStyle: {'background-color': "#081a0d"}
            }
        },
    branches:['lv'],
    milestones: {
        0: {
        requirementDescription: "Mega Level 2",
        effectDescription: "And now you get THIS: <br> - Grass <br> - Unlock more infinity upgrades",
        done() { return player.mlv.points.gte(2) }
        },
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('lv', 2)) || player.mlv.unlocked}

    
})

addLayer("gr", {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#04ff00",
    requires: new Decimal("1e140"), // Can be a function that takes requirement increases into account
    resource: "grass", // Name of prestige currency
    baseResource: "ultra", // Name of resource prestige is based on
    baseAmount() {return player.u.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0999, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('tetr', 11)) mult = mult.times(2)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('mm',0)) Gen = 1
        return Gen
    },
    autoUpgrade() {return hasMilestone('mm', 0)},
    hotkeys:[{key:"g",description:"G: Reset for grass (universe 4)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Grass (Universe 4, Part 1 / a while)",
                titleStyle: {'color': '#00a82d'},
                body: "<b>As you reset everything, you feel grass around you...</b> <br>Welcome to Universe 4! Since grass is green and green can be related to recycling, this layer will recycle certain features (add new layers to previous rows, and new features to previous layers) <br> <i>great i touched grass.</i>",
                bodyStyle: {'background-color': "#007a21"}
            }
        },
    branches:['u','mlv'],
    upgrades: {
        11: {
            title: "[g1.1] Back to Row 1",
            description: "Unlock Water.",
            cost: new Decimal("1"),
        },
        12: {
            title: "[g1.2] Back to Row 2",
            description: "Unlock Tetration.",
            cost: new Decimal("2"),
        },
        13: {
            title: "[g1.3] Back to Row 3",
            description: "Unlock Eternities.",
            cost: new Decimal("3"),
        },
        21: {
            title: "[g1.0?] Back to Row 0?",
            description: "Unlock Spacetime?",
            cost: new Decimal("4"),
        },
    },
    milestones: {
        0: {
        requirementDescription: "5 grass",
        effectDescription: "The long-awaited feature: Row 3 Automation (the most grindy row)",
        done() { return player.gr.points.gte(5) }
        },
        1: {
        requirementDescription: "15 grass",
        effectDescription: "Auto super upgrades :)",
        done() { return player.gr.points.gte(15) }
        },
        2: {
        requirementDescription: "70 grass",
        effectDescription: "Auto water :D",
        done() { return player.gr.points.gte(70) }
        },
        3: {
        requirementDescription: "1e6 grass",
        effectDescription: "Auto plus!!",
        done() { return player.gr.points.gte(1e6) }
        },
        4: {
        requirementDescription: "1e12 grass",
        effectDescription: "Auto multi!! wow!!",
        done() { return player.gr.points.gte(1e12) }
        },
        5: {
        requirementDescription: "1e24 grass",
        effectDescription: "Auto exp!! you won't believe it",
        done() { return player.gr.points.gte(1e24) }
        },
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('mlv', 0)) || player.gr.unlocked}

    
})

addLayer("sst", {
    name: "spacetime", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8e8e8e",
    requires: new Decimal("1"), // Can be a function that takes requirement increases into account
    resource: "space-spacetime", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3e-4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('sst', 11)) exp = exp.add(1)
        if (hasUpgrade('sst', 11)) exp = exp.pow(player.sst.points)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasUpgrade('sst',11)) Gen = 1
        return Gen
    },
    update() {
        if (player.sst.points.gt("(e^307.9)3")) player.sst.points = new Decimal("(e^307.9)3")
    },
    infoboxes:{
            coolInfo: {
                title: "Spacetime (Universe 0, Part 1/1)",
                titleStyle: {'color': '#4f4f4f'},
                body: "Welcome to the start of the game. Wait, that's wrong!",
                bodyStyle: {'background-color': "#272727"}
            }
        },
    challenges: {
    11: {
        name: "Endurance Test",
        challengeDescription: "<h3>You do not have the Points layer. Water generation is turned off.</h3>",
        goalDescription: "<i>120 spacetime</i>",
        rewardDescription: "<i>Unlock some space-spacetime milestones.</i>",
        canComplete: function() {return player.points.gte(120)},
        
    },
    12: {
        name: "Reversing The Game",
        challengeDescription: "<h3>You have the Negative Points layer and start with 1e1,000 spacetime.</h3>",
        goalDescription: "<i> -1 spacetime</i>",
        rewardDescription: "<i>Unlock some space-spacetime upgrades.</i>",
        onEnter: function() {player.points = new Decimal ("1e1000")},
        canComplete: function() {return player.points.lte(-1)},
        
    },
    },
    milestones: {
        0: {
        requirementDescription: "100 SST",
        effectDescription: "Unlock Cookies.",
        done() { return player.sst.points.gte(100) },
        unlocked() { return player.sst.challenges[11] === 1 }
        },
    },
    upgrades: {
        11: {
            title: "Blah",
            description: "Blah blah blah <i>boost your space-spacetime by ^space-spacetime</i> blah blah Blah also unlock auto SST",
            cost: new Decimal("200"),
            unlocked() { return player.sst.challenges[12] === 1 }
        },
    },
    branches:['gr'],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('gr', 21)) || player.sst.unlocked}

    
})

addLayer("vc", {
    name: "vanillacookies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "VC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#af8e74",
    requires: new Decimal("1e1e3"), // Can be a function that takes requirement increases into account
    resource: "vanilla cookies", // Name of prestige currency
    baseResource: "dark chocolate cookies", // Name of resource prestige is based on
    baseAmount() {return player.dcc.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e-5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('c',6)) Gen = 1
        return Gen
    },
    update() {
        if (player.vc.points.gt("1e13")) player.vc.points = new Decimal("1e13")
    },
    hotkeys:[{key:"V",description:"V: Reset for vanilla cookies (universe β)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Vanilla Cookies (Universe β, Part 4/4)",
                titleStyle: {'color': '#847367'},
                body: "Welcome to the layer before the 5th universe. Are you ready?",
                bodyStyle: {'background-color': "#4d4037"}
            }
        },
    upgrades:{
        11: {
            title: "It's time for a new upgrade. A better one.",
            description: "Inflation.",
            cost: new Decimal("1e10"),
            tooltip: "the formula is just ridiculous so i won't tell you :) [it's another point self-boost, but now ^0.01)",
            effect() {
            return player.points.add(1).pow(0.01)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Universe 5",
            description: "Unlock Magnets.",
            cost: new Decimal("1e13"),
        },
    },
    branches:['dcc'],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('c', 5)) || player.vc.unlocked}

    
})

addLayer("dcc", {
    name: "darkchocolatecookies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DCC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#5b2e0c",
    requires: new Decimal("1e1e9"), // Can be a function that takes requirement increases into account
    resource: "dark chocolate cookies", // Name of prestige currency
    baseResource: "chocolate cookies", // Name of resource prestige is based on
    baseAmount() {return player.cc.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e-9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('dcc', 15)) mult = mult.times(upgradeEffect('dcc', 15))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if(hasUpgrade('dcc',13)) exp = exp.add(1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('c',4)) Gen = 1
        return Gen
    },
    hotkeys:[{key:"d",description:"D: Reset for dark chocolate cookies (universe β)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Dark Chocolate Cookies (Universe β, Part 3/4)",
                titleStyle: {'color': '#442005'},
                body: "Almost at the point of no return...",
                bodyStyle: {'background-color': "rgb(56, 29, 8)"}
            }
        },
    upgrades:{
        11: {
            title: "Cookies?",
            description: "x2 something.",
            cost: new Decimal("1e3"),
        },
        12: {
            title: "Clever tricks you got.",
            description: "x2 something again.",
            cost: new Decimal("25e3"),
        },
        13: {
            title: "Okay fine here's a real upgrade",
            description: "^2 DCC.",
            cost: new Decimal("1e6"),
            unlocked() {return hasUpgrade('dcc',12)},
        },
        14: {
            title: "There can only be 4.",
            description: "Dark chocolate cookies boost chocolate cookies.",
            cost: new Decimal("1e16"),
            unlocked() {return hasUpgrade('dcc',13)},
            tooltip: "(DCC+1)^10M",
            effect() {
            return player.dcc.points.add(1).pow(10e6)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "There can only be 5?",
            description: "Cookies boost dark chocolate cookies.",
            cost: new Decimal("1e300"),
            unlocked() {return hasUpgrade('dcc',13)},
            tooltip: "(C+1)^0.00000000001",
            effect() {
            return player.c.points.add(1).pow(0.00000000001)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
    branches:['cc'],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('c', 2)) || player.dcc.unlocked}

    
})

addLayer("cc", {
    name: "chocolatecookies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#984b10",
    requires: new Decimal("1e10"), // Can be a function that takes requirement increases into account
    resource: "chocolate cookies", // Name of prestige currency
    baseResource: "cookies", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('cc', 13)) mult = mult.times("1e1000")
        if (hasUpgrade('dcc', 14)) mult = mult.times(upgradeEffect('dcc', 14))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('c',3)) Gen = 1
        return Gen
    },
    hotkeys:[{key:"k",description:"K: Reset for chocolate cookies (universe β)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Chocolate Cookies (Universe β, Part 2/4)",
                titleStyle: {'color': '#6d3307'},
                body: "It's time for a recap of v0.13!",
                bodyStyle: {'background-color': "rgb(75, 41, 13)"}
            }
        },
    upgrades:{
        11: {
            title: "Cookie Duplication",
            description: "x2 cookies.",
            cost: new Decimal("200"),
        },
        12: {
            title: "Strong Cookie Duplication",
            description: "x3 cookies.",
            cost: new Decimal("2000"),
        },
        13: {
            title: "Inflation! Part 1",
            description: "x1e1,000 chocolate cookies.",
            cost: new Decimal("20000"),
        },
        14: {
            title: "Inflation! Part 2",
            description: "x1e1,000 cookies.",
            cost: new Decimal("2e1004"),
        },
        15: {
            title: "Deflation! Part -3",
            description: "Chocolate cookies boost cookies.",
            cost: new Decimal("4e2003"),
            tooltip: "(CC+1)^4",
            effect() {
            return player.cc.points.add(1).pow(4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
    branches:['c'],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('c', 1)) || player.cc.unlocked}

    
})

addLayer("c", {
    name: "cookies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#e36e14",
    requires: new Decimal("1e20"), // Can be a function that takes requirement increases into account
    resource: "cookies", // Name of prestige currency
    baseResource: "grass", // Name of resource prestige is based on
    baseAmount() {return player.gr.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('cc', 11)) mult = mult.times(2)
        if (hasUpgrade('cc', 12)) mult = mult.times(3)
        if (hasUpgrade('cc', 14)) mult = mult.times("1e1000")
        if (hasUpgrade('cc', 15)) mult = mult.times(upgradeEffect('cc', 15))
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    passiveGeneration() {
        let Gen = 0
        if(hasMilestone('c',0)) Gen = 1
        return Gen
    },
    update() {
        if (player.c.points.gt("1e1e15")) player.c.points = new Decimal("1e1e15")
    },
    infoboxes:{
            coolInfo: {
                title: "Cookies (Universe β, Part 1/4)",
                titleStyle: {'color': '#ab5e1f'},
                body: "Before v1.000, there were COOKIES.",
                bodyStyle: {'background-color': "#7e4517"}
            }
        },
    milestones: {
        0: {
        requirementDescription: "1 cookie",
        effectDescription: "Start gaining cookies automatically.",
        done() { return player.c.points.gte(1) },
        },
        1: {
        requirementDescription: "1e10 cookies",
        effectDescription: "Unlock Chocolate Cookies.",
        done() { return player.c.points.gte(1e10) },
        },
        2: {
        requirementDescription: "e1,000,000,000 cookies",
        effectDescription: "Unlock Dark Chocolate Cookies.",
        done() { return player.c.points.gte("1e1e9") },
        },
        3: {
        requirementDescription: "e5e9 cookies",
        effectDescription: "Automate Chocolate Cookie gain.",
        done() { return player.c.points.gte("1e5e9") },
        },
        4: {
        requirementDescription: "e1e10 cookies",
        effectDescription: "Automate Dark Chocolate Cookie gain.",
        done() { return player.c.points.gte("1e1e10") },
        },
        5: {
        requirementDescription: "e1e12 cookies",
        effectDescription: "Unlock Vanilla Cookies.",
        done() { return player.c.points.gte("1e1e12") },
        },
        6: {
        requirementDescription: "e1e15 cookies",
        effectDescription: "Automate Vanilla Cookie gain.",
        done() { return player.c.points.gte("1e1e15") },
        },
    },
    branches:['sst'],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('sst', 0)) || player.c.unlocked}

    
})

addLayer("nm", {
    name: "negativemagnet", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "-M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000ff",
    requires: new Decimal("1e2365750"), // Can be a function that takes requirement increases into account
    resource: "negative magnets", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.003141592, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Negative Magnets (Universe 5)",
                titleStyle: {'color': '#000000'},
                body: "<i>negativity!</i><br> Negative Magnets! I ran out of ideas for this.",
                bodyStyle: {'background-color': "#000000"}
            }
        },
    milestones: {
        0: {
        requirementDescription: "1 Negative Magnet",
        effectDescription: "Uh oh! I'm now reverting your first Positive Magnet boost! But you'll get a different boost... (Hint: Check the RTG challenge.)",
        done() { return player.nm.points.gte(1) },
        },
        1: {
        requirementDescription: "1e3,141 Negative Magnets",
        effectDescription: "I find it... funny you have boosts! Okay what am i doing now. Revert the 2nd positive magnet milestone but get more Negative Points.",
        done() { return player.nm.points.gte("1e3141") },
        },
    },
    branches:['mm'],
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('mm', 0)) || player.nm.unlocked}

    
})

addLayer("mm", {
    name: "mastermagnet", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ffffff",
    requires: new Decimal("1e13"), // Can be a function that takes requirement increases into account
    resource: "master magnets", // Name of prestige currency
    baseResource: "vanilla cookies", // Name of resource prestige is based on
    baseAmount() {return player.vc.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3.141592, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Master Magnets (Universe 5)",
                titleStyle: {'color': '#000000'},
                body: "Reset EVERYTHING for an increased master magnet. You will get massive boosts.",
                bodyStyle: {'background-color': "#000000"}
            }
        },
        milestones: {
        0: {
        requirementDescription: "1 Master Magnet",
        effectDescription: "Automatic grass!! Unlock the two side layers of Master Magnets. Enjoy!",
        done() { return player.mm.points.gte(1) },
        },
        1: {
        requirementDescription: "2 Master Magnets",
        effectDescription: "what, you want an award or something? no! you're only getting x1e100,000 spacetime!",
        done() { return player.mm.points.gte(2) },
        },
    },
    branches:['vc','gr'],
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('vc', 12)) || player.mm.unlocked}

    
})

addLayer("pm", {
    name: "plusmagnet", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal("1e30"), // Can be a function that takes requirement increases into account
    resource: "positive magnets", // Name of prestige currency
    baseResource: "grass", // Name of resource prestige is based on
    baseAmount() {return player.gr.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.03141592, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        if (hasUpgrade('np', 23)) exp = exp.times(13)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Positive Magnets (Universe 5)",
                titleStyle: {'color': '#000000'},
                body: "<i>okay i may have ran out of ideas for this</i><br> Positive Magnets! Gain boosts, boosts, boosts, boosts, boosts...",
                bodyStyle: {'background-color': "#000000"}
            }
        },
    milestones: {
        0: {
        requirementDescription: "1 Positive Magnet",
        effectDescription: "x2.22e22,222 spacetime. Talk about a boost!",
        done() { return player.pm.points.gte(1) },
        },
        1: {
        requirementDescription: "1e19 Positive Magnets",
        effectDescription: "I find it... funny you don't have any boosts! x1e10,000 spacetime.",
        done() { return player.pm.points.gte(1e19) },
        },
    },
    branches:['mm'],
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('mm', 0)) || player.pm.unlocked}

    
})

addLayer("pie", {
    name: "truepie", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🥧", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#d1634d",
    requires: new Decimal("1e4380"), // Can be a function that takes requirement increases into account
    resource: "pies", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.676e-309, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    infoboxes:{
            coolInfo: {
                title: "Pie (Bonus Universe, v1.005)",
                titleStyle: {'color': '#9e4d3c'},
                body: "<h1>woah there wait, this layer will reset everything!</h1><br><b>What is a bonus layer?</b> <br> A bonus layer is a layer that can help you get further. Bonus layers are not required for progression!<br> <i>Enjoy x200 spacetime! Also, the requirement for this layer (1e4,380) is the endgame of v1.005</i>",
                bodyStyle: {'background-color': "#683126"}
            }
        },
    branches:[''],
    upgrades: {
        11: {
            title: "<i>[π1] Pie :/</i>",
            description: "<h3>small pie, x2 spacetime</h3>",
            cost: new Decimal(1),
        },

        21: {
            title: "<i>[π2] Pie :)</i>",
            description: "<h3>medium pie, x5 spacetime</h3>",
            cost: new Decimal(2),
        },

        31: {
            title: "<i>[π3] Pie :D</i>",
            description: "<h3>big pie, x20 spacetime</h3>",
            cost: new Decimal(3),
        },
    },
    row: 100, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.points.gte(new Decimal("1e4380")) || player.pie.unlocked}

    
})

addLayer("bc", {
    name: "birthdaycake", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🎂", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#c431c6",
    requires: new Decimal("1e16933600"), // Can be a function that takes requirement increases into account
    resource: "birthday cakes", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.676e-309, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    infoboxes:{
            coolInfo: {
                title: "Birthday Cakes (Bonus Universe, v1.01)",
                titleStyle: {'color': '#8d238f'},
                body: "<h1>woah there wait, this layer will reset everything!</h1><br>v1.01 version of pie!",
                bodyStyle: {'background-color': "#5b105c"}
            }
        },
    branches:['pie'],
    upgrades: {
        11: {
            title: "<i>No cakes here...</i>",
            description: "<h3>but you'll still wish cookie a happy birthday, right?</h3>",
            cost: new Decimal(1),
        },
    },
    row: 100, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.points.gte(new Decimal("1e16933600")) || player.bc.unlocked}

    
})

addLayer("tierone", {
    name: "firstier", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T₁", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff2a008c",
    requires: new Decimal("2"), // Can be a function that takes requirement increases into account
    resource: "tier 1 power", // Name of prestige currency
    baseResource: "master magnets", // Name of resource prestige is based on
    baseAmount() {return player.mm.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.71, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    infoboxes:{
            coolInfo: {
                title: "Tier 1 (Universe α)",
                titleStyle: {'color': '#a91c00'},
                body: "I ran out of name ideas so enjoy this repetitive part of the game :D <br><i>make sure to use player.tierone.unlocked = false in the console if you haven't reached 2 master magnets yet</i>",
                bodyStyle: {'background-color': "#871600"}
            }
        },
    branches:['mm'],
    upgrades: {
        11: {
            title: "<i>[T1] who asked</i>",
            description: "<h3>unlocks more point upgrades</h3>",
            cost: new Decimal(1),
        },
    },
    row: 6, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasMilestone('mm', 1)) || player.tierone.unlocked}

    
})

addLayer("tiertwo", {
    name: "secondtier", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T₂", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4dff008c",
    requires: new Decimal("2"), // Can be a function that takes requirement increases into account
    resource: "tier 2 power", // Name of prestige currency
    baseResource: "tier 1 power", // Name of resource prestige is based on
    baseAmount() {return player.tierone.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    infoboxes:{
            coolInfo: {
                title: "Tier 2 (Universe α)",
                titleStyle: {'color': '#27a900'},
                body: "Idealess. No ideas, no balancing!<br><i>make sure to use player.tiertwo.unlocked = false in the console if you haven't reached 2 tier 1 power yet</i>",
                bodyStyle: {'background-color': "#198700"}
            }
        },
    branches:['tierone'],
    upgrades: {
        11: {
            title: "<i>[T2] what why</i>",
            description: "<h3>unlock rng layer</h3>",
            cost: new Decimal(1),
        },
    },
    row: 6, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('tierone', 11)) || player.tiertwo.unlocked}

    
})

addLayer("rng", {
    name: "rng", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🎲", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ececdae2",
    requires: new Decimal("2"), // Can be a function that takes requirement increases into account
    resource: "rarity points", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e-7, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let Gen = Math.abs(Math.random() * (1e-4 - 1e-5) + 1e-5)
        return Gen
    },
    autoUpgrade() {return hasUpgrade('tiertwo',11)},
    branches:[''],
    upgrades: {
        11: {
            title: "<h3><span style='color:#a07855;'>Garbage</span></h3>",
            description: "This does nothing.",
            cost: new Decimal(1),
        },
        12: {
            title: "<h3><span style='color:#cccccc;'>Common</span></h3>",
            description: "+1 base spacetime. What else would you ask for?",
            cost: new Decimal(3),
        },
        13: {
            title: "<h3><span style='color:#88cc44;'>Uncommon</span></h3>",
            description: "+1e10 base spacetime. Oh great",
            cost: new Decimal(9),
        },
        14: {
            title: "<h3><span style='color:#44aadd;'>Rare</span></h3>",
            description: "Let's go- no we are not doing this, we are done. I'm never going to- <i>Today's lesson: +1e100 spacetime base!</i>",
            cost: new Decimal(27),
        },
        15: {
            title: "<h3><span style='color:#aa66dd;'>Epic</span></h3>",
            description: "Usually i give you multipliers but today you're getting +1e1,000 spacetime base.",
            cost: new Decimal(81),
        },
        21: {
            title: "<h3><span style='color:#e6aa33;'>Legendary</span></h3>",
            description: "+3.33e3,333 spacetime base of course!",
            cost: new Decimal(243),
        },
        22: {
            title: "<h3><span style='color:#cc4444;'>Mythic</span></h3>",
            description: "+6.66e6,666 spacetime base! let's just go on with the base a lot a lot..",
            cost: new Decimal(729),
        },
        23: {
            title: "<h3><span style='color:#ffee33;'>Godly</span></h3>",
            description: "+1e10,000 spacetime base! Why do you need so much...",
            cost: new Decimal(2187),
        },
        24: {
            title: "<h3><span style='color:#44ddcc;'>Divine</span></h3>",
            description: "Guess the boost. Okay it's just +e25K base.",
            cost: new Decimal(6561),
        },
        25: {
            title: "<h3><span style='color:#44dd88;'>Immortal</span></h3>",
            description: "How much more base will you get? +e100K...?",
            cost: new Decimal(19683),
        },
        31: {
            title: "<h3><span style='color:#ff44aa;'>Ethereal</span></h3>",
            description: "This is the last base upgrade, trust me. e1M base added.",
            cost: new Decimal(59049),
        },
        32: {
            title: "<h3><span style='color:#dd88cc;'>Amazing</span></h3>",
            description: "Flex this new rarity!",
            cost: new Decimal(177147),
        },
        33: {
            title: "<h3><span style='color:#ffffff;'>Prime</span></h3>",
            description: "Flex this newer rarity!",
            cost: new Decimal(531441),
        },
        34: {
            title: "<h3><span style='color: #FF0000;'>R</span><span style='color: #FF8800;'>a</span><span style='color: #FFFF00;'>i</span><span style='color: #00FF00;'>n</span><span style='color: #00FFFF;'>b</span><span style='color: #0000FF;'>o</span><span style='color: #8800FF;'>w</span></h3>",
            description: "OH MY GOD IT'S RAINBOW",
            cost: new Decimal(1594323),
        },
        35: {
            title: "<h3><span style='background: linear-gradient(90deg, #A0B0FF, #E0A0FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Galactic</span></h3>",
            description: "IT HAS A GRADIENT?!",
            cost: new Decimal(4782969),
        },
        41: {
            title: "<h3><span style='background: linear-gradient(90deg, #E0A0C0, #D4B2A7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Ultima</span></h3>",
            description: "Unlock<br>██████████████████████████████████████████████████████████,<br>including the first Row 7 Layer! (soon)",
            cost: new Decimal(14348907),
            style: { 
                "height": "300px", 
                "width": "600px", 
                "font-size": "16px" 
            },
        },
    },
    row: 6, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('tiertwo', 11)) && player.rng.unlocked},
    canReset(){return false},    
})

addLayer("uni", {
    name: "universes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🌌", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    nodeStyle: {
        background: "radial-gradient( #cc00ff, #1f162b)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(0,0,0,0.5)",
        color: "rgb(79, 19, 107)",
    },
    color: "#5e1874e2",
    tooltip: "<i>Universes</i>",
    requires: new Decimal("1e133600000"), // Can be a function that takes requirement increases into account
    resource: "universes", // Name of prestige currency
    baseResource: "spacetime", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal (1)
        return exp
    },
    infoboxes:{
            coolInfo: {
                title: "Universes (Universe 6)",
                titleStyle: {'color': '#000000'},
                body: "I can't believe it...",
                bodyStyle: {'background-color': "#000000"}
            }
        },
    milestones: {
        0: {
        requirementDescription: "<big><i>1 Universe</i></big>",
        effectDescription: "<i>Welcome to your demise. ^2 spacetime if under 1e100 spacetime, otherwise ^1.001 spacetime.</i> <br><small>all spacetime boosts from now on will be exponents, they are applied last</small>",
        done() { return player.uni.points.gte(1) },
        },
    },
    branches:['rng'],
    row: 7, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('rng', 41)) || player.uni.unlocked}

    
})

addLayer("plus", {
    name: "addition", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#434343",
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "plus", // Name of prestige currency
    baseResource: "super", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('gr', 3)},
    resetsNothing() {return hasMilestone('gr', 3)},
    autoUpgrade() {return hasMilestone('gr', 3)},
    hotkeys:[{key:"1",description:"1: Reset for plus (universe 2)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Plus (Universe 2, Part 2/3)",
                titleStyle: {'color': '#616161'},
                body: "<b>Do you like addition?</b> <br> This isn't really a layer, but rather a feature. It's kinda like energy!<br> <i>There's also another feature, you know?</i>",
                bodyStyle: {'background-color': "#2c2b2b"}
            }
        },
    branches:['s'],
    upgrades: {
        11: {
            title: "[+1] Glorious",
            description: "Want more super? Yes, + now gives more super!",
            tooltip: "(plus+1)^3.141592",
            cost: new Decimal(1),
            effect() {
        return player.plus.points.add(1).pow(3.141592)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        21: {
            title: "[+2] Really?",
            description: "This is even more glorious. Enjoy MORE super from + because why not!",
            cost: new Decimal(2),
            tooltip: "(plus+1)^1.618033",
            unlocked() { return hasUpgrade(this.layer, 11); },
            effect() {
        return player.plus.points.add(1).pow(1.618033)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        31: {
            title: "<i>Relic 1/7 - The Relic of Duplication</i>",
            description: "<i>Welcome to one of the 7 relics you will find across your journey. This one will give a massive boost equal to the one of [x1], except this one calculates the boost using + instead of multi.</i> <h2>Unlock a new Relic.</h2>",
            cost: new Decimal(4),
            tooltip: "(plus+1)^19.565066",
            unlocked() { return hasUpgrade('multi', 11); },
            effect() {
        return player.plus.points.add(1).pow(19.565066)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('s', 11)) || player.plus.unlocked }

    
})

addLayer("multi", {
    name: "multiplication", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "*", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#a4b04f",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "multi", // Name of prestige currency
    baseResource: "plus", // Name of resource prestige is based on
    baseAmount() {return player.plus.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('gr', 4)},
    resetsNothing() {return hasMilestone('gr', 4)},
    autoUpgrade() {return hasMilestone('gr', 4)},
    hotkeys:[{key:"2",description:"2: Reset for multi (universe 2)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Multi (Universe 2, Part 3/3)",
                titleStyle: {'color': '#c9d75a'},
                body: "<b>Math is getting on my nerves.</b> <br> A feature yet again. I guess you can progress here too...<br> <i>Have you tried reaching the 4th plus?</i>",
                bodyStyle: {'background-color': "#848d41"}
            }
        },
    branches:['plus'],
    upgrades: {
        11: {
            title: "[x1] Another One!",
            description: "OP layer of the day! Let <h3>tau^phi</h3> multiply your super.",
            tooltip: "(multi+1)^19.565066",
            cost: new Decimal(1),
            effect() {
        return player.multi.points.add(1).pow(19.565066)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        21: {
            title: "[x2] Last one bro I swear...",
            description: "Let's get real, you probably saw this one coming. Create a <h2>tau^tau</h2> boost coming from plus, still to super. Let's do this. By the same boost, also increase points.",
            cost: new Decimal(2),
            tooltip: "(plus+1)^103,540.92",
            unlocked() { return hasUpgrade(this.layer, 11); },
            effect() {
        return player.plus.points.add(1).pow(103540.92)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('s', 21)) || player.multi.unlocked}

    
})

addLayer("exp", {
    name: "exponentiation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "^", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#256ba0",
    requires: new Decimal(4), // Can be a function that takes requirement increases into account
    resource: "exp", // Name of prestige currency
    baseResource: "multi", // Name of resource prestige is based on
    baseAmount() {return player.multi.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('gr', 5)},
    resetsNothing() {return hasMilestone('gr', 5)},
    autoUpgrade() {return hasMilestone('gr', 5)},
    hotkeys:[{key:"3",description:"3: Reset for exp (universe 3)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Exp (Universe 3, Part 2/?)",
                titleStyle: {'color': '#103957'},
                body: "<b>Okay this is the last one for real this time.</b> <br> Last feature. Good luck trying to get 2 exp because it's way too hard.<br> <i>Perhaps the relics will help you?</i>",
                bodyStyle: {'background-color': "#0a2c45"}
            }
        },
    branches:['multi','e','meta'],
    upgrades: {
        11: {
            title: "[^1] Isn't this out of the range?",
            description: "Who cares? Massively increase the power boost of points!",
            cost: new Decimal(1),
            tooltip: "(exp+1)^1.2",
            effect() {
        return player.exp.points.add(1).pow(1.2)
    },
    effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },

        21: {
            title: "[^2] Isn't this STUPID?!",
            description: "Wow, you sure hate exponents. Increase the power boost of points by your super! <i>This does get quite inflated...</i>",
            cost: new Decimal(2),
            tooltip: "(super+1)^0.00000001",
            unlocked() { return hasUpgrade(this.layer, 11); },
            effect() {
        return player.s.points.add(1).pow(0.00000001)
    },
    effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('u', 11)) || player.exp.unlocked}

    
})

addLayer("tetr", {
    name: "tetration", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ↆ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#cc3aa3",
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "tetr", // Name of prestige currency
    baseResource: "exp", // Name of resource prestige is based on
    baseAmount() {return player.exp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult

    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoPrestige() {return hasMilestone('mlv', 0)},
    resetsNothing() {return hasMilestone('mlv', 0)},
    autoUpgrade() {return hasMilestone('mlv', 0)},
    hotkeys:[{key:"4",description:"4: Reset for tetr (universe 4)",onPress(){if (canReset(this.layer))doReset(this.layer);}}],
    infoboxes:{
            coolInfo: {
                title: "Tetr (Universe 4, Part 3 / a while)",
                titleStyle: {'color': '#942675'},
                body: "<b>It wasn't the last one.</b> <br> Reset once, get the upgrade, row 3 reset and then you lose it.<br> <i>You need more super.</i>",
                bodyStyle: {'background-color': "#671650"}
            }
        },
    branches:['exp','gr'],
    upgrades: {
        11: {
            title: "[ↆ1] The Stupidity Badge",
            description: "Unlock Pentation. Nah jk, you get literally nothing.",
            cost: new Decimal(1),
            effect() {
            return player.gr.points.pow(0.003)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" compacted grass" }, // Add formatting to the effect
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (hasUpgrade('gr', 12)) || player.tetr.unlocked}

    
})

addLayer("a", {
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#abcdef",
    resource: "unobtainium", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    infoboxes: {
        info: {
            title: "Achievements",
            body() { return "I bought one upgrade and got an achievement! Yay!" },
        }
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Where have I seen this before?",
            done() { return hasUpgrade("p", 41); },
            tooltip: "Unlock Energy. (upgrade #4)",
        },

        12: {
            name: "This isn't <h2>ultra</h2> at all...",
            done() { return hasUpgrade("p", 51); },
            tooltip: "Unlock Super. (upgrade #5)",
        },

        13: {
            name: "Math?!",
            done() { return hasUpgrade("s", 11); },
            tooltip: "Unlock Plus. (upgrade s1)",
        },

        14: {
            name: "WHAT IS THIS MATH DOING HERE BRO",
            done() { return hasUpgrade("s", 21); },
            tooltip: "Unlock Multi. (upgrade s2)",
        },

        15: {
            name: "I'm tired of this.",
            done() { return hasUpgrade("s", 31); },
            tooltip: "Unlock Ultra. (upgrade s3)",
        },

        21: {
            name: "Math: The Sequel",
            done() { return hasUpgrade("u", 11); },
            tooltip: "Unlock Exp. (upgrade u1)",
        },

        22: {
            name: "Infinity first, Eternity second, Reality third.",
            done() { return hasUpgrade("u", 21); },
            tooltip: "Unlock Infinity. (relic 4/7, for free!)",
        },

        23: {
            name: "Enough meta references!",
            done() { return hasUpgrade("u", 31); },
            tooltip: "Unlock Meta. (upgrade u2)",
        },

        24: {
            name: "<i>says xp</i> You leveled up to 1! GG!",
            done() { return hasUpgrade("u", 41); },
            tooltip: "Unlock XP. (upgrade u3)",
        },

        25: {
            name: "<i>says xp billions of times</i> You leveled up to 2! GG!",
            done() { return hasUpgrade("xp", 12); },
            tooltip: "Unlock Levels. (2nd xp upgrade)",
        },
        26: {
            name: "It's just level 1 all over again",
            done() { return (hasMilestone('lv', 2)); },
            tooltip: "Unlock Mega Levels. (Level 4)",
        },
        31: {
            name: "Hydration!",
            done() { return hasUpgrade("gr", 11);},
            tooltip: "Buy the first Grass upgrade. (upgrade g1.1)",
        },
        32: {
            name: "Math just keeps going it seems.",
            done() { return hasUpgrade("gr", 12);},
            tooltip: "Buy the second Grass upgrade. (upgrade g1.2)",
        },
        33: {
            name: "This is such an Antimatter Dimensions reference!",
            done() { return hasUpgrade("gr", 13);},
            tooltip: "Buy the third Grass upgrade. (upgrade g1.3)",
        },
        34: {
            name: "We've fallen back right to the beginning.",
            done() { return hasUpgrade("gr", 21);},
            tooltip: "Re-unlock spacetime. (upgrade g1.0)",
        },
        35: {
            name: "Back to the real beginning.",
            done() { return hasMilestone("sst", 0);},
            tooltip: "Unlock Cookies. (SST milestone)",
        },
        36: {
            name: "Who remembers v0.13?",
            done() { return hasMilestone("c", 1);},
            tooltip: "Unlock Chocolate Cookies. (cookie milestone)",
        },
        37: {
            name: "This will only get faster.",
            done() { return hasMilestone("c", 2);},
            tooltip: "Unlock Dark Chocolate Cookies. (cookie milestone)",
        },
        38: {
            name: "Magnets...",
            done() { return hasMilestone("c", 5);},
            tooltip: "Unlock Vanilla Cookies. (cookie milestone)",
        },
        41: {
            name: "A fresh start",
            done() { return hasMilestone("mm", 0);},
            tooltip: "Get your first Master Magnet.",
        },
        42: {
            name: "What",
            done() { return hasMilestone("mm", 1);},
            tooltip: "Get your... second Master Magnet??",
        },
        51: {
            name: "Tiered Up",
            done() { return player.tierone.points.gte(1);},
            tooltip: "Get a Tier 1 Power.",
        },
        52: {
            name: "Really Tiered Up",
            done() { return player.tiertwo.points.gte(1);},
            tooltip: "Get a Tier 2 Power. ",
        },
        53: {
            name: "So random",
            done() { return hasUpgrade('tiertwo',11)},
            tooltip: "Unlock the dice layer (rarity points). ",
        },
    },
})

addLayer("ba", {
    symbol: "BA",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#fedcba",
    resource: "bonus unobtainium", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Bonus Achievements")
    },
    infoboxes: {
        info: {
            title: "Bonus Achievements",
            body() { return "Because when you reach these bonus layers you want to keep playing." },
        }
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Thanks for the pie!",
            done() { return hasUpgrade("pie", 11); },
            tooltip: "Get the small pie. (pie bonus layer)",
        },

        12: {
            name: "Yay, pies!",
            done() { return hasUpgrade("pie", 21); },
            tooltip: "Get the medium pie. (pie bonus layer)",
        },

        13: {
            name: "Pie for me, pie for you",
            done() { return hasUpgrade("pie", 31); },
            tooltip: "Get the big pie! (pie bonus layer)",
        },

        21: {
            name: "Cookie thanks you",
            done() { return hasUpgrade("bc", 11); },
            tooltip: "Get the cake that doesn't exist...",
        },
    },
})

addLayer("hard", {
    symbol: "HC",
    position: 2,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#86872b",
    resource: "hardcapped unobtainium", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Hardcaps")
    },
    infoboxes: {
        info: {
            title: "Hardcaps",
            body() { return "Hardcaps! The official way to prevent inflation! <br> <i>does not prevent level 2 -> 3 jump</i>" },
        }
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Energized Hardcap",
            done() { return player.e.points.gt("99")},
            tooltip: "Reach the energy hardcap of 100.",
        },
        12: {
            name: "Super Hardcap 1",
            done() { return player.s.points.gt("1e225000")},
            tooltip: "Reach the pre-ultra super hardcap of 1e225,000.",
        },
        13: {
            name: "Super Hardcap 2",
            done() { return player.s.points.gt("1e999999999")},
            tooltip: "Reach the post-ultra super hardcap of <i>1e1,000,000,000, which cannot be increased any further!</i>",
        },
        14: {
            name: "Cookie Hardcap",
            done() { return player.c.points.gte("1e1e15")},
            tooltip: "Reach the e1e15 cookie hardcap.",
        },
        15: {
            name: "Vanilla Cookie Hardcap",
            done() { return player.vc.points.gte("1e13")},
            tooltip: "Reach the 1e13 vanilla cookie hardcap.",
        },
    },
})

addLayer("what", {
    name: "whatthe",
    tooltip: "Universe 0.",
    symbol: "???",
    position: 3,
    row: "side",
    color: "#c86767",
    resource: "eternal voids", 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    update() {
        if (player.what.points.gt("1")) player.what.points = new Decimal("1")
    },
    infoboxes: {
        info: {
            title: "Universe 0 - The Eternal Void",
            body() { return "<i>Do you know what you are doing?</i><br> This place contains some of the most dangerous things you will see in the game. Do not touch." },
        }
    },

    clickables: {
        11: {
           display() { return "Get the unobtainable." },
           tooltip() { return "There's no going back after this."},
           canClick() { return true },
           color() { return "#000000" },
            onClick() {
                player.a.points = new Decimal(1)
                player.what.points = player.what.points.add(0.0001)
            }
        },
    },

    achievements: {
        11: {
            name: "Are you REALLY in the void?",
            done() { return player.what.points.gte(new Decimal("0.9999")) },
            tooltip: "Get your first eternal void...",
        },
    },

    upgrades: {
        11: {
            title: "The Void's Entrance",
            description: "Double your G̴L̶I̸T̸C̷H",
            cost: new Decimal(0.9999),
        },

        12: {
            title: "The Void's G̴L̶I̸T̸C̷H",
            description: "G̴L̶I̸T̸C̷H your G̴L̶I̸T̸C̷H",
            cost: new Decimal(Infinity),
            unlocked() { return hasUpgrade(this.layer, 11); },
        },
    },
})

addLayer("sa", {
    symbol: "SA",
    position: 4,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#617879",
    resource: "secret unobtainium", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Secret Achievements")
    },
    infoboxes: {
        info: {
            title: "Secret Achievements",
            body() { return "It's a mystery!" },
        }
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "The first one is always free ",
            done() { return true },
            goalTooltip: "Do you really need a hint for this?",
            doneTooltip: "You get it at the start of the game.",
        },
        12: {
            name: "Very Laggy",
            done() { return player.e.points.gte(1000) },
            goalTooltip: "Hint: Try using lag to your advantage.", // b54b081604a11200 - this is a useless string
            doneTooltip: "Get 1,000 Energy.",
        },
    },
})

addLayer("tf", {
    name: "flux",
    tooltip: "Time Flux",
    symbol: "TF",
    position: 5,
    row: "side",
    color: "#dcdf2b",
    resource: "seconds of Time Flux", 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    clickables: {
        11: {
           display() { return "Click me for Time Flux!" },
           canClick() { return true },
           color() { return "#000000" },
           gainMult() {
            mult = new Decimal(1)
            if (hasUpgrade('tf', 11)) mult = mult.add(upgradeEffect('tf', 11))
            return mult 
           },
            onClick() {
                player.tf.points = player.tf.points.add(mult)
            }
        },
        21: {
           display() { return "x1 Speed" },
           tooltip() { return "0s required"},
           canClick() { return true },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 1
            }
        },
        22: {
           display() { return "x2 Speed" },
           tooltip() { return "60s required"},
           canClick() { return player.tf.points.gte("60") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 2
            }
        },
        23: {
           display() { return "x3 Speed" },
           tooltip() { return "300s required"},
           canClick() { return player.tf.points.gte("300") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 3
            }
        },
        24: {
           display() { return "x5 Speed" },
           tooltip() { return "900s required"},
           canClick() { return player.tf.points.gte("900") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 5
            }
        },
        25: {
           display() { return "x10 Speed" },
           tooltip() { return "3,600s required"},
           canClick() { return player.tf.points.gte("3.6e3") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 10
            }
        },
        31: {
           display() { return "x30 Speed" },
           tooltip() { return "21,600s required"},
           canClick() { return player.tf.points.gte("21.6e3") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 30
            }
        },
        32: {
           display() { return "x60 Speed" },
           tooltip() { return "86,400s required"},
           canClick() { return player.tf.points.gte("86.4e3") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 60
            }
        },
        33: {
           display() { return "x240 Speed" },
           tooltip() { return "604,800s required"},
           canClick() { return player.tf.points.gte("604.8e3") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 240
            }
        },
        34: {
           display() { return "x720 Speed" },
           tooltip() { return "2.592Ms required"},
           canClick() { return player.tf.points.gte("2.592e6") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 720
            }
        },
        35: {
           display() { return "x3,600 Speed" },
           tooltip() { return "31.536Ms required"},
           canClick() { return player.tf.points.gte("31.536e6") },
           color() { return "#000000" },
            onClick() {
                player.devSpeed = 3.6e3
            }
        },
    },
    upgrades: {
        11: {
            title: "Oh my god it's a playtime based boost!!!",
            description: "Playtime boosts time flux. (too lazy to add a tooltip so it's playtime divided by 1,250)",
            cost: new Decimal(10000),
            effect() {
            return (player.timePlayed)/1250
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" more timeflux per click!!! wow" }, // Add formatting to the effect
        },
    },
})