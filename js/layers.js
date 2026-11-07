addLayer("p", {
    name: "plants", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        grassField: [false, false, false, false, false, false, false, false, false],
        spawnTimer: 0,
        autoTimer: 0,
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
            if (hasUpgrade('pe', 31)) {
                let m = new Decimal(hasUpgrade('pe', 11) ? 2 : 1)
                let grassPerTile = layers.p.buyables[11].effect().add(1).mul(m)
                player.points = player.points.add(grassPerTile.mul(diff))
                player.p.xp = new Decimal(player.p.xp || 0).add(new Decimal(1).mul(diff))
            }
            if (hasUpgrade('pe', 33)) {
                if (player.p.autoclaimTimer === undefined) player.p.autoclaimTimer = 0
                player.p.autoclaimTimer += diff
                if (player.p.autoclaimTimer >= 30) {
                    player.p.autoclaimTimer = 0
                    let occupiedCount = 0
                    for (let i = 0; i < player.p.grassField.length; i++) {
                        if (player.p.grassField[i] === true) {
                            occupiedCount++
                            player.p.grassField[i] = false
                        }
                    }
                    if (occupiedCount > 0) {
                        let m = new Decimal(hasUpgrade('pe', 11) ? 2 : 1)
                        let grassPerTile = layers.p.buyables[11].effect().add(1).mul(m)
                        player.points = player.points.add(grassPerTile.mul(occupiedCount))
                        player.p.xp = new Decimal(player.p.xp || 0).add(new Decimal(hasUpgrade('pe', 11) ? 2 : 1).mul(occupiedCount))
                    }
                }
            }

            let currentXp = new Decimal(player.p.xp || 0)
            let currentLvl = new Decimal(player.p.level || 0)
            let xpNeeded = new Decimal(50).mul(new Decimal(1.2).pow(currentLvl))
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
        ["bar", "autoProgress"],
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
                let xpNeeded = new Decimal(50).mul(new Decimal(1.2).pow(player.p.level || 0))
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
                let xpNeeded = new Decimal(50).mul(new Decimal(1.2).pow(player.p.level || 0))
                return `xp: ${format(xp, 2)}/${format(xpNeeded, 2)} (level ${format(player.p.level, 0)})`
            }
        },
        autoProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            unlocked() { return hasUpgrade('pe', 33) },
            progress() { 
                return (player.p.autoclaimTimer || 0) / 30.0
            },
            fillStyle() { 
                return { "background-color": "#111399" } 
            },
            baseStyle() { 
                return { "background-color": "#0d0e76", "border": "1px solid rgba(0,0,0,0.5)" } 
            },
            textStyle() { 
                return { "color": "#000", "font-family": "monospace", "font-size": "10px", "font-weight": "bold" } 
            },
            display() { 
                let timeLeft = Math.max(0, 30.0 - (player.p.autoclaimTimer || 0)).toFixed(1)
                return `autoclaim in: ${timeLeft}s (cooldown: 30s)`
            }
        },
    },
    clickables: {
        11: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[0] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[0] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[0] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[0] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[0] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[0] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[0] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        12: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[1] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[1] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[1] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[1] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[1] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[1] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[1] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        13: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[2] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[2] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[2] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[2] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[2] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[2] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[2] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        21: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[3] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[3] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[3] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[3] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[3] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[3] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[3] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        22: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[4] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[4] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[4] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[4] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[4] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[4] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[4] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        23: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[5] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[5] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[5] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[5] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[5] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[5] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.7)", cursor: player.p.grassField[5] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        31: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[6] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[6] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[6] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[6] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[6] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[6] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[6] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        32: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[7] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[7] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[7] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[7] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[7] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[7] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[7] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        33: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); return player.p.grassField[8] ? "+" + format(layers.p.buyables[11].effect().add(1).mul(m)) + "<br>grass" : "" }, canClick() { return player.p.grassField[8] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1).mul(hasUpgrade('pe',12)?3:1); player.points = player.points.add(layers.p.buyables[11].effect().add(1).mul(m)); player.p.xp = player.p.xp.add(1); player.p.grassField[8] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[8] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[8] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[8] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[8] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } }
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
            cost(x) { 
                let baseCost = new Decimal(2).pow(x).floor()
                if (hasUpgrade('pe', 53)) return baseCost.sqrt().floor().max(1)
                return baseCost
            },
            effect() {
                let amount = getBuyableAmount('p', 12)
                return amount.mul(0.1)
            },
            display() { 
                let amount = getBuyableAmount('p', 12)
                return "with plants, it makes grass appear faster! -0.1s per level.\n\n" +
                       "boost: -" + format(this.effect()) + "s \n" +
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
                let isMaxed = amount.gte(49)
                let canBuy = this.canAfford() && !isMaxed
                return {
                    width: "240px",
                    height: "170px",
                    borderRadius: "16px",
                    padding: "12px",
                    background: isMaxed ? "linear-gradient(135deg, #1b365d, #0f2042)" : (canBuy ? "linear-gradient(135deg, #0a4d47, #1b6b3e)" : "linear-gradient(135deg, #121212, #1a1a1a)"),
                    border: isMaxed ? "3px solid #4a90e2" : (canBuy ? "3px solid #38ef7d" : "3px solid #262626"),
                    color: isMaxed ? "#91bdff" : (canBuy ? "#e0e0e0" : "#555555"),
                    textShadow: (canBuy || isMaxed) ? "0px 1px 3px rgba(0,0,0,0.9)" : "none",
                    boxShadow: isMaxed ? "0 4px 15px rgba(15, 32, 66, 0.6), inset 0 0 8px rgba(0,0,0,0.5)" : (canBuy ? "0 4px 15px rgba(27, 107, 62, 0.5), inset 0 0 8px rgba(0,0,0,0.4)" : "inset 0 0 8px rgba(0,0,0,0.6)"),
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
    requires: new Decimal("(e^1e300)300"), 
    resource: "perks", 
    baseResource: "placeholder",
    baseAmount() { return player.points }, 
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
        11: {
            title: "Grass from Perks",
            description: "Double grass from tiles.",
            cost: new Decimal(1),
            branches: ['31'], 
            style() {
                let hasUpg = hasUpgrade('pe', 11)
                let canAfford = player.pe.points.gte(1)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
        21: {
            unlocked() { return hasUpgrade('pe', 11) },
            style: {
                opacity: 0
            }
        },
        31: {
            title: "Automatic Grass",
            description: "You now get grass/s based on your grass per tile. Also, +1 xp/s.",
            cost: new Decimal(1),
            branches: ['33'],
            unlocked() { return hasUpgrade('pe', 11) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 31)
                let canAfford = player.pe.points.gte(1)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
        32: {
            unlocked() { return hasUpgrade('pe', 31) },
            style: {
                opacity: 0
            }
        },
        33: {
            title: "True Automatic Grass",
            description: "The tiles are now autoclaimed every 30s.",
            cost: new Decimal(2),
            branches: ['51'],
            unlocked() { return hasUpgrade('pe', 31) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 33)
                let canAfford = player.pe.points.gte(2)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
        41: {
            unlocked() { return hasUpgrade('pe', 33) },
            style: {
                opacity: 0
            }
        },
        51: {
            title: "Flowers!",
            description: "Unlock flowers. Wait, what are those? Just take the 50 flowers and move on... (you will unlock these later)",
            cost: new Decimal(1),
            branches: ['53'],
            unlocked() { return hasUpgrade('pe', 33) }, 
            onPurchase() {
                player.f.points = player.f.points.add(50)
            },
            style() {
                let hasUpg = hasUpgrade('pe', 51)
                let canAfford = player.pe.points.gte(1)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
        52: {
            unlocked() { return hasUpgrade('pe', 51) },
            style: {
                opacity: 0
            }
        },
        53: {
            title: "Getting Real",
            description: "Square root the cost of the Speed from Plants buyable.",
            cost: new Decimal(2),
            branches: ['71'],
            unlocked() { return hasUpgrade('pe', 51) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 53)
                let canAfford = player.pe.points.gte(2)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
        61: {
            unlocked() { return hasUpgrade('pe', 53) },
            style: {
                opacity: 0
            }
        },
        71: {
            title: "",
            description: "endgame. (level 10 btw)",
            cost: new Decimal(3),
            branches: [''],
            unlocked() { return hasUpgrade('pe', 53) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 71)
                let canAfford = player.pe.points.gte(3)
                return {
                    width: "180px",
                    height: "110px",
                    borderRadius: "12px",
                    background: hasUpg ? "linear-gradient(135deg, #0d2040, #143566)" : (canAfford ? "linear-gradient(135deg, #0f2b5c, #1d4ed8)" : "#161616"),
                    border: hasUpg ? "2px solid #60a5fa" : (canAfford ? "2px solid #3b82f6" : "2px solid #2d2d2d"),
                    color: hasUpg ? "#93c5fd" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(96, 165, 250, 0.4)" : (canAfford ? "0 4px 10px rgba(59, 130, 246, 0.3)" : "none"),
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    fontWeight: "bold",
                    transition: "all 0.15s ease"
                }
            }
        },
    },  
})

addLayer("f", {
    name: "flowers", 
    symbol: "F", 
    position: 1, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        lastClaimed: 0
    }},
    nodeStyle: {
        background: "linear-gradient(135deg, #b01e6a, #fae0ff, #ff94c2)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: "3px",
        color: "rgb(0, 0, 0)",
        textShadow: "0px 1px 2px rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 15px rgba(250, 224, 255, 0.5)"
    },
    color: "#fae0ff", 
    requires: new Decimal("(e^1e300)300"), 
    resource: "flowers", 
    baseResource: "placeholder", 
    baseAmount() { return player.points }, 
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
    row: 100,
    layerShown() { return false },
    tabFormat: [
        "main-display",
        "blank",
        "clickables",
    ],
    clickables: {
        11: {
            display() {
                let now = Date.now()
                let last = player.f.lastClaimed || 0
                let cooldown = 24 * 60 * 60 * 1000
                let timePassed = now - last
                let canClaim = timePassed >= cooldown
                if (canClaim) return "The daily is ready!!<br><br>+250 Flowers"
                
                let timeLeftMs = Math.max(0, cooldown - timePassed)
                let hours = Math.floor(timeLeftMs / (1000 * 60 * 60))
                let minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))
                let seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000)
                return `The daily has been claimed!!<br><br>Next reward in:<br>${hours}h ${minutes}m ${seconds}s`
            },
            canClick() {
                let now = Date.now()
                let last = player.f.lastClaimed || 0
                let cooldown = 24 * 60 * 60 * 1000
                return (now - last) >= cooldown
            },
            onClick() {
                player.f.lastClaimed = Date.now()
                player.f.points = player.f.points.add(250)
            },
            style() {
                let now = Date.now()
                let last = player.f.lastClaimed || 0
                let cooldown = 24 * 60 * 60 * 1000
                let canClaim = (now - last) >= cooldown
                return {
                    width: "220px",
                    height: "120px",
                    borderRadius: "16px",
                    padding: "12px",
                    background: canClaim ? "linear-gradient(135deg, #fae0ff, #b01e6a)" : "linear-gradient(135deg, #2a202d, #140d17)",
                    border: canClaim ? "3px solid #ffffff" : "3px solid #3c2a42",
                    color: canClaim ? "#000000" : "#666",
                    boxShadow: canClaim ? "0 6px 20px rgba(250, 224, 255, 0.4), inset 0 0 10px rgba(255,255,255,0.4)" : "none",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    cursor: canClaim ? "pointer" : "default",
                    transition: "all 0.2s ease"
                }
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "Your First Flowers",
            effectDescription: "Does absolutely nothing.",
            done() { return player.f.points.gte(50) },
            style() {
                let completed = this.done()
                return {
                    width: "400px",
                    height: "70px",
                    borderRadius: "10px",
                    background: completed ? "linear-gradient(135deg, #1b365d, #fae0ff)" : "#161616",
                    border: completed ? "2px solid #fae0ff" : "2px solid #2d2d2d",
                    color: completed ? "#000000" : "#555555",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    padding: "8px"
                }
            }
        }
    },
})

addLayer("rf", {
    name: "rare flowers", 
    symbol: "RF", 
    position: 2, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        lastRareClaimed: 0
    }},
    nodeStyle: {
        background: "linear-gradient(135deg, #1c3d42, #dcffff, #8bc34a)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: "3px",
        color: "rgb(0, 0, 0)",
        textShadow: "0px 1px 2px rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 15px rgba(220, 255, 255, 0.6)"
    },
    color: "#dcffff", 
    requires: new Decimal("(e^1e300)300"), 
    resource: "rare flowers", 
    baseResource: "placeholder", 
    baseAmount() { return player.points }, 
    type: "none",
    branches: ['f'],
    row: 100,
    layerShown() { return player.f.points.gte(2500) || player.rf.points.gt(0) },
    tabFormat: [
        "main-display",
        "blank",
        "clickables"
    ],
    clickables: {
        11: {
            display() {
                let now = Date.now()
                let last = player.rf.lastRareClaimed || 0
                let cooldown = 60 * 60 * 1000
                let timePassed = now - last
                if (timePassed >= cooldown) return "The hourly is ready!!<br><br>+50 Rare Flowers"
                let timeLeftMs = Math.max(0, cooldown - timePassed)
                let minutes = Math.floor(timeLeftMs / (1000 * 60))
                let seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000)
                return `The hourly has been claimed!!<br><br>Next reward in:<br>${minutes}m ${seconds}s`
            },
            canClick() { return (Date.now() - (player.rf.lastRareClaimed || 0)) >= 60 * 60 * 1000 },
            onClick() {
                player.rf.lastRareClaimed = Date.now()
                player.rf.points = player.rf.points.add(50)
            },
            style() {
                let canClaim = (Date.now() - (player.rf.lastRareClaimed || 0)) >= 60 * 60 * 1000
                return {
                    width: "220px", height: "120px", borderRadius: "16px", padding: "12px",
                    background: canClaim ? "linear-gradient(135deg, #dcffff, #2d6a80)" : "linear-gradient(135deg, #152226, #0b1114)",
                    border: canClaim ? "3px solid #ffffff" : "3px solid #1a2a2e", color: canClaim ? "#000000" : "#555",
                    boxShadow: canClaim ? "0 6px 20px rgba(220, 255, 255, 0.4), inset 0 0 10px rgba(255,255,255,0.4)" : "none",
                    fontWeight: "bold", fontFamily: "monospace", fontSize: "12px", cursor: canClaim ? "pointer" : "default", transition: "all 0.2s ease"
                }
            }
        }
    },
})