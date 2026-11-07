addLayer("p", {
    name: "plants", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        grassField: [false, false, false, false, false, false, false, false, false],
        spawnTimer: 0,
        xp: new Decimal(0),
        level: new Decimal(0),
    }},
    nodeStyle: {
        background: "linear-gradient(135deg, #11998e, #38ef7d, #a8ff78)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(0,0,0,0.5)",
        color: "rgb(255, 255, 255)",
        textShadow: "0px 0px 4px rgba(0, 0, 0, 0.8)",
    },
    color: "#38ef7d",
    requires: new Decimal(5), 
    resource: "plants", 
    baseResource: "grass", 
    baseAmount() { return player.points }, 
    type: "static", 
    exponent: 0.666, 
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    branches: ['pe'],
    canBuyMax() {return true},
    resetsNothing() {return true},
    autoPrestige() {return true},
    update(diff) {
        if (player.p && player.p.grassField) {
            player.p.spawnTimer += diff 
            let spawnInterval = Math.max(0.1, 5.0 - layers.p.buyables[12].effect().toNumber())  
            if (player.p.spawnTimer >= spawnInterval) {
                player.p.spawnTimer = 0  
                let emptySlots = []
                for (let i = 0 ; i < player.p.grassField.length ; i++) {
                    if (player.p.grassField[i] === false) {
                        emptySlots.push(i) 
                    }
                }
                if (emptySlots.length > 0) {
                    let randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)] 
                    player.p.grassField[randomSlot] = true 
                }
            }

            let currentXp = new Decimal(player.p.xp || 0)
            let currentLvl = new Decimal(player.p.level || 0)
            let xpNeeded = new Decimal(100).mul(new Decimal(1.2).pow(currentLvl))

            if (currentXp.gte(xpNeeded)) {
                player.p.xp = currentXp.sub(xpNeeded)
                player.p.level = currentLvl.add(1)
                player.pe.points = new Decimal(player.pe.points || 0).add(1)
            }
        }
    },
    tabFormat: [
        "main-display",
        "blank",
        ["bar", "plantProgress"],
        ["bar", "spawnProgress"],
        ["bar", "fieldCapacity"],
        ["bar", "xpProgress"],
        "blank",
        "clickables", 
        "blank",
        "buyables"
    ],
    bars: {
        plantProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let req = getNextAt('p')
                let current = player.points
                return current.div(req).min(1).toNumber()
            },
            fillStyle() { 
                return { "background-color": "#63ef38" } 
            },
            baseStyle() { 
                return { "background-color": "#47ae28", "border": "1px solid rgba(255,255,255,0.1)" } 
            },
            textStyle() { 
                return { "color": "#000", "font-family": "monospace", "font-size": "10px" } 
            },
            display() {
                let req = getNextAt('p')
                let current = player.points
                return `next plant: ${format(current)} / ${format(req)} grass`
            }
        },
        spawnProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() { 
                let spawnInterval = Math.max(0.1, 5.0 - layers.p.buyables[12].effect().toNumber())
                return player.p.spawnTimer / spawnInterval 
            },
            fillStyle() { 
                return { "background-color": "#38ef7d" } 
            },
            baseStyle() { 
                return { "background-color": "#259b52", "border": "1px solid rgba(0,0,0,0.5)" } 
            },
            textStyle() { 
                return { "color": "#000", "font-family": "monospace", "font-size": "10px" } 
            },
            display() { 
                let spawnInterval = Math.max(0.1, 5.0 - layers.p.buyables[12].effect().toNumber())
                let timeLeft = Math.max(0, spawnInterval - player.p.spawnTimer).toFixed(2)
                return `time until next grass: ${timeLeft}s (cooldown: ${spawnInterval}s)`
            }
        },
        fieldCapacity: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let occupied = 0
                for (let i=0; i<9; i++) { if(player.p.grassField[i]) occupied++ }
                return occupied / 9
            },
            fillStyle() { 
                return { "background-color": "#11998e" } 
            },
            baseStyle() { 
                return { "background-color": "#0a5f58", "border": "1px solid rgba(0,0,0,0.5)" } 
            },
            textStyle() { 
                return { "color": "#000", "font-family": "monospace", "font-size": "10px" } 
            },
            display() {
                let occupied = 0
                for(let i=0; i<9; i++) { if(player.p.grassField[i]) occupied++ }
                return `grass ready: ${occupied}/9`
            }
        },
        xpProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let xp = new Decimal(player.p.xp || 0)
                let xpNeeded = new Decimal(100).mul(new Decimal(1.2).pow(player.p.level || 0))
                return xp.div(xpNeeded).min(1)
            },
            fillStyle() { 
                return { "background-color": "#116799" } 
            },
            baseStyle() { 
                return { "background-color": "#0c4c71", "border": "1px solid rgba(255,255,255,0.1)" } 
            },
            textStyle() { 
                return { "color": "#000", "font-family": "monospace", "font-size": "10px", "font-weight": "bold" } 
            },
            display() {
                let xp = new Decimal(player.p.xp || 0)
                let xpNeeded = new Decimal(100).mul(new Decimal(1.2).pow(player.p.level || 0))
                return `xp: ${format(xp, 0)}/${format(xpNeeded, 0)} (level ${format(player.p.level, 0)})`
            }
        },
    },
    clickables: {
        11: { display() { return player.p.grassField[0] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[0] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[0] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[0] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[0] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[0] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[0] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        12: { display() { return player.p.grassField[1] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[1] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[1] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[1] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[1] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[1] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[1] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        13: { display() { return player.p.grassField[2] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[2] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[2] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[2] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[2] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[2] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[2] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        21: { display() { return player.p.grassField[3] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[3] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[3] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[3] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[3] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[3] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[3] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        22: { display() { return player.p.grassField[4] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[4] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[4] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[4] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[4] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[4] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[4] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        23: { display() { return player.p.grassField[5] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[5] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[5] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[5] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[5] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[5] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.7)", cursor: player.p.grassField[5] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        31: { display() { return player.p.grassField[6] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[6] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[6] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[6] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[6] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[6] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[6] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        32: { display() { return player.p.grassField[7] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[7] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[7] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[7] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[7] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[7] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[7] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        33: { display() { return player.p.grassField[8] ? "+" + format(layers.p.buyables[11].effect().add(1)) + "<br>grass" : "" }, canClick() { return player.p.grassField[8] === true }, onClick() { player.points = player.points.add(layers.p.buyables[11].effect().add(1)); player.p.xp = player.p.xp.add(1); player.p.grassField[8] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[8] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[8] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[8] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[8] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } }
    },
    buyables: {
        11: {
            title: "Grass from Plants",
            cost(x) { return new Decimal(1).add(x.pow(1.5)).floor() },
            effect() {
                let amount = getBuyableAmount('p', 11)
                let baseEffect = amount.mul(0.5)
                let milestones = amount.div(25).floor()
                let multiplier = new Decimal(2).pow(milestones)
                return baseEffect.mul(multiplier)
            },
            display() {
                let amount = getBuyableAmount('p', 11)
                let nextMilestone = amount.div(25).floor().add(1).mul(25)
                let milestoneText = amount.gte(25) ? `\n(multi from each 25 levels: x${format(new Decimal(2).pow(amount.div(25).floor()), 0)})` : ""
                return "with plants, you make +50% more grass per level! \nevery 25 levels, the total boost is doubled!\n\n" +
                "boost: +" + format(this.effect().mul(100)) + "%" + milestoneText + "\n" +
                "cost: " + format(this.cost()) + " plants\n" +
                "level " + format(amount, 0) + ", next doubling at level " + format(nextMilestone, 0)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let canBuy = this.canAfford()
                return {
                    width: "240px",
                    height: "170px",
                    borderRadius: "16px",
                    padding: "12px",
                    background: canBuy ? "linear-gradient(135deg, #0a4d47, #1b6b3e)" : "linear-gradient(135deg, #121212, #1a1a1a)",
                    border: canBuy ? "3px solid #38ef7d" : "3px solid #262626",
                    color: canBuy ? "#e0e0e0" : "#555555",
                    textShadow: canBuy ? "0px 1px 3px rgba(0,0,0,0.9)" : "none",
                    boxShadow: canBuy ? "0 4px 15px rgba(27, 107, 62, 0.5), inset 0 0 8px rgba(0,0,0,0.4)" : "inset 0 0 8px rgba(0,0,0,0.6)",
                    fontWeight: "bold",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    cursor: canBuy ? "pointer" : "default",
                    whiteSpace: "pre-line",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }
            }
        },
        12: {
            title: "Speed from Plants",
            cost(x) { return new Decimal(2).pow(x).floor() },
            effect() {
                let amount = getBuyableAmount('p', 12)
                return amount.mul(0.1)
            },
            display() { 
                let amount = getBuyableAmount('p', 12)
                return "with plants, it makes grass appear faster! -0.1s per level.\n\n" +
                       "boost: -" + format(this.effect()) + "s spawn cooldown\n" +
                       "cost: " + format(this.cost()) + " plants\n" +
                       "level: " + format(amount, 0) + " / 49"
            },
            canAfford() { 
                let amount = getBuyableAmount('p', 12)
                return player[this.layer].points.gte(this.cost()) && amount.lt(49)
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let amount = getBuyableAmount('p', 12)
                let canBuy = this.canAfford() && amount.lt(49)
                return {
                    width: "240px",
                    height: "170px",
                    borderRadius: "16px",
                    padding: "12px",
                    background: canBuy ? "linear-gradient(135deg, #0a4d47, #1b6b3e)" : "linear-gradient(135deg, #121212, #1a1a1a)",
                    border: canBuy ? "3px solid #38ef7d" : "3px solid #262626",
                    color: canBuy ? "#e0e0e0" : "#555555",
                    textShadow: canBuy ? "0px 1px 3px rgba(0,0,0,0.9)" : "none",
                    boxShadow: canBuy ? "0 4px 15px rgba(27, 107, 62, 0.5), inset 0 0 8px rgba(0,0,0,0.4)" : "inset 0 0 8px rgba(0,0,0,0.6)",
                    fontWeight: "bold",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    cursor: canBuy ? "pointer" : "default",
                    whiteSpace: "pre-line",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }
            }
        },
    },
    row: 0,
    layerShown() { return true },
})

addLayer("pe", {
    name: "perks", 
    symbol: "PE", 
    position: 1, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    nodeStyle: {
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #4a00e0)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: "3px",
        color: "rgb(255, 255, 255)",
        textShadow: "0px 2px 4px rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 15px rgba(42, 82, 152, 0.4)",
    },
    color: "#2a5298",
    requires: new Decimal(100), 
    resource: "perks", 
    baseResource: "plants",
    baseAmount() { return player.p.points }, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    row: 0,
    layerShown() { return player.p.level.gte(1) },
    tabFormat: [
        "main-display",
        "blank",
        "upgrades"
    ],
    upgrades: {

    }
})