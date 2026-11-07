let modInfo = {
	name: "The Cookie Tree",
	author: "thecoolcookie366",
	pointsName: "spacetime",
	modFiles: ["layers.js", "tree.js"],

	discordName: "Cookie's Creations Server",
	discordLink: "https://discord.gg/aUbDYX5Z3a",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 296280,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.03",
	name: "The Random Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<br>
	<h3>Changelog Guide: vA.BC </h3><br>
	A = big update <br>
	B = medium update <br>
	C = small update <br>
	<br>
	<h3>v1.03</h3><br>
		- Added the RNG layer.<br>
		- A bunch of things i forgot i added<br>
		<br>
	<h3>v1.02</h3><br>
		- Added the functionality to the Tier Power 1 upgrade.<br>
		- Added 5 more point upgrades (RECOVERY UPGRADES, BUT STILL REQUIRED FOR ENDGAME)<br>
		- Added a warning to bonus layers that they reset everything.<br>
		<br>
	<h2>v1.01</h2><br>
		The second biggest update ever!<br>
		- Added Master Magnets.<br>
		- Made automation even easier and more expansive.<br>
		- Extended the offline time limit to 30+ years which is just arbitrarily large.<br>
		- Updated the 2nd SST challenge. Did a lot of extensions to it too!<br>
		- The 2nd bonus layer!<br>
		- Everything else i forgot here (no new hotkeys this update...)<br>
		<br>
	<h3>v1.009</h3><br>
		- Made automation easier to obtain.<br>
		<br>
	<h3>v1.008</h3><br>
		- Added four new cookie layers.<br>
		- <b><i>hotkeys</i></b><br>
		- Hovering on an upgrade with a formula shows the formula.<br>
		<br>
	<h3>v1.007</h3><br>
		- Added one new layer to every row before Grass. (water, tetr, eternities)<br>
		- Added automation!!<br>
		- Added the space-spacetime layer with two new challenges.<br>
		- Most importantly... ADDED HOTKEYS<br>
		<br>
	<h3>v1.006</h3><br>
		- Rebalanced everything and made the game faster.<br>
		<br>
	<h2>v1.005</h2><br>
		- Added Meta. Expect really big numbers from it!<br>
		- Added a Hardcaps layer. <br>
		- The new 1e1,000,000,000 super cap! Prevents points from going insane because of the new exp upgrade. <br>
		- Added something <i>even more meta than meta...?</i><br>
		- Universe 4! This new universe will let you touch grass (literally, the currency <i>is</i> grass). Automation included!<br>
		- <i>balancing</i><br>
		<br>
	<h3>v1.003</h3><br>
		- Added a new bonus layer.<br>
		- Added Universe 0? <br>
		<br>
	<h1>v1.00</h1><br>
		- Revamped the game.<br>
		<br>`

let winText = `<i>But this spacetime isn't real, right?</i>`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('rng', 12)) gain = gain.add(1)
	if (hasUpgrade('rng', 13)) gain = gain.add(1e10)
	if (hasUpgrade('rng', 14)) gain = gain.add(1e100)
	if (hasUpgrade('rng', 15)) gain = gain.add("1e1000")
	if (hasUpgrade('rng', 21)) gain = gain.add("3.33e3333")
	if (hasUpgrade('rng', 22)) gain = gain.add("6.66e6666")
	if (hasUpgrade('rng', 23)) gain = gain.add("1e10000")
	if (hasUpgrade('rng', 24)) gain = gain.add("1e25e3")
	if (hasUpgrade('rng', 25)) gain = gain.add("1e100e3")
	if (hasUpgrade('rng', 31)) gain = gain.add("1e1e6")
	if (hasUpgrade('p', 11)) gain = gain.add(1)
	if (hasUpgrade('p', 21)) gain = gain.times(3)
	if (hasUpgrade('p', 22)) gain = gain.times(3)
	if (hasUpgrade('p', 23)) gain = gain.times(3)
	if (hasUpgrade('p', 24)) gain = gain.times(3)
	if (hasUpgrade('p', 25)) gain = gain.times(3)
	if (hasUpgrade('p', 31)) gain = gain.times(2)
	if (hasUpgrade('e', 11)) gain = gain.times(120)
	if (hasUpgrade('e', 21)) gain = gain.times(1000000)
	if (hasUpgrade('s', 11)) gain = gain.times(50000)
	if (hasUpgrade('s', 21)) gain = gain.times(500000)
	if (hasUpgrade('p', 61)) gain = gain.times(100)
	if (hasUpgrade('p', 71)) gain = gain.times(1.11e111)
	if (hasUpgrade('p', 72)) gain = gain.times(2.22e222)
	if (hasUpgrade('p', 81)) gain = gain.times(1e15)
	if (hasUpgrade('p', 82)) gain = gain.times(1e150)
	if (hasUpgrade('p', 83)) gain = gain.times("1e1500")
	if (hasUpgrade('p', 84)) gain = gain.times("1e15000")
	if (hasUpgrade('p', 85)) gain = gain.times("1e150000")
	if (hasUpgrade('e', 31)) gain = gain.times(6.66e66)
	if (hasUpgrade('u', 11)) gain = gain.times(1e12)
	if (hasUpgrade('pie', 11)) gain = gain.times(2)
	if (hasUpgrade('pie', 21)) gain = gain.times(5)
	if (hasUpgrade('pie', 31)) gain = gain.times(20)
	if (hasUpgrade('meta', 11)) gain = gain.times(10)
	if (hasUpgrade('w', 11)) gain = gain.times("1e1000")
	if (hasUpgrade('inf', 21)) gain = gain.times(upgradeEffect('inf', 21))
	if (hasUpgrade('w', 21)) gain = gain.times(upgradeEffect('w', 21))
	if (hasUpgrade('vc', 11)) gain = gain.times(upgradeEffect('vc', 11))
	if (hasUpgrade('np', 12)) gain = gain.divide("1e1099")
	if (hasUpgrade('np', 13)) gain = gain.times("1e1099")
	if (hasMilestone('pm', 0)) gain = gain.times("2.22e22222")
	if (hasMilestone('nm', 0)) gain = gain.divide("2.22e22222")
	if (hasUpgrade('np', 22)) gain = gain.times("2.22e22222")
	if (hasMilestone('pm', 1)) gain = gain.times("1e10000")
	if (hasMilestone('nm', 1)) gain = gain.divide("1e10000")
	if (hasUpgrade('np', 24)) gain = gain.times("1.23e45678")
	if (hasMilestone('mm', 1)) gain = gain.times("1e100000")
	if (hasUpgrade('np', 13)) gain = gain.times("-1")
	if (hasUpgrade('np', 21)) gain = gain.times("-1")
	if (hasMilestone('uni', 0) && player.points.lt("1e100")) gain = gain.pow(2);
	if (hasMilestone('uni', 0) && player.points.gte("1e100")) gain = gain.pow(1.001);
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {if (player.points.gt(-2)) return "<h3>v1.03 endgame: e133,600,000 spacetime!</h3>"},
	//function() {if (player.points.gt(-2)) return "<h2>beta version! do not publish to galaxy</h2>"},
	function() {if (inChallenge('sst', 11)) return "<i>You are currently in the Endurance Test challenge.</i>"},
	function() {if (inChallenge('sst', 12)) return "<i>You are currently in the Reversing The Game challenge.</i>"},
	function() {if (inChallenge('sst', 12) && player.np.points.gte("1e1425200")) return "<i>But was it really worth it?</i>"}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e133600000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}