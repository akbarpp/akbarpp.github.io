var base_url = "https://api.football-data.org/v2/";
const API_KEY = '614785d87df74e6bab9dcad92ef326b9';

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getTeams() {
    var request = new Request(base_url + "competitions/2021/teams", {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var htmlcache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    data.teams.forEach(function (team) {
                        htmlcache += `<tr>
                                    <td><img src="${team.crestUrl}" height="30"></td>
                                    <td>${team.name}</td>
                                    <td>${team.venue}</td>
                                    <td>
                                        <a href="?favoriteTeamId=${team.id}" class="waves-effect waves-light red-text" title="favorite ${team.name}"><i class="material-icons">favorite_outline</i></a>
                                        <a href="./pages/detail.html?id=${team.id}" class="waves-effect waves-light" title="view ${team.name} detail"><i class="material-icons">info_outline</i></a>
                                    </td>
                                </tr>`
                    });
                    document.getElementById("teams").innerHTML = htmlcache;
                })
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.
            data.teams.forEach(function (team) {
                html += `<tr>
                            <td><img src="${team.crestUrl}" height="30"></td>
                            <td>${team.name}</td>
                            <td>${team.venue}</td>
                            <td>
                                <a href="?favoriteTeamId=${team.id}" class="waves-effect waves-light red-text" title="favorite ${team.name}"><i class="material-icons">favorite_outline</i></a>
                                <a href="./pages/detail.html?id=${team.id}" class="waves-effect waves-light" title="view ${team.name} detail"><i class="material-icons">info_outline</i></a>
                            </td>
                        </tr>`
            });
            document.getElementById("teams").innerHTML = html;
        })
        .catch(error);
}

function getTeamById() {
    var urlParams = new URLSearchParams(window.location.search)
    var id = urlParams.get("id")
    var request = new Request(base_url + "teams/" + id, {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var html1 = ``
    var htmlcache = ``
    var html1cache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    document.getElementById('logo').setAttribute('src', data.crestUrl)
                    document.getElementById('name').innerHTML = data.name + ' (' + data.area.name + ')'
                    document.getElementById('venue').innerHTML = 'Stadium: ' + data.venue
                    document.getElementById('website').innerHTML = 'Official website : <a href="' + data.website + '">' + data.website + '</a>'

                    data.activeCompetitions.forEach(function (competition) {
                        htmlcache += `<li class="collection-item competitionName">${competition.name}</li>`
                    })
                    document.getElementById("competition").innerHTML = htmlcache;

                    data.squad.forEach(function (squad) {
                        var tgl = tglIndo(new Date(squad.dateOfBirth))
                        html1cache += `<tr>
                                    <td>${squad.name}</td>
                                    <td>${tgl}</td>
                                    <td>${squad.nationality}</td>
                                    <td>${squad.position}</td>
                                    <td><a href="?favoritePlayerId=${squad.id}&teamId=${id}" class="waves-effect waves-light red-text" title="favorite ${squad.name}"><i class="material-icons">favorite_outline</i></a></td>
                                </tr>`
                    })
                    document.getElementById('squad').innerHTML = html1cache
                })
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            document.getElementById('logo').setAttribute('src', data.crestUrl)
            document.getElementById('name').innerHTML = data.name + ' (' + data.area.name + ')'
            document.getElementById('venue').innerHTML = 'Stadium: ' + data.venue
            document.getElementById('website').innerHTML = 'Official website : <a href="' + data.website + '">' + data.website + '</a>'

            data.activeCompetitions.forEach(function (competition) {
                html += `<li class="collection-item competitionName">${competition.name}</li>`
            })
            document.getElementById("competition").innerHTML = html;

            data.squad.forEach(function (squad) {
                var tgl = tglIndo(new Date(squad.dateOfBirth))
                html1 += `<tr>
                            <td>${squad.name}</td>
                            <td>${tgl}</td>
                            <td>${squad.nationality}</td>
                            <td>${squad.position}</td>
                            <td><a href="?favoritePlayerId=${squad.id}&teamId=${id}" class="waves-effect waves-light red-text" title="favorite ${squad.name}"><i class="material-icons">favorite_outline</i></a></td>
                        </tr>`
            })
            document.getElementById('squad').innerHTML = html1
        })
}

function getTeamUpcomingMatches() {
    var urlParams = new URLSearchParams(window.location.search)
    var id = urlParams.get("id")
    var request = new Request(base_url + "teams/" + id + "/matches?limit=5&status=SCHEDULED", {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var htmlcache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    data.matches.forEach(function (match) {
                        var tgl = tglIndo(new Date(match.utcDate))
                        var jam = jamIndo(new Date(match.utcDate))
                        if (id == match.homeTeam.id) {
                            type = 'Home'
                        } else {
                            type = 'Away'
                        }
                        htmlcache += `<li class="collection-header">
                                    <h6 class="row"><strong>${match.competition.name}</strong><span class="right">${type}</span></h6>
                                </li>
                                <li class="collection-item row">
                                    <div>${tgl}</div>
                                    <p class="col">${match.homeTeam.name}</p>
                                    <p class="col">( ${jam} )</p>
                                    <p class="col">${match.awayTeam.name}</p>
                                </li>`
                    })
                    document.getElementById("upcomingMatches").innerHTML = htmlcache;
                })
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            data.matches.forEach(function (match) {
                var tgl = tglIndo(new Date(match.utcDate))
                var jam = jamIndo(new Date(match.utcDate))
                if (id == match.homeTeam.id) {
                    type = 'Home'
                } else {
                    type = 'Away'
                }
                html += `<li class="collection-header">
                    <h6 class="row"><strong>${match.competition.name}</strong><span class="right">${type}</span></h6>
                </li>
                <li class="collection-item row">
                    <div>${tgl}</div>
                    <p class="col">${match.homeTeam.name}</p>
                    <p class="col">( ${jam} )</p>
                    <p class="col">${match.awayTeam.name}</p>
                </li>`
            })
            document.getElementById("upcomingMatches").innerHTML = html;
        })
}

function getTeamLatesMatches() {
    var urlParams = new URLSearchParams(window.location.search)
    var id = urlParams.get("id")
    var request = new Request(base_url + "teams/" + id + "/matches?limit=5&status=FINISHED", {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var htmlcache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    data.matches.forEach(function (match) {
                        var tgl = tglIndo(new Date(match.utcDate))
                        if (id == match.homeTeam.id) {
                            type = 'Home'
                        } else {
                            type = 'Away'
                        }
                        htmlcache += `<li class="collection-header">
                                    <h6 class="row"><strong>${match.competition.name}</strong><span class="right">${type}</span></h6>
                                </li>
                                <li class="collection-item row">
                                    <div>${tgl}</div>
                                    <p class="col">${match.homeTeam.name}</p>
                                    <p class="col">( ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} )</p>
                                    <p class="col">${match.awayTeam.name}</p>
                                </li>`
                    })
                    document.getElementById("latesMatches").innerHTML = htmlcache;
                })
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            data.matches.forEach(function (match) {
                var tgl = tglIndo(new Date(match.utcDate))
                if (id == match.homeTeam.id) {
                    type = 'Home'
                } else {
                    type = 'Away'
                }
                html += `<li class="collection-header">
                    <h6 class="row"><strong>${match.competition.name}</strong><span class="right">${type}</span></h6>
                </li>
                <li class="collection-item row">
                    <div>${tgl}</div>
                    <p class="col">${match.homeTeam.name}</p>
                    <p class="col">( ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam} )</p>
                    <p class="col">${match.awayTeam.name}</p>
                </li>`
            })
            document.getElementById("latesMatches").innerHTML = html;
        })
}

function getTeamFavById(id) {
    var request = new Request(base_url + "teams/" + id, {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var htmlcache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    htmlcache = `<tr>
                                    <td><img src="${data.crestUrl}" height="30"></td>
                                    <td>${data.name}</td>
                                    <td>${data.venue}</td>
                                    <td>
                                        <a href="./detail.html?id=${data.id}" class="waves-effect waves-light" title="view ${data.name} detail"><i class="material-icons">info_outline</i></a>
                                        <a href="?delFavoriteTeamId=${team.id}" class="waves-effect waves-light red-text" title="delete ${data.name} from favorite"><i class="material-icons">close</i></a>
                                    </td>
                                </tr>`
                });
                document.getElementById("teams").innerHTML += htmlcache;
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            html = `<tr>
                        <td><img src="${data.crestUrl}" height="30"></td>
                        <td>${data.name}</td>
                        <td>${data.venue}</td>
                        <td>
                            <a href="./detail.html?id=${data.id}" class="waves-effect waves-light" title="view ${data.name} detail"><i class="material-icons">info_outline</i></a>
                            <a href="?delFavoriteTeamId=${data.id}" class="waves-effect waves-light red-text" title="delete ${data.name} from favorite"><i class="material-icons">close</i></a>
                        </td>
                    </tr>`
            document.getElementById("teams").innerHTML += html;
        })
}

function getPlayerFavById(id) {
    var request = new Request(base_url + "players/" + id, {
        headers: new Headers({
            'X-Auth-token': API_KEY
        })
    })
    var html = ``
    var htmlcache = ``

    if ('caches' in window) {
        caches.match(request).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var tgl = tglIndo(new Date(data.dateOfBirth))
                    htmlcache = `<tr>
                                        <td>${data.name}</td>
                                        <td>${tgl}</td>
                                        <td>${data.nationality}</td>
                                        <td>${data.position}</td>
                                        <td><a href="?delFavoritePlayerId=${data.id}&teamId=${id}" class="waves-effect waves-light red-text" title="remove ${data.name} from favorite"><i class="material-icons">close</i></a></td>
                                    </tr>`
                });
                document.getElementById("Players").innerHTML += htmlcache;
            }
        })
    }

    fetch(request)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data)
            var tgl = tglIndo(new Date(data.dateOfBirth))
            html = `<tr>
                                <td>${data.name}</td>
                                <td>${tgl}</td>
                                <td>${data.nationality}</td>
                                <td>${data.position}</td>
                                <td><a href="?delFavoritePlayerId=${data.id}&teamId=${id}" class="waves-effect waves-light red-text" title="remove ${data.name} from favorite"><i class="material-icons">close</i></a></td>
                            </tr>`
            document.getElementById("Players").innerHTML += html;
        })
}

function namaBulan(i) {
    var bulan = ["Januari", "Februari", "Maret", "april", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    return bulan[i]
}

function tglIndo(date) {
    var bulan = namaBulan(date.getMonth())
    return date.getDate() + " " + bulan + " " + date.getFullYear()
}

function jamIndo(date) {
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    return hours + ":" + minutes
}
