const rapidClient = require('./client');
const rapidApiClient = require('./client');
const Crawler = require('../database/crawlerModel')
const mongoose = require("mongoose");

// const teamsObj = { homeTeam: "Sevilla", awayTeam: "Wolves"}
const normalize = async (obj) => {
	const homeId = await rapidClient(`/teams/search/${obj.homeTeam.trim().replace(' ', '_')}`);
	const awayId = await rapidClient(`/teams/search/${obj.awayTeam.trim()}`);
	if (!homeId || !homeId.teams) return false;
	let {teams} = homeId
	let teamsAway = awayId.teams;
	
	const homeTeam = findTeam(teams, obj)
	const awayTeam = findTeam(teamsAway, obj)

	if (homeTeam.team_id) {
		const result = await findFixture(homeTeam.team_id);
		if (!result || !result.fixtures) return { };
		let { fixtures } = result;
		const targetFixture = selectFixture(fixtures)
		console.log(targetFixture, "FIx");
		prepareForUpdate(targetFixture, homeTeam, awayTeam, obj)
	} else {
		console.log("None");
	}
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
	arr.forEach(team => {
		if (team.name.toLowerCase() === obj.homeTeam.toLowerCase() || team.name.toLowerCase() === obj.awayTeam.toLowerCase()) {
			targetTeam = team;
		} else {
			console.log("Does not match");
		}
	})
	if (!targetTeam.name) {
		targetTeam = arr[0];
	}
	return targetTeam;
}

const findFixture = (matchId) => {
	return new Promise(resolve => {
		rapidApiClient(`/fixtures/team/${matchId}/next/1`)
			.then(res => {
				console.log(res);
				resolve(res)
			})
	})
}

const getFromDb = async () => {
	const data = await Crawler.find({
		normalisedAt: {$type: 10}
	}).sort({createdAt: -1}).limit(10);

	return data;
}
// 536 sevilla, 257 rangers

const selectFixture = (arrOfTeams) => {
	if (arrOfTeams.length <= 0) return { };
	return arrOfTeams[0];
}

const updateTips = async (targetFixture, obj) => {
	console.log({targetFixture, obj})
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
	getFromDb().then(res => {
		console.log({res});
		res.forEach(obj => {
			normalize(obj);
		});
	});
}

module.exports = () => {
	normalizeFromDb,
	normalize
}