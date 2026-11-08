addLayer("p", {
    name: "plants", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        grassField: [false, false, false, false, false, false, false, false, false, false],
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
    branches: ['pe','pr'],
    canBuyMax() {return true},
    resetsNothing() {return true},
    autoPrestige() {return true},
    update(diff) {
        if (player.p && player.p.grassField) {
            let hasPr12 = player.pr && player.pr.upgrades && (player.pr.upgrades.includes(12) || player.pr.upgrades.includes('12'))
            let hasPr11 = player.pr && player.pr.upgrades && (player.pr.upgrades.includes(11) || player.pr.upgrades.includes('11'))

            if (hasPr12) {
                if (player.p.grassField.length === 9) {
                    player.p.grassField.push(false)
                }
            }
            else {
                if (player.p.grassField.length > 9) {
                    player.p.grassField = player.p.grassField.slice(0, 9)
                }
            }

            player.p.spawnTimer += diff 
            let spawnInterval = Math.max(0.1, 5.0 - buyableEffect('p', 12).toNumber())
            if (hasPr11) spawnInterval = Math.max(0.1, spawnInterval - 0.5) 
            
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
                let grassPerTile = buyableEffect('p', 11)
                if (!grassPerTile || typeof grassPerTile.add !== 'function') grassPerTile = new Decimal(0)
                grassPerTile = grassPerTile.add(1).mul(m)
                if (hasUpgrade('pe', 113)) {
                    grassPerTile = grassPerTile.pow(1.5)
                }
                let currentRoot = buyableEffect('p', 13) || new Decimal(3)
                let xpPerTile = grassPerTile.pow(new Decimal(1).div(currentRoot))
                player.points = player.points.add(grassPerTile.mul(diff))
                player.p.xp = new Decimal(player.p.xp || 0).add(xpPerTile.mul(diff))
            }

            if (hasUpgrade('pe', 33)) {
                if (player.p.autoclaimTimer === undefined) player.p.autoclaimTimer = 0
                player.p.autoclaimTimer += diff
                if (player.p.autoclaimTimer >= 30) {
                    player.p.autoclaimTimer = 0
                    let occupiedCount = 0
                    for (let i = 0; i < 9; i++) {
                        if (player.p.grassField[i] === true) {
                            occupiedCount++
                            player.p.grassField[i] = false
                        }
                    }
                    if (occupiedCount > 0) {
                        let m = new Decimal(hasUpgrade('pe', 11) ? 2 : 1)
                        let grassPerTile = buyableEffect('p', 11)
                        if (!grassPerTile || typeof grassPerTile.add !== 'function') grassPerTile = new Decimal(0)
                        grassPerTile = grassPerTile.add(1).mul(m)
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
    tabFormat: {
        "First": {
            unlocked() { return !hasUpgrade('pe', 73) },
            buttonStyle: { "display": "none" },
            content: [
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
            ]
        },
        "Main": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { "font-weight": "bold", "border": "2px solid #ff4d4d", "color": "#ff4d4d", "background-color": "#181a1b", "margin": "4px" },
            content: [
                "main-display",
                "blank",
                "clickables", 
                "blank",
                "buyables"
            ]
        },
        "Main + Bars": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { 
                "font-weight": "bold", 
                "border": "2px solid #ffb300", 
                "color": "#ffb300", 
                "background-color": "#181a1b", 
                "margin": "4px"
            },
            content: [
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
            ]
        },
        "Bars": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { "font-weight": "bold", "border": "2px solid #38ef7d", "color": "#38ef7d", "background-color": "#181a1b", "margin": "4px" },
            content: [
                ["bar", "plantProgress"],
                ["bar", "spawnProgress"],
                ["bar", "fieldCapacity"],
                ["bar", "xpProgress"],
                ["bar", "autoProgress"]
            ]
        },
        "Bars + Upgrades": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { 
                "font-weight": "bold", 
                "border": "2px solid #00f3ff", 
                "color": "#00f3ff", 
                "background-color": "#181a1b", 
                "margin": "4px"
            },
            content: [
                ["bar", "plantProgress"],
                ["bar", "spawnProgress"],
                ["bar", "fieldCapacity"],
                ["bar", "xpProgress"],
                ["bar", "autoProgress"],
                "blank",
                "upgrades"
            ]
        },
        "Upgrades": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { "font-weight": "bold", "border": "2px solid #3b82f6", "color": "#3b82f6", "background-color": "#181a1b", "margin": "4px" },
            content: [
                "upgrades"
            ]
        },
        "Main + Upgrades": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { 
                "font-weight": "bold", 
                "border": "2px solid #d630b8", 
                "color": "#d630b8", 
                "background-color": "#181a1b", 
                "margin": "4px"
            },
            content: [
                "main-display",
                "blank",
                "clickables", 
                "blank",
                "buyables",
                "blank",
                "upgrades"
            ]
        },
        "Everything": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { 
                "font-weight": "bold", 
                "border": "2px solid #ffffff", 
                "color": "#ffffff", 
                "background-color": "#181a1b", 
                "margin": "4px",
                "box-shadow": "0 0 10px rgba(255, 255, 255, 0.3)"
            },
            content: [
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
                "buyables",
                "blank",
                "upgrades"
            ]
        },
        "Nothing": {
            unlocked() { return hasUpgrade('pe', 73) },
            buttonStyle: { 
                "font-weight": "bold", 
                "border": "2px solid #222222", 
                "color": "#555555", 
                "background-color": "#111111", 
                "margin": "4px"
            },
            content: [
                "blank",
                ["display-text", "<span style='color: #444444; font-style: italic;'>There's nothing here. I wasn't kidding when I said that some tabs are useless.</span>"]
            ]
        }
    },
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
                let grassPerSec = new Decimal(0)
                if (hasUpgrade('pe', 31)) {
                    let m = new Decimal(hasUpgrade('pe', 11) ? 2 : 1)
                    let bEff = buyableEffect('p', 11);
                    if (!bEff || typeof bEff.add !== 'function') bEff = new Decimal(0)
                    
                    grassPerSec = bEff.add(1).mul(m)
                    if (hasUpgrade('pe', 113)) grassPerSec = grassPerSec.pow(1.5)
                }
                return `next plant: ${format(current)} / ${format(req)} grass (+${format(grassPerSec, 2)}/s)`
            }
        },
        spawnProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() { 
                let bEff = buyableEffect('p', 12);
                let effectNum = (bEff && typeof bEff.toNumber === 'function') ? bEff.toNumber() : 0;
                let spawnInterval = Math.max(0.1, 5.0 - effectNum)
                let hasPr11 = player.pr && player.pr.upgrades && (player.pr.upgrades.includes(11) || player.pr.upgrades.includes('11'));
                if (hasPr11) spawnInterval = Math.max(0.1, spawnInterval - 0.5)
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
                let bEff = buyableEffect('p', 12);
                let effectNum = (bEff && typeof bEff.toNumber === 'function') ? bEff.toNumber() : 0;
                let spawnInterval = Math.max(0.1, 5.0 - effectNum)
                let hasPr11 = player.pr && player.pr.upgrades && (player.pr.upgrades.includes(11) || player.pr.upgrades.includes('11'));
                if (hasPr11) spawnInterval = Math.max(0.1, spawnInterval - 0.5)
                let timeLeft = Math.max(0, spawnInterval - player.p.spawnTimer).toFixed(2)
                return `time until next grass: ${timeLeft}s (cooldown: ${spawnInterval.toFixed(2)}s)`
            }
        },
        fieldCapacity: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let maxSlots = player.p && player.p.grassField ? player.p.grassField.length : 9
                let occupied = 0
                for (let i = 0; i < maxSlots; i++) { if (player.p.grassField[i]) occupied++ }
                return occupied / maxSlots
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
                let maxSlots = player.p && player.p.grassField ? player.p.grassField.length : 9
                let occupied = 0
                for (let i = 0; i < maxSlots; i++) { if (player.p.grassField[i]) occupied++ }
                return `grass ready: ${occupied}/${maxSlots}`
            }
        },
        xpProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let xp = new Decimal(player.p.xp || 0)
                let xpNeeded = new Decimal(50).mul(new Decimal(1.2).pow(player.p.level || 0))
                return xp.div(xpNeeded).min(1).toNumber() 
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
                let currentLvl = new Decimal(player.p.level || 0)
                let xp = new Decimal(player.p.xp || 0)
                let xpNeeded = new Decimal(50).mul(new Decimal(1.2).pow(currentLvl))
                let xps = new Decimal(0)
                if (hasUpgrade('pe', 31)) {
                    let m = new Decimal(hasUpgrade('pe', 11) ? 2 : 1)
                    let grassPerTile = buyableEffect('p', 11).add(1).mul(m)
                    if (hasUpgrade('pe', 113)) grassPerTile = grassPerTile.pow(1.5)
                    let currentRoot = buyableEffect('p', 13)
                    if (!currentRoot || currentRoot.lte(0)) currentRoot = new Decimal(3)
                    xps = grassPerTile.pow(new Decimal(1).div(currentRoot))
                }
                return `xp: ${format(xp, 2)}/${format(xpNeeded, 2)} (+${format(xps, 2)} xp/s) [level ${format(currentLvl, 0)}]`
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
        11: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[0] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[0] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[0] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[0] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[0] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[0] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[0] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        12: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[1] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[1] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[1] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[1] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[1] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[1] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[1] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        13: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[2] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[2] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[2] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[2] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[2] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[2] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[2] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        14: { unlocked() { return player.pr && player.pr.upgrades && (player.pr.upgrades.includes(12) || player.pr.upgrades.includes('12')) }, display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = buyableEffect('p', 11); if (!g || typeof g.add !== 'function') g = new Decimal(0); g = g.add(1).mul(m); if (hasUpgrade('pe', 113)) g = g.pow(1.5); let prPts = (player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0); let prBoost = prPts.add(1).pow(1.001); g = g.mul(prBoost); let currentRoot = buyableEffect('p', 13) || new Decimal(3); let x = g.pow(new Decimal(1).div(currentRoot)); return (player.p && player.p.grassField && player.p.grassField[9]) ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p && player.p.grassField && player.p.grassField[9] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = buyableEffect('p', 11); if (!g || typeof g.add !== 'function') g = new Decimal(0); g = g.add(1).mul(m); if (hasUpgrade('pe', 113)) g = g.pow(1.5); let prPts = (player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0); let prBoost = prPts.add(1).pow(1.1); g = g.mul(prBoost); let currentRoot = buyableEffect('p', 13) || new Decimal(3); let x = g.pow(new Decimal(1).div(currentRoot)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[9] = false }, style() { let active = player.p && player.p.grassField && player.p.grassField[9]; return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: active ? "linear-gradient(to bottom, #00f3ff, #0083b0)" : "linear-gradient(135deg, #0f2026, #162a33)", border: active ? "2px solid #b3ffff" : "2px solid #005f73", boxShadow: active ? "0 0 20px rgba(0, 243, 255, 0.7), inset 0 0 10px rgba(255,255,255,0.4)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: active ? "pointer" : "default", color: active ? "#000000" : "#555", textShadow: active ? "0 1px 1px rgba(255,255,255,0.4)" : "none", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        21: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[3] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[3] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[3] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[3] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[3] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[3] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[3] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        22: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[4] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[4] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[4] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[4] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[4] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[4] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[4] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        23: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[5] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[5] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[5] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[5] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[5] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[5] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.7)", cursor: player.p.grassField[5] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        31: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[6] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[6] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[6] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[6] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[6] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[6] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[6] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        32: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[7] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[7] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[7] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[7] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[7] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[7] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[7] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } },
        33: { display() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); return player.p.grassField[8] ? "+" + format(g) + " grass<br>+" + format(x, 2) + " xp" : "" }, canClick() { return player.p.grassField[8] === true }, onClick() { let m = new Decimal(hasUpgrade('pe',11)?2:1); let g = layers.p.buyables[11].effect().add(1).mul(m); let x = g.pow(new Decimal(1).div(3)); player.points = player.points.add(g); player.p.xp = player.p.xp.add(x); player.p.grassField[8] = false }, style() { return { width: "100px", height: "100px", margin: "6px", borderRadius: "12px", background: player.p.grassField[8] ? "linear-gradient(to bottom, #38ef7d, #11998e)" : "linear-gradient(135deg, #2d1e10, #3d2b19)", border: player.p.grassField[8] ? "2px solid #a8ff78" : "2px solid #25180c", boxShadow: player.p.grassField[8] ? "0 0 15px rgba(56, 239, 125, 0.6), inset 0 0 10px rgba(255,255,255,0.3)" : "inset 0 0 12px rgba(0,0,0,0.8)", cursor: player.p.grassField[8] ? "pointer" : "default", color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.1s ease" } } }
    },
    buyables: {
        11: {
            title: "Grass from Plants",
            cost(x) { 
                if (x === undefined) x = getBuyableAmount(this.layer, this.id) || new Decimal(0)
                let safeX = new Decimal(x || 0)
                let baseCost = new Decimal(1).add(safeX.pow(1.5)).floor()
                if (hasUpgrade('pe', 71)) return baseCost.pow(new Decimal(1).div(1.5)).floor().max(1)
                return baseCost
            },
            effect() {
                let amount = getBuyableAmount('p', 11) || new Decimal(0)
                let safeAmt = new Decimal(amount)
                let baseEffect = safeAmt.mul(0.5)
                let milestones = safeAmt.div(25).floor()
                let multiplier = new Decimal(2).pow(milestones)
                return baseEffect.mul(multiplier)
            },
            display() {
                let amount = getBuyableAmount('p', 11) || new Decimal(0)
                let safeAmt = new Decimal(amount)
                let nextMilestone = safeAmt.div(25).floor().add(1).mul(25)
                let milestoneText = safeAmt.gte(25) ? `\n(multi from each 25 levels: x${format(new Decimal(2).pow(safeAmt.div(25).floor()), 0)})` : ""
                return "with plants, you make +50% more grass per level! \nevery 25 levels, the total boost is doubled!\n\n" +
                "boost: +" + format(this.effect().mul(100)) + "%" + milestoneText + "\n" +
                "cost: " + format(this.cost()) + " plants\n" +
                "level " + format(safeAmt, 0) + ", next doubling at level " + format(nextMilestone, 0)
            },
            canAfford() { return player[this.layer] && player[this.layer].points ? player[this.layer].points.gte(this.cost()) : false },
            buy() {
                let amount = getBuyableAmount(this.layer, this.id) || new Decimal(0)
                let points = player[this.layer].points
                if (!points || !points.gte(this.cost(amount))) return

                let bulk = new Decimal(0)
                let step = new Decimal(100000)
                
                while (step.gt(0)) {
                    while (true) {
                        let testAmt = amount.add(bulk).add(step)
                        let totalCost = this.cost(testAmt)
                        if (points.gte(totalCost)) {
                            bulk = bulk.add(step)
                        } else {
                            break
                        }
                    }
                    step = step.div(10).floor()
                }
                if (bulk.eq(0)) bulk = new Decimal(1)
                setBuyableAmount(this.layer, this.id, amount.add(bulk))
            },
            style() {
                let canBuy = this.canAfford()
                return {
                    width: "240px", height: "170px", borderRadius: "16px", padding: "12px",
                    background: canBuy ? "linear-gradient(135deg, #0a4d47, #1b6b3e)" : "linear-gradient(135deg, #121212, #1a1a1a)",
                    border: canBuy ? "3px solid #38ef7d" : "3px solid #262626", color: canBuy ? "#e0e0e0" : "#555555",
                    fontWeight: "bold", fontSize: "11px", fontFamily: "monospace", cursor: canBuy ? "pointer" : "default", whiteSpace: "pre-line"
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
                return new Decimal(amount || 0).mul(0.1)
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
                let safeAmt = new Decimal(amount || 0)
                let isMaxed = safeAmt.gte(49)
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
        13: {
            title: "Where did the ROOT go!",
            cost(x) { 
                if (x === undefined) x = getBuyableAmount('p', 13) || new Decimal(0)
                let safeX = new Decimal(x || 0)
                let baseCost = new Decimal(45).add(safeX)
                let reduction = new Decimal(0)
                
                if (hasUpgrade('pe', 91)) reduction = reduction.add(25)
                if (hasUpgrade('pe', 93)) reduction = reduction.add(50)
                if (hasUpgrade('pe', 111)) reduction = reduction.add(100)
                
                return baseCost.sub(reduction).floor().max(1)
            },
            display() {
                let amount = getBuyableAmount('p', 13) || new Decimal(0)
                let safeAmt = new Decimal(amount)
                let currentRoot = new Decimal(3).sub(safeAmt.mul(0.01)).max(1.00)
                let nextCost = this.cost(safeAmt)
                
                if (safeAmt.gte(200)) {
                    return `with plants, the xp/s is no longer a 3rd root! it's -0.01 per level.\n\nlevel: ${format(safeAmt, 0)} (max)\ncurrent root: √${format(currentRoot, 2)}\ncost: maxed`
                }
                return `with plants, the xp/s is no longer a 3rd root! it's -0.01 per level.\n\nlevel: ${format(safeAmt, 0)} / 200\ncurrent root: √${format(currentRoot, 2)}\ncost: ${format(nextCost)} plants`
            },
            canAfford() { return player.p && player.p.points ? player.p.points.gte(this.cost(getBuyableAmount('p', 13))) && (getBuyableAmount('p', 13) || 0) < 200 : false },
            buy() {
                let amount = getBuyableAmount('p', 13) || new Decimal(0)
                if (new Decimal(amount).gte(200)) return
                let points = player.p.points
                if (!points || !points.gte(this.cost(amount))) return

                let bulk = new Decimal(0)
                let step = new Decimal(1000)
                
                while (step.gt(0)) {
                    while (true) {
                        let testAmt = amount.add(bulk).add(step)
                        let totalCost = this.cost(testAmt)
                        if (points.gte(totalCost) && testAmt.lte(200)) {
                            bulk = bulk.add(step)
                        } else {
                            break
                        }
                    }
                    step = step.div(10).floor()
                }
                if (bulk.eq(0)) bulk = new Decimal(1)
                setBuyableAmount('p', 13, amount.add(bulk).min(200))
            },
            effect() {
                let amount = getBuyableAmount('p', 13) || new Decimal(0)
                let safeAmt = new Decimal(amount).min(200)
                return new Decimal(3).sub(safeAmt.mul(0.01)).max(1)
            },
            unlocked() { return hasUpgrade('p', 11) },
            style() {
                let amount = getBuyableAmount('p', 13) || new Decimal(0)
                let maxed = new Decimal(amount).gte(200)
                let canAff = this.canAfford() && !maxed
                return {
                    width: "240px", height: "170px", borderRadius: "16px", padding: "12px",
                    background: maxed ? "linear-gradient(135deg, #1e293b, #0f172a)" : (canAff ? "linear-gradient(135deg, #1d4ed8, #3b82f6)" : "#161616"),
                    border: maxed ? "3px solid #475569" : (canAff ? "3px solid #60a5fa" : "3px solid #2d2d2d"),
                    color: maxed ? "#94a3b8" : (canAff ? "#ffffff" : "#555555"),
                    fontFamily: "monospace", fontSize: "10px", cursor: canAff ? "pointer" : "default", fontWeight: "bold", whiteSpace: "pre-line"
                }
            }
        },
    },
    upgrades: {
        11: {
            title: "The Normal Regular",
            description: "Unlock... a buyable.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade('pe', 73) },
            style() {
                let hasUpg = hasUpgrade('p', 11)
                let canAfford = player.p.points.gte(50)
                return {
                    width: "200px",
                    height: "120px",
                    borderRadius: "14px",
                    padding: "10px",
                    background: hasUpg ? "linear-gradient(135deg, #400d0d, #661414)" : (canAfford ? "linear-gradient(135deg, #5c0f0f, #d81d1d)" : "#161616"),
                    border: hasUpg ? "3px solid #f63b3b" : (canAfford ? "3px solid #d81d1d" : "3px solid #333333"),
                    color: hasUpg ? "#fd9393" : (canAfford ? "#ffffff" : "#666666"),
                    boxShadow: hasUpg ? "0 0 15px rgba(246, 59, 59, 0.4)" : (canAfford ? "0 4px 12px rgba(216, 29, 216, 0.3)" : "none"),
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    cursor: (canAfford && !hasUpg) ? "pointer" : "default",
                    transition: "all 0.2s ease"
                }
            }
        }
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
            description: "You now get grass/s based on your grass per tile. Also, xp/s based on the cube root of grass.",
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
            cost: new Decimal(0),
            branches: ['53'],
            unlocked() { return hasUpgrade('pe', 33) }, 
            onPurchase() {
                player.f.points = player.f.points.add(50)
            },
            style() {
                let hasUpg = hasUpgrade('pe', 51)
                let canAfford = player.pe.points.gte(0)
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
            title: "This is interesting.",
            description: "1.5-root the cost of the Grass from Plants buyable.",
            cost: new Decimal(3),
            branches: ['73'],
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
        72: {
            unlocked() { return hasUpgrade('pe', 71) },
            style: {
                opacity: 0
            }
        },
        73: {
            title: "Tabs! I love tabs!",
            description: "Unlock some tabs, useless and useful.",
            cost: new Decimal(2),
            branches: [''],
            unlocked() { return hasUpgrade('pe', 71) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 73)
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
        73: {
            title: "Tabs! I love tabs!",
            description: "Unlock some tabs, useless and useful.",
            cost: new Decimal(2),
            branches: ['91'],
            unlocked() { return hasUpgrade('pe', 71) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 73)
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
        81: {
            unlocked() { return hasUpgrade('pe', 73) },
            style: {
                opacity: 0
            }
        },
        91: {
            title: "Acceptable Rooting",
            description: "The root decreasing buyable is 25 plants cheaper.",
            cost: new Decimal(5),
            branches: ['93'],
            unlocked() { return hasUpgrade('pe', 73) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 91)
                let canAfford = player.pe.points.gte(5)
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
        92: {
            unlocked() { return hasUpgrade('pe', 91) },
            style: {
                opacity: 0
            }
        },
        93: {
            title: "No! This isn't a problem at all!",
            description: "The root decreasing buyable is 50 plants cheaper.",
            cost: new Decimal(3),
            branches: ['111'],
            unlocked() { return hasUpgrade('pe', 91) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 93)
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
        101: {
            unlocked() { return hasUpgrade('pe', 93) },
            style: {
                opacity: 0
            }
        },
        111: {
            title: "Okay who the hell made this game that they decide- wait this is the title.",
            description: "The root decreasing buyable is 100 plants cheaper.",
            cost: new Decimal(4),
            branches: ['113'],
            unlocked() { return hasUpgrade('pe', 93) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 111)
                let canAfford = player.pe.points.gte(4)
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
        112: {
            unlocked() { return hasUpgrade('pe', 111) },
            style: {
                opacity: 0
            }
        },
        113: {
            title: "Half Squared",
            description: "^1.5 grass/s. Simple.",
            cost: new Decimal(7),
            branches: ['131'],
            unlocked() { return hasUpgrade('pe', 111) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 113)
                let canAfford = player.pe.points.gte(7)
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
        121: {
            unlocked() { return hasUpgrade('pe', 113) },
            style: {
                opacity: 0
            }
        },
        131: {
            title: "No.",
            description: "This upgrade is impossible",
            cost: new Decimal(1e9),
            branches: [''],
            unlocked() { return hasUpgrade('pe', 113) }, 
            style() {
                let hasUpg = hasUpgrade('pe', 131)
                let canAfford = player.pe.points.gte(1e9)
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

addLayer("pr", {
    name: "prestige", 
    symbol: "PR", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        tiers: new Decimal(0),
        tierGrassField: Array(9).fill(false),
        tierSpawnTimer: 0,
        tierAutoclaimTimer: 0,
        selectedTierStyle: -1
    }},
    nodeStyle: {
        background: "linear-gradient(135deg, #005f73, #00ffff, #0a9396)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(255, 255, 255, 0.4)",
        borderWidth: "3px",
        color: "rgb(0, 0, 0)",
        textShadow: "0px 1px 2px rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.6)"
    },
    color: "#00ffff", 
    requires: new Decimal(100),
    resource: "prestige points", 
    baseResource: "plants", 
    baseAmount() { return player.p.points },
    type: "custom",
    getResetGain() {
        if (!player || !player.p) return new Decimal(0)
        let lvl = new Decimal(player.p.level || 0)
        let n = player.points && typeof player.points.log10 === 'function' && player.points.gt(0) ? player.points.log10().floor() : new Decimal(0)
        
        let gain = new Decimal(9).mul(new Decimal(1.4).pow(lvl.div(10))).mul(new Decimal(1.15).pow(n))
        return gain.floor()
    },
    getNextAt(canGainMax = false) {
        return new Decimal(41)
    },
    getPrestigeFormula() {
        return "formula"
    },
    canReset() {
        if (!player || !player.p || player.p.level === undefined) return false
        return new Decimal(player.p.level || 0).gte(41)
    },
    layerShown() { 
        let safeLvl = player.p && player.p.level ? new Decimal(player.p.level) : new Decimal(0)
        let lvlGte41 = safeLvl.gte(41)
        let hasProgress = player.pr && (hasUpgrade('pr', 11) || new Decimal(player.pr.points || 0).gte(1))
        return lvlGte41 || hasProgress
    },
    onPrestige(gain) {
        if (gain.lte(0)) return
        player.pr.points = new Decimal(player.pr.points || 0).add(gain)
        player.pr.unlocked = true
        this.doReset("pr")
    },
    doReset(resettingLayer) {
        if (resettingLayer !== "pr") return
        player.points = new Decimal(0)
        if (player.p) {
            player.p.points = new Decimal(0)
            player.p.xp = new Decimal(0)
            player.p.level = new Decimal(0)
            player.p.spawnTimer = 0
            let maxSlots = (player.pr && player.pr.upgrades && (player.pr.upgrades.includes(12) || player.pr.upgrades.includes('12'))) ? 10 : 9
            player.p.grassField = Array(maxSlots).fill(false)
            player.p.buyables = { 11: new Decimal(0), 12: new Decimal(0), 13: new Decimal(0) }
            player.p.upgrades = []
        }
        if (player.pe) {
            player.pe.upgrades = []
            if (hasUpgrade('pr', 11)) {
                player.pe.upgrades.push(31, 33)
            }
            if (player.pe.buyables) player.pe.buyables = {}
            player.pe.points = new Decimal(0)
        }
    },
    row: 1,
    update(diff) {
        if (hasUpgrade('pr', 11) && player.pe && player.pe.upgrades) {
            if (!player.pe.upgrades.includes(31) && !player.pe.upgrades.includes('31')) player.pe.upgrades.push(31)
            if (!player.pe.upgrades.includes(33) && !player.pe.upgrades.includes('33')) player.pe.upgrades.push(33)
        }
        if (hasUpgrade('pr', 21) && player.pr && player.pr.tierGrassField) {
            player.pr.tierSpawnTimer += diff
            let currentTier = new Decimal(player.pr.tiers || 0)
            let spawnInterval = Math.max(1, 8.0 - currentTier.mul(0.5).toNumber())
            
            if (player.pr.tierSpawnTimer >= spawnInterval) {
                player.pr.tierSpawnTimer = 0
                let emptySlots = []
                for (let i = 0; i < 9; i++) {
                    if (player.pr.tierGrassField[i] === false) emptySlots.push(i)
                }
                if (emptySlots.length > 0) {
                    let randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)]
                    player.pr.tierGrassField[randomSlot] = true
                }
            }
        }
        if (hasUpgrade('pr', 21) && player.pr && player.pr.tierGrassField) {
            if (player.pr.tierAutoclaimTimer === undefined) player.pr.tierAutoclaimTimer = 0
            player.pr.tierAutoclaimTimer += diff
            if (player.pr.tierAutoclaimTimer >= 30) {
                player.pr.tierAutoclaimTimer = 0
                let occupiedCount = 0
                for (let i = 0; i < 9; i++) {
                    if (player.pr.tierGrassField[i] === true) {
                        occupiedCount++
                        player.pr.tierGrassField[i] = false
                    }
                }
                if (occupiedCount > 0) {
                    let currentTier = new Decimal(player.pr.tiers || 0)
                    let prGainPerTile = currentTier.add(1).pow(1.5)
                    player.pr.points = new Decimal(player.pr.points || 0).add(prGainPerTile.mul(occupiedCount))
                }
            }
        }
        if (player) {
            if (player.highestTier === undefined) player.highestTier = new Decimal(0)
            let curTier = new Decimal((player.pr && player.pr.tiers) || 0)
            if (curTier.gt(player.highestTier)) {
                player.highestTier = curTier
            }
        }
    },
    tabFormat: {
        "Main": {
            unlocked() { return true },
            buttonStyle: { "font-weight": "bold", "border": "2px solid #00ffff", "color": "#00ffff", "background-color": "#181a1b", "margin": "4px" },
            content: [
                "main-display",
                "blank",
                ["clickable", 100],
                "blank",
                "upgrades"
            ]
        },
        "Tier Grass": {
            unlocked() { return hasUpgrade('pr', 21) },
            buttonStyle: { "font-weight": "bold", "border": "2px solid #0a9396", "color": "#0a9396", "background-color": "#181a1b", "margin": "4px" },
            content: [
                "main-display",
                ["display-text", function() { 
                    return `You are currently at <h2 style='color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.5); display: inline;'>Tier ${format(player.pr.tiers, 0)}</h2>` 
                }],
                "blank",
                ["display-text", function() {
                    const grassNames = [
                        "Basic Grass", "Light Grass", "Copper Grass", "Tin Grass", "Bronze Grass",
                        "Silver Grass", "Gold Grass", "Diamond Grass", "White Crystal Grass", "Green Crystal Grass",
                        "Blue Crystal Grass", "Indigo Crystal Grass", "Purple Crystal Grass", "Pink Crystal Grass",
                        "Red Crystal Grass", "Orange Crystal Grass", "Yellow Crystal Grass", "Zebra Grass",
                        "Polka Dot Grass", "Checker Board Grass", "Triangle Grass", "Hexagon Grass",
                        "Fractal Grass", "Arrow Grass", "Puzzle Grass", "Grassman Grass",
                        "Plated Grass", "Template Grass", "Space White Grass", "Vibrant Grass",
                        "Neon Grass", "Void Grass", "Synthwave Grass", "Aurora Grass",
                        "Domino Grass", "Alphabet Grass", "Candy Cane Grass", "Snow Grass",
                        "Blocky Grass", "Festive Grass", "The Wall", "The Decelerated Wall",
                        "The Accelerated Wall", "The Recelerated Wall", "The Space Wall", "The Ice Wall",
                        "The Fire Wall", "The Nice Wall", "The Odd Wall", "The Stone Wall",
                        "The Red Star", "The Orange Star", "The Green Star", "The White Star",
                        "The Light Star", "The Blue Star", "The Purple Star", "The Final Star"
                    ]
                    let maxTier = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                    let curTier = player.pr.tiers ? Math.min(57, new Decimal(player.pr.tiers).toNumber()) : 0
                    let sel = player.pr.selectedTierStyle === undefined ? -1 : player.pr.selectedTierStyle
                    let activeStyle = (sel === -1 || sel > maxTier) ? curTier : sel
                    let modeText = sel === -1 ? "Auto" : `Tier ${sel}`
                    return `Active Grass Style: <b style='color: #00ffff;'>${grassNames[activeStyle]}</b> (${modeText})`
                }],
                "blank",
                ["row", [["clickable", 12], ["clickable", 13], ["clickable", 14]]],
                "blank",
                ["display-text", function() {
                    let tierCost = new Decimal(250).mul(new Decimal(2.5).pow(player.pr.tiers))
                    return `Next Tier: <b>${format(tierCost, 0)} prestige points</b>`
                }],
                "blank",
                ["clickable", 11],
                "blank",
                "hr",
                "blank",
                ["display-text", "<h3 style='color: #00ffff; text-shadow: 0 0 8px rgba(0,255,255,0.3);'>Tier Grass</h3><br>Woah! This grass gives prestige points and can be tiered up!"],
                "blank",
                ["bar", "tierSpawnProgress"],
                ["bar", "tierAutoclaimProgress"],
                ["row", [["clickable", 21], ["clickable", 22], ["clickable", 23]]],
                ["row", [["clickable", 24], ["clickable", 25], ["clickable", 26]]],
                ["row", [["clickable", 27], ["clickable", 28], ["clickable", 29]]],
                "blank"
            ]
        }
    },
    bars: {
        tierSpawnProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                let currentTier = new Decimal(player.pr.tiers || 0)
                let spawnInterval = Math.max(1, 8.0 - currentTier.mul(0.5).toNumber())
                return (player.pr.tierSpawnTimer || 0) / spawnInterval
            },
            fillStyle() { return { "background-color": "#00ffff" } },
            baseStyle() { return { "background-color": "#004d4d", "border": "1px solid rgba(255,255,255,0.2)" } },
            textStyle() { return { "color": "#000", "font-family": "monospace", "font-size": "10px", "font-weight": "bold" } },
            display() {
                let currentTier = new Decimal(player.pr.tiers || 0)
                let spawnInterval = Math.max(1, 8.0 - currentTier.mul(0.5).toNumber())
                let timeLeft = Math.max(0, spawnInterval - (player.pr.tierSpawnTimer || 0)).toFixed(2)
                return `next tier grass: ${timeLeft}s (cooldown: ${spawnInterval.toFixed(2)}s)`
            }
        },
        tierAutoclaimProgress: {
            direction: RIGHT,
            width: 600,
            height: 25,
            progress() {
                return (player.pr.tierAutoclaimTimer || 0) / 30
            },
            fillStyle() { return { "background-color": "#0a9396" } },
            baseStyle() { return { "background-color": "#053f40", "border": "1px solid rgba(255,255,255,0.2)" } },
            textStyle() { return { "color": "#000", "font-family": "monospace", "font-size": "10px", "font-weight": "bold" } },
            display() {
                let timeLeft = Math.max(0, 30 - (player.pr.tierAutoclaimTimer || 0)).toFixed(1)
                return `auto claim in: ${timeLeft}s (cooldown: 30s)`
            }
        }
    },
    clickables: {
        100: {
            title: "",
            display() {
                if (!player || !player.p) return "loading..."
                let currentLvl = new Decimal(player.p.level || 0)
                let gain = layers.pr.getResetGain()
                let n = player.points && typeof player.points.gt === 'function' && player.points.gt(0) ? player.points.log10().floor() : new Decimal(0)
                let levelEffect = new Decimal(9).mul(new Decimal(1.4).pow(currentLvl.div(10)))
                let grassEffect = new Decimal(1.15).pow(n)

                if (!layers.pr.canReset()) {
                    return `Reset for <b>+${format(gain, 0)}</b> prestige points<br><br>` +
                           `<span style='color: #ff4d4d; font-weight: bold;'>Requires Level 41 (currently level ${format(currentLvl, 0)})</span><br><br>` +
                           `<span style='font-size: 11px; color: #155353;'>` +
                           `Base Gain from Levels: <br> <b>+${format(levelEffect, 1)}</b><br>` +
                           `Multiplier from Grass: <br><b>x${format(grassEffect, 2)}</b>` +
                           `</span>`
                }

                return `Reset for <b>+${format(gain, 0)}</b> prestige points<br><br>` +
                       `<span style='font-size: 11px; color: #155353;'>` +
                       `Base Gain from Levels: <br> <b>+${format(levelEffect, 1)}</b><br>` +
                       `Multiplier from Grass: <br><b>x${format(grassEffect, 2)}</b>` +
                       `</span>`
            },
            canClick() {
                return layers.pr.canReset()
            },
            onClick() {
                let gain = layers.pr.getResetGain()
                if (gain.lte(0)) return
                layers.pr.onPrestige(gain)
            },
            style() {
                let canBuy = this.canClick()
                return {
                    width: "320px",
                    minHeight: "140px",
                    borderRadius: "26px",
                    padding: "16px",
                    background: canBuy ? "linear-gradient(135deg, #00ffff, #00bcbc)" : "#222222",
                    border: canBuy ? "4px solid #ffffff" : "4px solid #333333",
                    color: canBuy ? "#000000" : "#666666",
                    fontWeight: "bold",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    cursor: canBuy ? "pointer" : "default",
                    boxShadow: canBuy ? "0 0 25px rgba(0, 255, 255, 0.6)" : "none",
                    transition: "all 0.15s ease-out"
                }
            }
        },
        11: {
            title: "Tier Up",
            display() {
                let tierCost = new Decimal(250).mul(new Decimal(2.5).pow(player.pr.tiers))
                return player.pr.points.gte(tierCost) ? "You can tier up!" : "Not enough prestige points"
            },
            canClick() {
                let tierCost = new Decimal(250).mul(new Decimal(2.5).pow(player.pr.tiers))
                return player.pr.points.gte(tierCost)
            },
            onClick() {
                let tierCost = new Decimal(250).mul(new Decimal(2.5).pow(player.pr.tiers))
                player.pr.points = player.pr.points.sub(tierCost)
                player.pr.tiers = player.pr.tiers.add(1)
            },
            style() {
                let canCl = this.canClick()
                return {
                    width: "200px", height: "50px", borderRadius: "8px", fontWeight: "bold",
                    background: canCl ? "linear-gradient(135deg, #0a9396, #00ffff)" : "#222",
                    border: canCl ? "2px solid #fff" : "2px solid #333",
                    color: canCl ? "#000" : "#666",
                    cursor: canCl ? "pointer" : "default"
                }
            }
        },
        12: {
            title: "<",
            canClick() {
                let maxTier = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                return maxTier > 0
            },
            onClick() {
                let maxTier = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                let curTier = player.pr.tiers ? Math.min(57, new Decimal(player.pr.tiers).toNumber()) : 0
                let cur = (player.pr.selectedTierStyle === undefined || player.pr.selectedTierStyle === -1) ? curTier : player.pr.selectedTierStyle
                player.pr.selectedTierStyle = cur <= 0 ? maxTier : cur - 1
            },
            style() {
                return {
                    width: "100px", height: "35px", margin: "4px", borderRadius: "8px",
                    background: this.canClick() ? "#0a9396" : "#222", color: this.canClick() ? "#000" : "#555",
                    border: "1px solid #00ffff", fontWeight: "bold", fontSize: "11px", cursor: this.canClick() ? "pointer" : "default"
                }
            }
        },
        13: {
            title: "Auto",
            canClick() { return player.pr.selectedTierStyle !== -1 },
            onClick() { player.pr.selectedTierStyle = -1 },
            style() {
                let isAuto = player.pr.selectedTierStyle === undefined || player.pr.selectedTierStyle === -1
                return {
                    width: "110px", height: "35px", margin: "4px", borderRadius: "8px",
                    background: isAuto ? "#00ffff" : "#181a1b", color: isAuto ? "#000" : "#00ffff",
                    border: "1px solid #00ffff", fontWeight: "bold", fontSize: "11px", cursor: isAuto ? "default" : "pointer"
                }
            }
        },
        14: {
            title: ">",
            canClick() {
                let maxTier = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                return maxTier > 0
            },
            onClick() {
                let maxTier = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                let curTier = player.pr.tiers ? Math.min(57, new Decimal(player.pr.tiers).toNumber()) : 0
                let cur = (player.pr.selectedTierStyle === undefined || player.pr.selectedTierStyle === -1) ? curTier : player.pr.selectedTierStyle
                player.pr.selectedTierStyle = cur >= maxTier ? 0 : cur + 1
            },
            style() {
                return {
                    width: "100px", height: "35px", margin: "4px", borderRadius: "8px",
                    background: this.canClick() ? "#0a9396" : "#222", color: this.canClick() ? "#000" : "#555",
                    border: "1px solid #00ffff", fontWeight: "bold", fontSize: "11px", cursor: this.canClick() ? "pointer" : "default"
                }
            }
        },
        ...(() => {
            const tierColors = [
                "#5a984b", "#b4d192", "#d58b30", "#b5b5b5", "#cda85d",
                "#cfe2ef", "#f0dd4d", "#c4eff3", "#f5f5f5", "#7bfa5e",
                "#5cd6ee", "#5d52f9", "#ac4df9", "#df5cdf", "#e20000",
                "#fa8900", "#f0f000"
            ]
            const grassNames = [
                "Basic Grass", "Light Grass", "Copper Grass", "Tin Grass", "Bronze Grass",
                "Silver Grass", "Gold Grass", "Diamond Grass", "White Crystal Grass", "Green Crystal Grass",
                "Blue Crystal Grass", "Indigo Crystal Grass", "Purple Crystal Grass", "Pink Crystal Grass",
                "Red Crystal Grass", "Orange Crystal Grass", "Yellow Crystal Grass", "Zebra Grass",
                "Polka Dot Grass", "Checker Board Grass", "Triangle Grass", "Hexagon Grass",
                "Fractal Grass", "Arrow Grass", "Puzzle Grass", "Grassman Grass",
                "Plated Grass", "Template Grass", "Space White Grass", "Vibrant Grass",
                "Neon Grass", "Void Grass", "Synthwave Grass", "Aurora Grass",
                "Domino Grass", "Alphabet Grass", "Candy Cane Grass", "Snow Grass",
                "Blocky Grass", "Festive Grass", "The Wall", "The Decelerated Wall",
                "The Accelerated Wall", "The Recelerated Wall", "The Space Wall", "The Ice Wall",
                "The Fire Wall", "The Nice Wall", "The Odd Wall", "The Stone Wall",
                "The Red Star", "The Orange Star", "The Green Star", "The White Star",
                "The Light Star", "The Blue Star", "The Purple Star", "The Final Star"
            ]
            const brickPattern = (mortar) => 
                `linear-gradient(335deg, ${mortar} 2px, transparent 2px) 0 0 / 32px 24px, ` +
                `linear-gradient(155deg, ${mortar} 2px, transparent 2px) 16px 12px / 32px 24px, ` +
                `repeating-linear-gradient(0deg, ${mortar} 0px, ${mortar} 2px, transparent 2px, transparent 12px)`

            let cells = {}
            for (let i = 1; i <= 9; i++) {
                let idx = i - 1
                cells[20 + i] = {
                    unlocked() { return hasUpgrade('pr', 21) },
                    display() {
                        if (!player.pr || !player.pr.tierGrassField) return ""
                        let currentTier = new Decimal(player.pr.tiers || 0).min(57)
                        let maxVisual = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                        let curVisual = currentTier.toNumber()
                        let sel = player.pr.selectedTierStyle === undefined ? -1 : player.pr.selectedTierStyle
                        let tierIdx = (sel === -1 || sel > maxVisual) ? curVisual : sel
                        let prGain = currentTier.add(1).pow(1.5)
                        return player.pr.tierGrassField[idx] ? `<span style='font-size: 9px;'>${grassNames[tierIdx]}</span><br>+${format(prGain, 1)}<br>Prestige Points` : ""
                    },
                    canClick() { return player.pr && player.pr.tierGrassField && player.pr.tierGrassField[idx] === true },
                    onClick() {
                        let currentTier = new Decimal(player.pr.tiers || 0).min(57)
                        let prGain = currentTier.add(1).pow(1.5)
                        player.pr.points = player.pr.points.add(prGain)
                        player.pr.tierGrassField[idx] = false
                    },
                    style() {
                        if (!player.pr || !player.pr.tierGrassField) return {}
                        let active = player.pr.tierGrassField[idx]
                        let maxVisual = player.highestTier ? Math.min(57, new Decimal(player.highestTier).toNumber()) : 0
                        let curVisual = player.pr.tiers ? Math.min(57, new Decimal(player.pr.tiers).toNumber()) : 0
                        let sel = player.pr.selectedTierStyle === undefined ? -1 : player.pr.selectedTierStyle
                        let tier = (sel === -1 || sel > maxVisual) ? curVisual : sel
                        
                        let activeBg = "#111", activeBorder = "#333", glowColor = "transparent"
                        let textColor = "#fff", textShadow = "0 1px 3px rgba(0,0,0,0.9)"

                        if (active) {
                            if (tier < 17) {
                                activeBg = tierColors[tier]; activeBorder = tierColors[tier]; glowColor = tierColors[tier]
                            } else if (tier === 17) {
                                activeBg = "repeating-linear-gradient(to bottom, #ffffff 0%, #ffffff 20%, #000000 20%, #000000 40%)"
                                activeBorder = "#ffffff"; glowColor = "#ffffff"; textColor = "#00ffff"
                                textShadow = "0 0 4px #000, 0 0 4px #000, 1px 1px 2px #000"
                            } else if (tier === 18) {
                                activeBg = "radial-gradient(#2ee69b 28%, transparent 30%) 0 0 / 22px 22px, radial-gradient(#2ee69b 28%, transparent 30%) 11px 11px / 22px 22px, #d61a4c"
                                activeBorder = "#2ee69b"; glowColor = "#d61a4c"
                            } else if (tier === 19) {
                                activeBg = "linear-gradient(45deg, #5a189a 25%, transparent 25%), linear-gradient(-45deg, #5a189a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #5a189a 75%), linear-gradient(-45deg, transparent 75%, #5a189a 75%), #0077b6 center / 24px 24px"
                                activeBorder = "#5a189a"; glowColor = "#0077b6"
                            } else if (tier === 20) {
                                activeBg = "linear-gradient(120deg, #98a2d7 25%, transparent 25%) 0 0 / 22px 22px, linear-gradient(240deg, #98a2d7 25%, transparent 25%) 0 0 / 22px 22px, #bfe3d7"
                                activeBorder = "#98a2d7"; glowColor = "#bfe3d7"; textColor = "#000000"; textShadow = "none"
                            } else if (tier === 21) {
                                activeBg = "repeating-linear-gradient(60deg, #ffea00 0px, #ffea00 8px, #f5b700 8px, #f5b700 16px), repeating-linear-gradient(-60deg, #ffea00 0px, #ffea00 8px, #e69500 8px, #e69500 16px)"
                                activeBorder = "#ffaa00"; glowColor = "#ffea00"; textColor = "#000000"; textShadow = "none"
                            } else if (tier === 22) {
                                activeBg = "radial-gradient(circle at 50% 50%, #00d2ff 25%, #007799 26%, #007799 35%, #c74cff 36%, #c74cff 52%, #ff007f 53%, #ff007f 65%, #00f3ff 66%)"
                                activeBorder = "#00f3ff"; glowColor = "#ff007f"
                            } else if (tier === 23) {
                                activeBg = "repeating-linear-gradient(90deg, #888888 0px, #888888 18px, #ffffff 18px, #ffffff 24px), repeating-linear-gradient(0deg, transparent 0px, transparent 14px, #555555 14px, #555555 16px)"
                                activeBorder = "#ffffff"; glowColor = "#cccccc"
                            } else if (tier === 24) {
                                activeBg = "repeating-linear-gradient(0deg, #444 0px, #444 3px, transparent 3px, transparent 22px), repeating-linear-gradient(90deg, #444 0px, #444 3px, transparent 3px, transparent 22px), radial-gradient(circle at 75% 75%, #ffcc00 4px, transparent 5px), radial-gradient(circle at 25% 80%, #ffcc00 4px, transparent 5px), radial-gradient(circle at 60% 20%, #3b82f6 4px, transparent 5px), #666666"
                                activeBorder = "#ffcc00"; glowColor = "#444444"; textColor = "#ffcc00"
                            } else if (tier === 25) {
                                activeBg = "radial-gradient(circle at 38% 45%, #000 3px, transparent 4px), radial-gradient(circle at 62% 45%, #000 3px, transparent 4px), linear-gradient(to bottom, #2e7d32 0%, #2e7d32 30%, #4caf50 30%, #4caf50 75%, #81c784 75%)"
                                activeBorder = "#2e7d32"; glowColor = "#4caf50"; textColor = "#000000"; textShadow = "none"
                            } else if (tier === 26) {
                                activeBg = "linear-gradient(to right, #888 0%, #777 50%, #999 100%)"
                                activeBorder = "#444444"; glowColor = "#777777"
                            } else if (tier === 27) {
                                activeBg = "linear-gradient(to right, #ff0000 0%, #ff0000 20%, #ffff00 20%, #ffff00 40%, #00ff00 40%, #00ff00 60%, #0000ff 60%, #0000ff 80%, #ff00ff 80%, #ff00ff 100%)"
                                activeBorder = "#ffffff"; glowColor = "#ffff00"; textColor = "#000000"; textShadow = "0 1px 1px rgba(255,255,255,0.6)"
                            } else if (tier === 28) {
                                activeBg = "radial-gradient(#ffffff 1px, transparent 2px) 4px 6px / 23px 23px, radial-gradient(#a5b4fc 1.5px, transparent 2.5px) 15px 17px / 31px 31px, #140c28"
                                activeBorder = "#a5b4fc"; glowColor = "#4c1d95"
                            } else if (tier === 29) {
                                activeBg = "radial-gradient(circle at 30% 35%, #d9ffd9 0%, #7aff7a 40%, #98ff98 100%)"
                                activeBorder = "#b3ffb3"; glowColor = "#7aff7a"; textColor = "#003300"; textShadow = "none"
                            } else if (tier === 30) {
                                activeBg = "linear-gradient(to bottom, #ff4df0 0%, #38f3ff 50%, #ff4df0 100%)"
                                activeBorder = "#ff4df0"; glowColor = "#38f3ff"; textColor = "#000000"; textShadow = "0 1px 2px rgba(255,255,255,0.7)"
                            } else if (tier === 31) {
                                activeBg = "repeating-linear-gradient(0deg, #4c1d95 0px, #4c1d95 2px, transparent 2px, transparent 18px), repeating-linear-gradient(90deg, #4c1d95 0px, #4c1d95 2px, transparent 2px, transparent 18px), #6d28d9"
                                activeBorder = "#8b5cf6"; glowColor = "#6d28d9"
                            } else if (tier === 32) {
                                activeBg = "repeating-linear-gradient(0deg, transparent 0px, transparent 10px, #ff00ff 10px, #ff00ff 12px) 0 60% / 100% 40% no-repeat, repeating-linear-gradient(90deg, transparent 0px, transparent 12px, #ff00ff 12px, #ff00ff 14px) 0 60% / 100% 40% no-repeat, radial-gradient(circle at 50% 35%, #ffea00 0%, #ff007f 35%, transparent 36%), linear-gradient(to bottom, #1e0536 0%, #4a0e78 58%, #090212 58%)"
                                activeBorder = "#ff00ff"; glowColor = "#ff007f"
                            } else if (tier === 33) {
                                activeBg = "radial-gradient(#ffffff 1px, transparent 2px) 7px 9px / 25px 25px, linear-gradient(to bottom, #2e1065 0%, #1d4ed8 55%, #10b981 100%)"
                                activeBorder = "#34d399"; glowColor = "#10b981"
                            } else if (tier === 34) {
                                activeBg = "radial-gradient(circle at 24% 24%, #000 7px, transparent 8px), radial-gradient(circle at 76% 24%, #000 7px, transparent 8px), radial-gradient(circle at 50% 50%, #000 7px, transparent 8px), radial-gradient(circle at 24% 76%, #000 7px, transparent 8px), radial-gradient(circle at 76% 76%, #000 7px, transparent 8px), #ffffff"
                                activeBorder = "#000000"; glowColor = "#ffffff"; textColor = "#00ffff"; textShadow = "0 0 4px #000, 1px 1px 2px #000"
                            } else if (tier === 35) {
                                activeBg = "repeating-linear-gradient(0deg, #7f1d1d 0px, #7f1d1d 2px, transparent 2px, transparent 18px), repeating-linear-gradient(90deg, #7f1d1d 0px, #7f1d1d 2px, transparent 2px, transparent 18px), conic-gradient(from 45deg, #eab308 25%, #dc2626 25% 50%, #2563eb 50% 75%, #16a34a 75%) 0 0 / 36px 36px"
                                activeBorder = "#eab308"; glowColor = "#dc2626"
                            } else if (tier === 36) {
                                activeBg = "repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 12px, #ff4d4d 12px, #ff4d4d 24px)"
                                activeBorder = "#ff4d4d"; glowColor = "#ffffff"; textColor = "#000000"; textShadow = "0 1px 2px #fff"
                            } else if (tier === 37) {
                                activeBg = "radial-gradient(#ffffff 2px, transparent 3px) 5px 5px / 20px 20px, radial-gradient(#e0f7fa 3px, transparent 4px) 14px 12px / 28px 28px, linear-gradient(to bottom, #7dd3fc, #00d2ff)"
                                activeBorder = "#ffffff"; glowColor = "#38bdf8"; textColor = "#002b36"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 38) {
                                activeBg = "repeating-linear-gradient(0deg, #002266 0px, #002266 2px, transparent 2px, transparent 18px), repeating-linear-gradient(90deg, #002266 0px, #002266 2px, transparent 2px, transparent 18px), radial-gradient(circle at 50% 50%, #3b82f6, #1d4ed8) 0 0 / 18px 18px"
                                activeBorder = "#60a5fa"; glowColor = "#2563eb"
                            } else if (tier === 39) {
                                activeBg = "repeating-linear-gradient(to bottom, #00e600 0px, #00e600 18px, #008000 18px, #008000 20px, #ff0000 20px, #ff0000 26px, #800000 26px, #800000 28px)"
                                activeBorder = "#ff0000"; glowColor = "#00e600"
                            } else if (tier === 40) {
                                activeBg = `${brickPattern("#ffffff")}, #f27474`
                                activeBorder = "#ffffff"; glowColor = "#f27474"
                            } else if (tier === 41) {
                                activeBg = `${brickPattern("#001f7a")}, #0044ff`
                                activeBorder = "#3b82f6"; glowColor = "#0044ff"
                            } else if (tier === 42) {
                                activeBg = `${brickPattern("#7a0000")}, #ff1a1a`
                                activeBorder = "#ff6666"; glowColor = "#ff1a1a"
                            } else if (tier === 43) {
                                activeBg = `${brickPattern("#658c00")}, #ccff33`
                                activeBorder = "#e6ff99"; glowColor = "#ccff33"; textColor = "#1a2600"; textShadow = "none"
                            } else if (tier === 44) {
                                activeBg = `radial-gradient(#ffffff 1px, transparent 2px) 6px 8px / 22px 22px, ${brickPattern("#22073d")}, #3b0d66`
                                activeBorder = "#a855f7"; glowColor = "#6b21a8"
                            } else if (tier === 45) {
                                activeBg = `${brickPattern("#5ce1e6")}, #a6f7fa`
                                activeBorder = "#ffffff"; glowColor = "#5ce1e6"; textColor = "#003336"; textShadow = "none"
                            } else if (tier === 46) {
                                activeBg = `${brickPattern("#7a1c00")}, linear-gradient(to bottom, #ff1a00 0%, #ff8c00 50%, #ffea00 100%)`
                                activeBorder = "#ff8c00"; glowColor = "#ff4500"; textColor = "#000000"; textShadow = "0 1px 1px rgba(255,255,255,0.6)"
                            } else if (tier === 47) {
                                activeBg = `${brickPattern("#e85dff")}, #ff99ff`
                                activeBorder = "#ffffff"; glowColor = "#ff66ff"; textColor = "#330033"; textShadow = "none"
                            } else if (tier === 48) {
                                activeBg = `${brickPattern("#004d33")}, linear-gradient(135deg, #00ff66 0%, #00ccff 50%, #00ff66 100%)`
                                activeBorder = "#00ffcc"; glowColor = "#00ff99"; textColor = "#00261a"; textShadow = "none"
                            } else if (tier === 49) {
                                activeBg = `${brickPattern("#222222")}, #666666`
                                activeBorder = "#999999"; glowColor = "#444444"
                            } else if (tier === 50) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffffff 0%, #ff9999 35%, #ff3333 100%)"
                                activeBorder = "#ff6666"; glowColor = "#ff3333"; textColor = "#4d0000"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 51) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffff99 0%, #ffea00 45%, #ff9900 100%)"
                                activeBorder = "#ffea00"; glowColor = "#ffaa00"; textColor = "#4d2600"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 52) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffffaa 0%, #aaff33 45%, #55cc00 100%)"
                                activeBorder = "#ccff66"; glowColor = "#77ee00"; textColor = "#1a3300"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 53) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffffff 15%, #e5e5e5 60%, #b3b3b3 100%)"
                                activeBorder = "#ffffff"; glowColor = "#ffffff"; textColor = "#111111"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 54) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffffff 20%, #d9ffff 55%, #99e6e6 100%)"
                                activeBorder = "#e0ffff"; glowColor = "#aaffff"; textColor = "#003333"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 55) {
                                activeBg = "radial-gradient(circle at 50% 50%, #99f3ff 0%, #33ccff 50%, #0077ff 100%)"
                                activeBorder = "#66d9ff"; glowColor = "#0099ff"; textColor = "#001a33"; textShadow = "0 1px 1px #fff"
                            } else if (tier === 56) {
                                activeBg = "radial-gradient(circle at 50% 50%, #ffb3ff 0%, #cc33ff 50%, #6600cc 100%)"
                                activeBorder = "#e680ff"; glowColor = "#9900ff"
                            } else if (tier >= 57) {
                                activeBg = "conic-gradient(from 0deg at 50% 50%, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000)"
                                activeBorder = "#ffffff"; glowColor = "#ffffff"; textColor = "#000000"; textShadow = "0 0 4px #fff, 0 0 4px #fff"
                            }
                        }

                        return {
                            width: "90px", height: "90px", margin: "5px", borderRadius: "14px",
                            background: active ? activeBg : "linear-gradient(135deg, #111e21, #17292e)",
                            border: active ? `2px solid ${activeBorder}` : "2px solid #23393d",
                            boxShadow: active ? `0 0 15px ${glowColor}, inset 0 0 8px rgba(255,255,255,0.25)` : "inset 0 0 10px rgba(0,0,0,0.7)",
                            cursor: active ? "pointer" : "default",
                            color: active ? textColor : "#555",
                            textShadow: active ? textShadow : "none",
                            fontWeight: "bold", fontSize: "11px",
                            display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                            transition: "all 0.15s ease"
                        }
                    }
                }
            }
            return cells
        })()
    },
    upgrades: {
        11: {
            title: "Automation. I love automation.",
            description: "Keep the two perk upgrades that automate on Prestige. (save 3 perks!) Also, -0.5s spawn time.",
            cost: new Decimal(10),
            style() {
                let hasUpg = hasUpgrade('pr', 11)
                let prPoints = (player && player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0)
                let canAfford = prPoints.gte(10) && !hasUpg
                return {
                    width: "200px", height: "120px", borderRadius: "14px", padding: "10px", fontFamily: "monospace", fontSize: "11px", fontWeight: "bold",
                    background: hasUpg ? "linear-gradient(135deg, #002d3a, #005f73)" : (canAfford ? "linear-gradient(135deg, #0083b0, #00ffff)" : "#161616"),
                    border: hasUpg ? "3px solid #00ffff" : (canAfford ? "3px solid #00ffff" : "3px solid #333333"),
                    color: hasUpg ? "#b3ffff" : (canAfford ? "#000000" : "#666666"),
                    cursor: canAfford ? "pointer" : "default"
                }
            }
        },
        12: {
            title: "One More",
            description: "Unlock the 10th grass slot.",
            cost: new Decimal(100),
            style() {
                let hasUpg = hasUpgrade('pr', 12)
                let prPoints = (player && player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0)
                let canAfford = prPoints.gte(100) && !hasUpg
                return {
                    width: "200px", height: "120px", borderRadius: "14px", padding: "10px", fontFamily: "monospace", fontSize: "11px", fontWeight: "bold",
                    background: hasUpg ? "linear-gradient(135deg, #002d3a, #005f73)" : (canAfford ? "linear-gradient(135deg, #0083b0, #00ffff)" : "#161616"),
                    border: hasUpg ? "3px solid #00ffff" : (canAfford ? "3px solid #00ffff" : "3px solid #333333"),
                    color: hasUpg ? "#b3ffff" : (canAfford ? "#000000" : "#666666"),
                    cursor: canAfford ? "pointer" : "default"
                }
            }
        },
        13: {
            title: "Fresh",
            description: "Unlock Flowers. Also requires the free perk upgrade.",
            cost: new Decimal(999999999),
            style() {
                let hasUpg = hasUpgrade('pr', 13)
                let prPoints = (player && player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0)
                let canAfford = prPoints.gte(999999999) && !hasUpg
                return {
                    width: "200px", height: "120px", borderRadius: "14px", padding: "10px", fontFamily: "monospace", fontSize: "11px", fontWeight: "bold",
                    background: hasUpg ? "linear-gradient(135deg, #002d3a, #005f73)" : (canAfford ? "linear-gradient(135deg, #0083b0, #00ffff)" : "#161616"),
                    border: hasUpg ? "3px solid #00ffff" : (canAfford ? "3px solid #00ffff" : "3px solid #333333"),
                    color: hasUpg ? "#b3ffff" : (canAfford ? "#000000" : "#666666"),
                    cursor: canAfford ? "pointer" : "default"
                }
            }
        },
        21: {
            title: "Tiers! How fun...",
            description: "Unlock Tiers, where you can... tier up. Wait a minute.",
            cost: new Decimal(250),
            style() {
                let hasUpg = hasUpgrade('pr', 21)
                let prPoints = (player && player.pr && player.pr.points) ? new Decimal(player.pr.points) : new Decimal(0)
                let canAfford = prPoints.gte(250) && !hasUpg
                return {
                    width: "200px", height: "120px", borderRadius: "14px", padding: "10px", fontFamily: "monospace", fontSize: "11px", fontWeight: "bold",
                    background: hasUpg ? "linear-gradient(135deg, #002d3a, #005f73)" : (canAfford ? "linear-gradient(135deg, #0083b0, #00ffff)" : "#161616"),
                    border: hasUpg ? "3px solid #00ffff" : (canAfford ? "3px solid #00ffff" : "3px solid #333333"),
                    color: hasUpg ? "#b3ffff" : (canAfford ? "#000000" : "#666666"),
                    cursor: canAfford ? "pointer" : "default"
                }
            }
        }
    }
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
    layerShown() { return hasUpgrade('pr',13) && hasUpgrade('pe',51) },
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

addLayer("sb", {
    name: "savebank",
    symbol: "SB",
    position: 1,
    row: "side",
    color: "#38ef7d",
    nodeStyle: {
        background: "linear-gradient(135deg, #064e3b, #10b981, #fbbf24)",
        backgroundOrigin: "border-box",
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: "2px",
        color: "#000000",
        textShadow: "0px 1px 2px rgba(255, 255, 255, 0.7)",
        boxShadow: "0 0 12px rgba(16, 185, 129, 0.6)"
    },
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    tooltip() { return "Savebank" },
    tabFormat: [
        ["display-text", "<h2>Savebank</h2><br>Click a save below to load that backup.<br>If when loading a save it says 'This save appears to be from a different mod!' it's completely normal.<br>This just means the save was made before a data wipe.<br><span style='color: #ff4d4d; font-size: 11px;'>Warning: Loading a save will overwrite your current progress! Export your save first if you want to keep it.</span>"],
        "blank",
        "hr",
        "blank",

        ["display-text", "<h3 style='color: #38ef7d; text-shadow: 0 0 8px rgba(56, 239, 125, 0.4);'>Pre-Prestige</h3>"],
        "blank",
        ["clickables", '1'],
        "blank",
        "hr",
        "blank",

        ["display-text", "<h3 style='color: #00ffff; text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);'>Prestige</h3>"],
        "blank",
        ["clickables", '2'],
        "blank",
        "hr",
        "blank",

        ["display-text", "<h3 style='color: #fda4af; text-shadow: 0 0 8px rgba(253, 164, 175, 0.4);'>Flowers (Coming Soon)</h3>"],
        "blank"
    ],
    clickables: {
        11: {
            title: "The Start",
            display() { return "Level 0, 0 plants" },
            canClick() { return true },
            onClick() {
                let saveStr = "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5NDEyODQ1MzE3MCwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJzYXZlIGdvdCBudWtlZCIsInZlcnNpb24iOiIxLjAwIiwidGltZVBsYXllZCI6MjUuNTkxOTk5OTk5OTk5OTg4LCJrZWVwR29pbmciOmZhbHNlLCJoYXNOYU4iOmZhbHNlLCJwb2ludHMiOiIwIiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fSwicCI6eyJtYWluVGFicyI6IkZpcnN0In0sInByIjp7Im1haW5UYWJzIjoiTWFpbiJ9fSwibGFzdFNhZmVUYWIiOiJub25lIiwiaGlnaGVzdFRpZXIiOiIwIiwiaW5mb2JveGVzIjp7fSwiaW5mby10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoyNS41OTE5OTk5OTk5OTk5ODgsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwib3B0aW9ucy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoyNS41OTE5OTk5OTk5OTk5ODgsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiY2hhbmdlbG9nLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJibGFuayI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ0cmVlLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJwIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwiZ3Jhc3NGaWVsZCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLHRydWUsdHJ1ZSx0cnVlLHRydWVdLCJzcGF3blRpbWVyIjo0LjE5Nzk5OTk5OTk5OTk5OSwiYXV0b1RpbWVyIjowLCJ4cCI6IjAiLCJsZXZlbCI6IjAiLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MjUuNTkxOTk5OTk5OTk5OTg4LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6eyIxMSI6IjAiLCIxMiI6IjAiLCIxMyI6IjAifSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIxNCI6IiIsIjIxIjoiIiwiMjIiOiIiLCIyMyI6IiIsIjMxIjoiIiwiMzIiOiIiLCIzMyI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInBlIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJwciI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRpZXJzIjoiMCIsInRpZXJHcmFzc0ZpZWxkIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdLCJ0aWVyU3Bhd25UaW1lciI6MCwidGllckF1dG9jbGFpbVRpbWVyIjowLCJzZWxlY3RlZFRpZXJTdHlsZSI6LTEsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoyNS41OTE5OTk5OTk5OTk5ODgsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIxNCI6IiIsIjIxIjoiIiwiMjIiOiIiLCIyMyI6IiIsIjI0IjoiIiwiMjUiOiIiLCIyNiI6IiIsIjI3IjoiIiwiMjgiOiIiLCIyOSI6IiIsIjEwMCI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImYiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJsYXN0Q2xhaW1lZCI6MCwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicmYiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJsYXN0UmFyZUNsYWltZWQiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoyNS41OTE5OTk5OTk5OTk5ODgsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInNiIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjI1LjU5MTk5OTk5OTk5OTk4OCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjIxIjoiIiwiMjIiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9fQ=="
                if (!saveStr || saveStr.trim() === "") {
                    alert("If you see this, that means you are trying to load an empty save. Something has gone extremely wrong or you're just testing this popup.")
                    return
                }
                if (confirm("Are you sure you want to import this save? Your current save will be overwritten.")) {
                    importSave(saveStr)
                }
            },
            style() {
                return {
                    width: "180px", height: "80px", margin: "6px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #062c1e 0%, #0e5a36 55%, #259b52 100%)",
                    border: "2px solid #38ef7d",
                    boxShadow: "0 0 14px rgba(56, 239, 125, 0.35), inset 0 0 8px rgba(56, 239, 125, 0.15)",
                    color: "#e6fff0",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.9)",
                    fontWeight: "bold", fontSize: "11px", cursor: "pointer",
                    transition: "all 0.15s ease"
                }
            }
        },
        12: {
            title: "First Perk",
            display() { return "Level 1, 9 plants" },
            canClick() { return true },
            onClick() {
                let saveStr = "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5NDEyODc5Njk1NSwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJzYXZlIGdvdCBudWtlZCIsInZlcnNpb24iOiIxLjAwIiwidGltZVBsYXllZCI6MzE5LjgxNzAwMDAwMDAwNCwia2VlcEdvaW5nIjpmYWxzZSwiaGFzTmFOIjpmYWxzZSwicG9pbnRzIjoiOTQiLCJzdWJ0YWJzIjp7ImNoYW5nZWxvZy10YWIiOnt9LCJwIjp7Im1haW5UYWJzIjoiRmlyc3QifSwicHIiOnsibWFpblRhYnMiOiJNYWluIn19LCJsYXN0U2FmZVRhYiI6InBlIiwiaGlnaGVzdFRpZXIiOiIwIiwiaW5mb2JveGVzIjp7fSwiaW5mby10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjozMTkuODE3MDAwMDAwMDA0LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sIm9wdGlvbnMtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MzE5LjgxNzAwMDAwMDAwNCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJjaGFuZ2Vsb2ctdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MzE5LjgxNzAwMDAwMDAwNCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJibGFuayI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjMxOS44MTcwMDAwMDAwMDQsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwidHJlZS10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjozMTkuODE3MDAwMDAwMDA0LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInAiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjkiLCJncmFzc0ZpZWxkIjpbdHJ1ZSxmYWxzZSxmYWxzZSxmYWxzZSx0cnVlLGZhbHNlLHRydWUsdHJ1ZSx0cnVlXSwic3Bhd25UaW1lciI6MS4zNTIwMDAwMDAwMDAwMDAzLCJhdXRvVGltZXIiOjAsInhwIjoiMS40OTMyMDk1MTA3MjUyNTA4IiwibGV2ZWwiOiIxIiwidG90YWwiOiI5IiwiYmVzdCI6IjkiLCJyZXNldFRpbWUiOjMxOS44MTcwMDAwMDAwMDQsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7IjExIjoiNSIsIjEyIjoiNCIsIjEzIjoiMCJ9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIiwiMTIiOiIiLCIxMyI6IiIsIjE0IjoiIiwiMjEiOiIiLCIyMiI6IiIsIjIzIjoiIiwiMzEiOiIiLCIzMiI6IiIsIjMzIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicGUiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjEiLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MzE5LjgxNzAwMDAwMDAwNCwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJwciI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRpZXJzIjoiMCIsInRpZXJHcmFzc0ZpZWxkIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdLCJ0aWVyU3Bhd25UaW1lciI6MCwidGllckF1dG9jbGFpbVRpbWVyIjowLCJzZWxlY3RlZFRpZXJTdHlsZSI6LTEsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjozMTkuODE3MDAwMDAwMDA0LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCIxMiI6IiIsIjEzIjoiIiwiMTQiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIiLCIyNCI6IiIsIjI1IjoiIiwiMjYiOiIiLCIyNyI6IiIsIjI4IjoiIiwiMjkiOiIiLCIxMDAiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJmIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwibGFzdENsYWltZWQiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjozMTkuODE3MDAwMDAwMDA0LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJyZiI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsImxhc3RSYXJlQ2xhaW1lZCI6MCwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjMxOS44MTcwMDAwMDAwMDQsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInNiIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjMxOS44MTcwMDAwMDAwMDQsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjIxIjoiIiwiMjIiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9fQ=="
                if (!saveStr || saveStr.trim() === "") {
                    alert("If you see this, that means you are trying to load an empty save. Something has gone extremely wrong or you're just testing this popup.")
                    return
                }
                if (confirm("Are you sure you want to import this save? Your current save will be overwritten.")) {
                    importSave(saveStr)
                }
            },
            style() {
                return {
                    width: "180px", height: "80px", margin: "6px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #062c1e 0%, #0e5a36 55%, #259b52 100%)",
                    border: "2px solid #38ef7d",
                    boxShadow: "0 0 14px rgba(56, 239, 125, 0.35), inset 0 0 8px rgba(56, 239, 125, 0.15)",
                    color: "#e6fff0",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.9)",
                    fontWeight: "bold", fontSize: "11px", cursor: "pointer",
                    transition: "all 0.15s ease"
                }
            }
        },
        13: {
            title: "Tabs Unlocked",
            display() { return "Level 11, 41 plants" },
            canClick() { return true },
            onClick() {
                let saveStr = "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5NDEyOTQ2MzE2Niwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJzYXZlIGdvdCBudWtlZCIsInZlcnNpb24iOiIxLjAwIiwidGltZVBsYXllZCI6OTIwLjIwNzk5OTk5OTk5NzYsImtlZXBHb2luZyI6ZmFsc2UsImhhc05hTiI6ZmFsc2UsInBvaW50cyI6IjE2NTcxLjU4Nzk5OTk5OTk3OCIsInN1YnRhYnMiOnsiY2hhbmdlbG9nLXRhYiI6e30sInAiOnsibWFpblRhYnMiOiJGaXJzdCJ9LCJwciI6eyJtYWluVGFicyI6Ik1haW4ifX0sImxhc3RTYWZlVGFiIjoicCIsImhpZ2hlc3RUaWVyIjoiMCIsImluZm9ib3hlcyI6e30sImluZm8tdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6OTIwLjIwNzk5OTk5OTk5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwib3B0aW9ucy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo5MjAuMjA3OTk5OTk5OTk3NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJjaGFuZ2Vsb2ctdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6OTIwLjIwNzk5OTk5OTk5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiYmxhbmsiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo5MjAuMjA3OTk5OTk5OTk3NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ0cmVlLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjkyMC4yMDc5OTk5OTk5OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInAiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjQxIiwiZ3Jhc3NGaWVsZCI6W2ZhbHNlLGZhbHNlLGZhbHNlLHRydWUsdHJ1ZSxmYWxzZSx0cnVlLHRydWUsZmFsc2VdLCJzcGF3blRpbWVyIjowLjA1LCJhdXRvVGltZXIiOjAsInhwIjoiNzIuMDA2ODc3MjE3MDI4MDkiLCJsZXZlbCI6IjExIiwidG90YWwiOiI0MSIsImJlc3QiOiI0MSIsInJlc2V0VGltZSI6OTIwLjIwNzk5OTk5OTk5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7IjExIjoiNDEiLCIxMiI6IjExIiwiMTMiOiIwIn0sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCIxMiI6IiIsIjEzIjoiIiwiMTQiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIiLCIzMSI6IiIsIjMyIjoiIiwiMzMiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsImF1dG9jbGFpbVRpbWVyIjoyMi40ODg5OTk5OTk5OTk5OTR9LCJwZSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo5MjAuMjA3OTk5OTk5OTk3NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbMTEsMzEsMzMsNTEsNTMsNjEsNzEsNzNdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInByIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidGllcnMiOiIwIiwidGllckdyYXNzRmllbGQiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV0sInRpZXJTcGF3blRpbWVyIjowLCJ0aWVyQXV0b2NsYWltVGltZXIiOjAsInNlbGVjdGVkVGllclN0eWxlIjotMSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjkyMC4yMDc5OTk5OTk5OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCIxMiI6IiIsIjEzIjoiIiwiMTQiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIiLCIyNCI6IiIsIjI1IjoiIiwiMjYiOiIiLCIyNyI6IiIsIjI4IjoiIiwiMjkiOiIiLCIxMDAiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJmIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiI1MCIsImxhc3RDbGFpbWVkIjowLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6OTIwLjIwNzk5OTk5OTk5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInJmIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwibGFzdFJhcmVDbGFpbWVkIjowLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6OTIwLjIwNzk5OTk5OTk5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInNiIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjkyMC4yMDc5OTk5OTk5OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCIxMiI6IiIsIjEzIjoiIiwiMjEiOiIiLCIyMiI6IiIsIjIzIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifX0="
                if (!saveStr || saveStr.trim() === "") {
                    alert("If you see this, that means you are trying to load an empty save. Something has gone extremely wrong or you're just testing this popup.")
                    return
                }
                if (confirm("Are you sure you want to import this save? Your current save will be overwritten.")) {
                    importSave(saveStr)
                }
            },
            style() {
                return {
                    width: "180px", height: "80px", margin: "6px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #062c1e 0%, #0e5a36 55%, #259b52 100%)",
                    border: "2px solid #38ef7d",
                    boxShadow: "0 0 14px rgba(56, 239, 125, 0.35), inset 0 0 8px rgba(56, 239, 125, 0.15)",
                    color: "#e6fff0",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.9)",
                    fontWeight: "bold", fontSize: "11px", cursor: "pointer",
                    transition: "all 0.15s ease"
                }
            }
        },
        21: {
            title: "First Prestige",
            display() { return "Level 47, 83 plants" },
            canClick() { return true },
            onClick() {
                let saveStr = "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5NDEzMzMwMDc1Nywibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJzYXZlIGdvdCBudWtlZCIsInZlcnNpb24iOiIxLjAwIiwidGltZVBsYXllZCI6MTA4Ny40NjQ5OTk5OTk5ODcsImtlZXBHb2luZyI6ZmFsc2UsImhhc05hTiI6ZmFsc2UsInBvaW50cyI6IjI0MDA5OTQuMTQ0MDU5OTI3NyIsInN1YnRhYnMiOnsiY2hhbmdlbG9nLXRhYiI6e30sInAiOnsibWFpblRhYnMiOiJFdmVyeXRoaW5nIn0sInByIjp7Im1haW5UYWJzIjoiTWFpbiJ9fSwibGFzdFNhZmVUYWIiOiJwIiwiaGlnaGVzdFRpZXIiOiIwIiwiaW5mb2JveGVzIjp7fSwiaW5mby10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJvcHRpb25zLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjEwODcuNDY0OTk5OTk5OTg3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImNoYW5nZWxvZy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJibGFuayI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjEwODcuNDY0OTk5OTk5OTg3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInRyZWUtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTA4Ny40NjQ5OTk5OTk5ODcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicCI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiODMiLCJncmFzc0ZpZWxkIjpbZmFsc2UsZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV0sInNwYXduVGltZXIiOjIuNCwiYXV0b1RpbWVyIjowLCJ4cCI6Ijc2NjcxLjAxMDQzMjUwMTk4IiwibGV2ZWwiOiI0NyIsInRvdGFsIjoiMTMzIiwiYmVzdCI6IjgzIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnsiMTEiOiI4MyIsIjEyIjoiMTMiLCIxMyI6IjIwMCJ9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIiwiMTIiOiIiLCIxMyI6IiIsIjE0IjoiIiwiMjEiOiIiLCIyMiI6IiIsIjIzIjoiIiwiMzEiOiIiLCIzMiI6IiIsIjMzIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzExXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsImF1dG9jbGFpbVRpbWVyIjo5LjUzMjk5OTk5OTk5OTk5NH0sInBlIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIxNyIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbMTEsMzEsMzMsNTEsNTMsNjEsNzEsNzMsOTEsOTMsMTExLDExM10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicHIiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJ0aWVycyI6IjAiLCJ0aWVyR3Jhc3NGaWVsZCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXSwidGllclNwYXduVGltZXIiOjAsInRpZXJBdXRvY2xhaW1UaW1lciI6MCwic2VsZWN0ZWRUaWVyU3R5bGUiOi0xLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTA4Ny40NjQ5OTk5OTk5ODcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIxNCI6IiIsIjIxIjoiIiwiMjIiOiIiLCIyMyI6IiIsIjI0IjoiIiwiMjUiOiIiLCIyNiI6IiIsIjI3IjoiIiwiMjgiOiIiLCIyOSI6IiIsIjEwMCI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImYiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjUwIiwibGFzdENsYWltZWQiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwicmYiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJsYXN0UmFyZUNsYWltZWQiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxMDg3LjQ2NDk5OTk5OTk4NywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwic2IiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTA4Ny40NjQ5OTk5OTk5ODcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9fQ=="
                if (!saveStr || saveStr.trim() === "") {
                    alert("If you see this, that means you are trying to load an empty save. Something has gone extremely wrong or you're just testing this popup.")
                    return
                }
                if (confirm("Are you sure you want to import this save? Your current save will be overwritten.")) {
                    importSave(saveStr)
                }
            },
            style() {
                return {
                    width: "180px", height: "80px", margin: "6px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #005f73, #0a9396)",
                    border: "2px solid #00ffff", color: "#ffffff",
                    fontWeight: "bold", fontSize: "11px", cursor: "pointer"
                }
            }
        },
        22: {
            title: "First Tier",
            display() { return "Level 66, 112 plants" },
            canClick() { return true },
            onClick() {
                let saveStr = "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5NDEzNDE4NTExNywibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJzYXZlIGdvdCBudWtlZCIsInZlcnNpb24iOiIxLjAwIiwidGltZVBsYXllZCI6NDExOS44ODkwMDAwMDAwMjUsImtlZXBHb2luZyI6ZmFsc2UsImhhc05hTiI6ZmFsc2UsInBvaW50cyI6IjQzOTU2OTc5LjA4NzEzNzM4Iiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fSwicCI6eyJtYWluVGFicyI6IkV2ZXJ5dGhpbmcifSwicHIiOnsibWFpblRhYnMiOiJNYWluIn19LCJsYXN0U2FmZVRhYiI6InAiLCJoaWdoZXN0VGllciI6IjEiLCJpbmZvYm94ZXMiOnt9LCJpbmZvLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjE5MzAuNDkxOTk5OTk5ODk3NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJvcHRpb25zLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjE5MzAuNDkxOTk5OTk5ODk3NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJjaGFuZ2Vsb2ctdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTkzMC40OTE5OTk5OTk4OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImJsYW5rIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTkzMC40OTE5OTk5OTk4OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInRyZWUtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTkzMC40OTE5OTk5OTk4OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInAiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjExMiIsImdyYXNzRmllbGQiOlt0cnVlLGZhbHNlLGZhbHNlLGZhbHNlLHRydWUsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdLCJzcGF3blRpbWVyIjoyLjI0ODk5OTk5OTk5OTk5OTcsImF1dG9UaW1lciI6MCwieHAiOiIxNDQ2NzcwLjMwNjQ2NTU5MzIiLCJsZXZlbCI6IjY2IiwidG90YWwiOiIyOTgiLCJiZXN0IjoiMTEyIiwicmVzZXRUaW1lIjoxOTMwLjQ5MTk5OTk5OTg5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7IjExIjoiMTEzIiwiMTIiOiIxNCIsIjEzIjoiMjAwIn0sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCIxMiI6IiIsIjEzIjoiIiwiMTQiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIiLCIzMSI6IiIsIjMyIjoiIiwiMzMiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbMTFdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIiwiYXV0b2NsYWltVGltZXIiOjIyLjQwMDAwMDAwMDAwMDAxNn0sInBlIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIzOSIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxOTMwLjQ5MTk5OTk5OTg5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzMxLDMzLDExLDUxLDUyLDUzLDcxLDczLDkxLDkzLDExMSwxMTNdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInByIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIyNzIuMjQ0NzMyNzI4MTcyNCIsInRpZXJzIjoiMSIsInRpZXJHcmFzc0ZpZWxkIjpbZmFsc2UsdHJ1ZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSx0cnVlLHRydWUsZmFsc2VdLCJ0aWVyU3Bhd25UaW1lciI6Mi40MDAwMDAwMDAwMDAwMDA0LCJ0aWVyQXV0b2NsYWltVGltZXIiOjIxLjMwMTAwMDAwMDAwMDAyLCJzZWxlY3RlZFRpZXJTdHlsZSI6LTEsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxOTMwLjQ5MTk5OTk5OTg5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIxNCI6IiIsIjIxIjoiIiwiMjIiOiIiLCIyMyI6IiIsIjI0IjoiIiwiMjUiOiIiLCIyNiI6IiIsIjI3IjoiIiwiMjgiOiIiLCIyOSI6IiIsIjEwMCI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOlsxMSwxMiwyMV0sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiZiI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMTAwIiwibGFzdENsYWltZWQiOjAsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxOTMwLjQ5MTk5OTk5OTg5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInJmIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwibGFzdFJhcmVDbGFpbWVkIjowLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTkzMC40OTE5OTk5OTk4OTc2LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJzYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMCIsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjoxOTMwLjQ5MTk5OTk5OTg5NzYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIyMSI6IiIsIjIyIjoiIiwiMjMiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9fQ=="
                if (!saveStr || saveStr.trim() === "") {
                    alert("If you see this, that means you are trying to load an empty save. Something has gone extremely wrong or you're just testing this popup.")
                    return
                }
                if (confirm("Are you sure you want to import this save? Your current save will be overwritten.")) {
                    importSave(saveStr)
                }
            },
            style() {
                return {
                    width: "180px", height: "80px", margin: "6px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #005f73, #0a9396)",
                    border: "2px solid #00ffff", color: "#ffffff",
                    fontWeight: "bold", fontSize: "11px", cursor: "pointer"
                }
            }
        }
    }
})