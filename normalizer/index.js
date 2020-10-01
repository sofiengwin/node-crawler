const rapidClient = require('./client');
const rapidApiClient = require('./client');
const Crawler = require('../database/crawlerModel')
const mongoose = require("mongoose");


// const teamsObj = { homeTeam: "Sevilla", awayTeam: "Wolves"}
const normalize = async (obj) => {
	console.log(obj, "targ");
	console.log("Try 2")
	let home = obj.homeTeam.includes('(') ? obj.homeTeam.slice(0, obj.homeTeam.split('').indexOf('(')) : obj.homeTeam
	let away = obj.awayTeam.includes('(') ? obj.awayTeam.slice(0, obj.awayTeam.split('').indexOf('(')) : obj.awayTeam


	home = home.trim().replace(' ', '_').replace('.', '');
	away = away.trim().replace(' ', '_').replace('.', '');
	console.log(`${home} vs ${away}`);
	const homeId = await rapidClient(`/teams/search/${home}`);
	// const homeId = await rapidClient(`/teams/search/Chelsea`);
	// const awayId = await rapidClient(`/teams/search/Arsenal`);
	const awayId = await rapidClient(`/teams/search/${away}`);
	if (!homeId || !homeId.teams) return false;
	let {teams} = homeId
	let teamsAway = awayId.teams;

	const homeTeam = findTeam(teams, obj)
	const awayTeam = findTeam(teamsAway, obj)

	console.log(homeTeam, "team")

	if (homeTeam.team_id) {
		const result = await findFixtureByTeamId(homeTeam.team_id);
		if (!result || !result.fixtures) return { };
		let { fixtures } = result;
		const targetFixture = selectFixture(fixtures)
		console.log(targetFixture, "FIx");
		prepareForUpdate(targetFixture, homeTeam, awayTeam, obj)
	} else {
		console.log("None");
	}
}

function fuzzyMatch(pattern, str) {
	pattern = '.*' + pattern.split('').join('.*') + '.*';
	const re = new RegExp(pattern);
	return re.test(str);
}

const getMatchFromTodaymatches = async (tips, match) => {
	const filtered = await tips.find(i => fuzzyMatch(i.homeTeam, match.homeTeam.team_name) || fuzzyMatch(i.awayTeam, match.awayTeam.team_name) || i.homeTeam.toLowerCase() === match.homeTeam.team_name.toLowerCase() || i.awayTeam.toLowerCase() === match.awayTeam.team_name.toLowerCase() );
	let removedId;
	if (filtered) {
		const fixture = await findFixture(match.fixture_id)
		await updateTips(fixture, filtered)
		removedId = filtered._id;
	} else {
		
	}
	return removedId;
}

const normalizeV2 = async () => {
	const todayMatches = await rapidApiClient(`/fixtures/date/${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth() + 1}-${new Date(Date.now()).getDate()}`);
	let tips = await (await getFromDb()).filter(tip => isTodayMatch(tip));
	console.log(tips);
	if (todayMatches && tips.length > 0) {
		for (let match of todayMatches.fixtures) {
			if (tips.length > 0) {
				let removedId = await getMatchFromTodaymatches(tips.filter(tip => tip.awayTeam && isTodayMatch(tip)), match);
				if (removedId) {
					tips = tips.filter(tip => tip._id !== removedId)
				}
			}
		}
	}

	let secondTry = await (await getFromDb()).filter(tip => isTodayMatch(tip));
	for(const tip of secondTry) {
		try {
			await normalize(tip)
		} catch (error) {
			console.log("error try2");
			console.log({error})
		}
	}
	console.log("Done");
}

const isTodayMatch = (tip) => {
	let today = new Date(Date.now());
	let tipDate = new Date(tip.createdAt);
	return tipDate.getDate() == today.getDate() && tipDate.getMonth() == today.getMonth() && tipDate.getFullYear() == today.getFullYear();
}

// normalize(teamsObj)

const prepareForUpdate = (targetFixture, homeTeam, awayTeam, obj) => {
	if (targetFixture && targetFixture.fixture_id) {
		let homeMatch = targetFixture.homeTeam.team_id === homeTeam.team_id;
		let awayMatch = targetFixture.awayTeam.team_id === awayTeam.team_id;
		if (homeMatch && awayMatch) {
			console.log("Correct Fixture");
			updateTips(targetFixture, obj);
		} else {
			console.log("Wrong Fixture");
		}
	} else {
		console.log("Fixture Not found");
	}
}

const findTeam = (arr, obj) => {
	let targetTeam = {};
	if (arr.length <= 0) return { }
	// arr.forEach(team => {
		
	// })

	for (let team of arr)
	{
		if (team.name.toLowerCase() === obj.homeTeam.toLowerCase() || team.name.toLowerCase() === obj.awayTeam.toLowerCase()) {
			targetTeam = team;
			break;
		} else {
			console.log("Does not match");
		}
	}

	if (!targetTeam.name) {
		targetTeam = arr[0];
	}
	return targetTeam;
}

const findFixture = (matchId) => {
	console.log(matchId);
	return new Promise(resolve => {
		// rapidApiClient(`/fixtures/team/${matchId}/next/1`)
		rapidApiClient(`/fixtures/id/${matchId}`)
			.then(res => {
				console.log(res);
				if (res && res.fixtures.length == 0) resolve({});
				resolve(res.fixtures[0])
			})
	})
}

const findFixtureByTeamId = (matchId) => {
	console.log(matchId);
	return new Promise(resolve => {
		rapidApiClient(`/fixtures/team/${matchId}/next/1`)
		// rapidApiClient(`/fixtures/id/${matchId}`)
			.then(res => {
				console.log(res);
				if (res && res.fixtures.length == 0) resolve({});
				resolve(res.fixtures[0])
			})
	})
}

const getFromDb = async () => {
	// const data = await Crawler.find({
	// 	_id: "5f6ed93b6931de0024a599ff"
	// });

	const data = await Crawler.find({
		normalisedAt: { $type: 10 },
	}).sort({ createdAt: -1 }).limit(100);

	return data;
}
// 536 sevilla, 257 rangers

const selectFixture = (arrOfTeams) => {
	if (arrOfTeams.length <= 0) return { };
	return arrOfTeams[0];
}

const updateTips = async (targetFixture, obj) => {
	console.log({ targetFixture, obj })
	await Crawler.updateOne({ _id: obj._id }, {
		fixtureId: targetFixture.fixture_id,
		homeTeamId: targetFixture.homeTeam.team_id,
		awayTeamId: targetFixture.awayTeam.team_id,
		league: targetFixture.league.name,
		country: targetFixture.league.country,
		eventTimestamp: targetFixture.event_timestamp * 1000,
		normalisedAt: Date.now(),
	}, (err, res) => {
		if (err) {
			console.log(err, "error");
		} else {
			console.log("normalized");
			console.log(res, "Success");
		}
	})
}


const normalizeFromDb = async () => {
	// const tips = await getFromDb();
	// console.log(tips);
	try {
		await normalizeV2();
	} catch (error) {
		console.log(error);
	}

	// for(const tip of tips) {
	// 	console.log(tip);
	// 	try {
	// 		await normalize(tip)
	// 	} catch (error) {
	// 		console.log({error})
	// 	}
	// }
}

module.exports = {
	normalizeFromDb,
	normalize
}