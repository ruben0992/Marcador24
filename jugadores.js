const currentYear = new Date().getFullYear();

async function getPlayers(year, league) {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players/topscorers?season=${year}&league=${league}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "cb3407371ea266d841616b1400dbdc81",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Establecer el valor predeterminado de la temporada
  const seasonSelect = document.getElementById("season");
  seasonSelect.value = "2024"; // Establecer el valor de la temporada 2024

  // Obtener ligas y llenar el select
  const leagues = await getLeagues();
  const leagueSelect = document.getElementById("liga");

  // Llenar el select con las ligas populares
  leagues.forEach((league) => {
    const option = document.createElement("option");
    option.value = league.league.id; // El ID de la liga
    option.textContent = league.league.name; // El nombre de la liga
    leagueSelect.appendChild(option);
  });

  // Establecer una liga predeterminada
  leagueSelect.value = "140"; // La liga

  // Realizar la búsqueda automática al cargar la página con la liga 39 y temporada 2024
  const season = seasonSelect.value;
  const leagueId = leagueSelect.value;

  if (season && leagueId) {
    const players = await getPlayers(season, leagueId);
    displayPlayers(players.response); // Mostrar jugadores
  }

  // Agregar el evento para el botón de búsqueda
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", async () => {
    const season = seasonSelect.value; // Año seleccionado
    const leagueId = leagueSelect.value; // ID de la liga seleccionada

    if (season && leagueId) {
      const players = await getPlayers(season, leagueId);
      displayPlayers(players.response); // Mostrar jugadores
    } else {
      alert("Por favor selecciona una liga y una temporada.");
    }
  });
});

async function getLeagues() {
  try {
    const response = await fetch("https://v3.football.api-sports.io/leagues", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "cb3407371ea266d841616b1400dbdc81", // Usa tu propia clave de API
      },
    });
    const data = await response.json();

    const europeanTopLeagues = [
      39, // Premier League (Inglaterra)
      140, // La Liga (España)
      135, // Serie A (Italia)
      78, // Bundesliga (Alemania)
      61, // Ligue 1 (Francia)
      71, // Primeira Liga (Portugal)
      88, // Eredivisie (Países Bajos)
      82, // Süper Lig (Turquía)
      99, // Russian Premier League (Rusia)
    ];

    // Filtra solo las ligas de Europa más populares
    const filteredLeagues = data.response.filter((league) =>
      europeanTopLeagues.includes(league.league.id)
    );

    return filteredLeagues;
  } catch (error) {
    console.error("Error al obtener las ligas:", error);
  }
}

// Función para mostrar los jugadores en el HTML
function displayPlayers(players) {
  const playerProfilesContainer = document.getElementById("player-profiles");

  // Limpiar los jugadores anteriores
  playerProfilesContainer.innerHTML = "";

  // Verificar si hay jugadores
  if (players && players.length > 0) {
    players.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player-profile");

      const playerName = document.createElement("h3");
      playerName.textContent = `${player.player.firstname} ${player.player.lastname}`;

      const playerImage = document.createElement("img");
      playerImage.src = player.player.photo;
      playerImage.alt = `${player.player.firstname} ${player.player.lastname}`;
      playerImage.classList.add("player-photo");

      const playerDetails = document.createElement("div");
      playerDetails.classList.add("player-details");

      const playerAge = document.createElement("p");
      const birthDate = new Date(player.player.birth.date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      playerAge.textContent = `Edad: ${age} años`;

      const playerBirthDate = document.createElement("p");
      playerBirthDate.textContent = `Fecha de nacimiento: ${birthDate.toLocaleDateString()}`;

      const playerNationality = document.createElement("p");
      playerNationality.textContent = `Nacionalidad: ${player.player.nationality}`;

      const playerWeight = document.createElement("p");
      playerWeight.textContent = player.player.weight
        ? `Peso: ${player.player.weight} kg`
        : "Peso no disponible";

      playerDetails.appendChild(playerAge);
      playerDetails.appendChild(playerBirthDate);
      playerDetails.appendChild(playerNationality);
      playerDetails.appendChild(playerWeight);

      const playerTeam = document.createElement("p");
      playerTeam.textContent = player.team
        ? `Equipo: ${player.team.name}`
        : "Equipo no disponible";

      const playerGoals = document.createElement("p");
      playerGoals.textContent = `Goles: ${player.statistics[0].goals.total}`;

      playerElement.appendChild(playerImage);
      playerElement.appendChild(playerName);
      playerElement.appendChild(playerDetails);
      playerElement.appendChild(playerTeam);
      playerElement.appendChild(playerGoals);

      playerProfilesContainer.appendChild(playerElement);
    });
  } else {
    playerProfilesContainer.innerHTML =
      "<p>No hay jugadores disponibles para esta temporada y liga.</p>";
  }
}
