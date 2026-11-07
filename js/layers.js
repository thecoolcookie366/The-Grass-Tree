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