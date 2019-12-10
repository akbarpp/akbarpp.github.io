var dbPromise = idb.open("premiereLeague", 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("favoriteTeams")) {
        var palyerFav = upgradeDb.createObjectStore("favoriteTeams", {
            keyPath: 'id'
        });
        palyerFav.createIndex("idTeam", "idTeam", {
            unique: true
        });
    }
    if (!upgradeDb.objectStoreNames.contains("favoritePlayers")) {
        var palyerFav = upgradeDb.createObjectStore("favoritePlayers", {
            keyPath: 'id'
        });
        palyerFav.createIndex("idPlayer", "idPlayer", {
            unique: true
        });
        palyerFav.createIndex("idTeam", "idTeam", {
            unique: false
        });
    }
})

var urlParams = new URLSearchParams(window.location.search)
var favIdTeam = urlParams.get('favoriteTeamId')
var favIdPlayer = urlParams.get('favoritePlayerId')
var delIdTeam = urlParams.get('delFavoriteTeamId')
var delIdPlayer = urlParams.get('delFavoritePlayerId')
var teamid = urlParams.get('teamId')
var html

if (favIdTeam != null) {
    addFavoriteTeam(favIdTeam)
} else if (favIdPlayer != null) {
    addFavoritePlayer(favIdPlayer)
} else if (delIdTeam != null) {
    delFavoriteTeam(delIdTeam)
} else if (delIdPlayer != null) {
    delFavoritePlayer(delIdPlayer)
}

function addFavoriteTeam(teamId) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteTeams', 'readwrite');
        var store = tx.objectStore('favoriteTeams');
        var item = {
            id: teamId,
            idTeams: teamId
        };
        store.put(item);
        return tx.complete;
    }).then(function () {
        M.toast({
            html: 'successfully added to favorites.'
        })
    }).catch(function () {
        M.toast({
            html: 'failed to add to favorites.'
        })
    })
}

function addFavoritePlayer(playerId) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoritePlayers', 'readwrite');
        var store = tx.objectStore('favoritePlayers');
        var item = {
            id: playerId,
            idPlayer: playerId,
            idTeam: teamid
        };
        store.put(item);
        return tx.complete;
    }).then(function () {
        M.toast({
            html: 'successfully added to favorites.'
        })
    }).catch(function () {
        M.toast({
            html: 'failed to add to favorites.'
        })
    })
}

function delFavoriteTeam(teamId) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteTeams', 'readwrite');
        var store = tx.objectStore('favoriteTeams');
        store.delete(teamId);
        return tx.complete;
    }).then(function () {
        M.toast({
            html: 'successfully remove from favorites.'
        })
    }).catch(function () {
        M.toast({
            html: 'failed to remove from favorites.'
        })
    })
}

function delFavoritePlayer(playerId) {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoritePlayers', 'readwrite');
        var store = tx.objectStore('favoritePlayers');
        store.delete(playerId);
        return tx.complete;
    }).then(function () {
        M.toast({
            html: 'successfully remove from favorites.'
        })
    }).catch(function () {
        M.toast({
            html: 'failed to remove from favorites.'
        })
    })
}

function getfavoriteTeam() {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoriteTeams', 'readonly');
        var store = tx.objectStore('favoriteTeams');
        return store.getAll();
    }).then(function (data) {
        data.forEach(function (team) {
            getTeamFavById(team.id)
        });
    });
}

function getfavoritePlayer() {
    dbPromise.then(function (db) {
        var tx = db.transaction('favoritePlayers', 'readonly');
        var store = tx.objectStore('favoritePlayers');
        return store.getAll();
    }).then(function (data) {
        data.forEach(function (player) {
            getPlayerFavById(player.id)
        });
    });
}