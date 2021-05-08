const express = require('express');
const router = express.Router();
const chalk = require('chalk');

const { Game } = require('../../sequelize');
const { getAllGames, getOneGame, createGame } = require('../../src/games');

router.route('/')
    .get(getAllHandler)
    .post(postOneHandler);

router.route('/:gameid')
    .get(getOneHandler)
    .put(putOneHandler)
    .delete(deleteOneHandler);

async function getAllHandler(req, res) {
    console.log(chalk.grey("[mgg-server] Games->Get"));

    let games = await getAllGames();
    res.status(200).json(games);
}
async function getOneHandler(req, res) {
    console.log(chalk.grey("[mgg-server] Games->Get"));

    if(req.params.gameid == undefined) {
        res.status(400).json({name: "MISSING_DATA", text: "Required parameter: gameid"});
        return;
    }

    let gameData = await getOneGame({ id: req.params.gameid });
    res.status(200).json(gameData);
}
async function postOneHandler(req, res) {
    console.log(chalk.grey("[mgg-server] Games->Post"));

    // TODO: Check Authorization

    const data = {
        title: req.body.title,
        ingameID: req.body.ingameID,
        description: req.body.description,
        youtubeID: req.body.youtubeID,
        displayStatus: req.body.displayStatus,
        userId: 1
    };

    if(data.title === '' || data.ingameID === '') {
        res.status(400).json({name: "MISSING_FIELDS", text: "Required fields: title, ingameID"});
        return;
    }

    createGame( data ).then((game) => {
        res.status(201).json( game );
    }).catch((error) => {
        console.error(error);
        res.status(500).json({name: "UNKNOWN_SERVER_ERROR", text: "Unknown Server Error! Please try again later!"});
    });
}
async function putOneHandler(req, res) {
    console.log(chalk.grey("[mgg-server] Games->Put"));

    // TODO: Check Authorization

    // TODO: Update Game
}
async function deleteOneHandler(req, res) {
    console.log(chalk.grey("[mgg-server] Games->Delete"));

    // TODO: Check Authorization

    // TODO: Remove Game
}

module.exports = router;