// ID-ul echipei implicite (Real Madrid)
const defaultTeamId = 541;

// Funcție pentru afișarea meciurilor echipei implicite
function loadDefaultTeam() {
    const teamName = document.getElementById("teamName");
    teamName.value = "Real Madrid"; // Setăm numele echipei în bara de căutare
    fetchTeamMatches(defaultTeamId);
}

// Funcția pentru preluarea meciurilor unei echipe după ID
function fetchTeamMatches(teamId) {
    fetch(`https://v3.football.api-sports.io/fixtures?season=2024&team=${teamId}`, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "cb3407371ea266d841616b1400dbdc81"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.response && data.response.length > 0) {
            displayMatches(data.response); // Afișăm meciurile echipei
        } else {
            const container = document.getElementById("matchesContainer");
            container.innerHTML = "<p>No matches found for Real Madrid in the current season.</p>";
        }
    })
    .catch(error => console.error("Error fetching matches:", error));
}

// Apelăm funcția `loadDefaultTeam` la încărcarea paginii
document.addEventListener("DOMContentLoaded", () => {
    loadDefaultTeam();
});


const API_HOST = "v3.football.api-sports.io";
const API_KEY = "cb3407371ea266d841616b1400dbdc81";

// Funcție pentru căutarea echipei după nume
async function searchTeam(teamName) {
    const response = await fetch(`https://${API_HOST}/teams?search=${teamName}`, {
        headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY
        }
    });
    const data = await response.json();
    return data.response[0]; // Returnăm prima echipă găsită
}

// Funcție pentru obținerea meciurilor echipei pentru sezonul curent
async function getMatches(teamId) {
    const currentYear = new Date().getFullYear(); // Obținem anul curent
    const response = await fetch(`https://${API_HOST}/fixtures?team=${teamId}&season=${currentYear}`, {
        headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY
        }
    });
    const data = await response.json();
    return data.response; // Returnăm doar lista meciurilor
}

// Funcție pentru afișarea meciurilor în interfață
function displayMatches(matches) {
    const container = document.getElementById("matchesContainer");
    container.innerHTML = ""; 

    if (matches.length === 0) {
        container.innerHTML = "<p>No se han encontrado partidos esta temporada.</p>";
        return;
    }

    // Sortăm meciurile în ordine crescătoare a datei
    matches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    matches.forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("match");

        const homeGoals = match.goals.home;
        const awayGoals = match.goals.away;
        const status = match.fixture.status.short; 
        const matchTime = new Date(match.fixture.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, 
        });

        let scoreDisplay = "";
        if (status === "PST") {
            scoreDisplay = "Aplazado"; 
        } else if (homeGoals !== null && awayGoals !== null) {
            scoreDisplay = `${homeGoals} - ${awayGoals}`; 
        } else {
            scoreDisplay = matchTime; 
        }

        // Construim elementul HTML pentru fiecare meci
        matchElement.innerHTML = `
            <div class="match-header">
                <img src="${match.league.logo}" alt="${match.league.name}" class="competition-logo">
                <h3>${match.league.name}</h3>
            </div>
            <div class="match-teams">
                <div class="team">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                    <span>${match.teams.home.name}</span>
                </div>
                <span class="score">${scoreDisplay}</span>
                <div class="team">
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
                    <span>${match.teams.away.name}</span>
                </div>
            </div>
            <p>Fecha: ${new Date(match.fixture.date).toLocaleDateString()}</p>
        `;
        container.appendChild(matchElement);
    });
}

// Funcția principală pentru căutare și afișare
async function fetchTeamMatches() {
    const teamName = document.getElementById("teamName").value.trim();
    if (!teamName) {
        alert("Por favor introduce el nombre del equipo!");
        return;
    }

    try {
        // Obținem ID-ul echipei
        const team = await searchTeam(teamName);
        if (!team) {
            alert("Equipo no encontrado");
            return;
        }

        // Obținem meciurile echipei pentru sezonul curent
        const matches = await getMatches(team.team.id);

        // Afișăm meciurile
        displayMatches(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        alert("An error occurred while fetching matches.");
    }
}
