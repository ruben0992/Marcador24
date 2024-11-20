const API_KEY = "cb3407371ea266d841616b1400dbdc81";
const BASE_URL = "https://v3.football.api-sports.io/";

const translations = {
  Standings: "Clasificación",
  HalfTime: "Descanso",
  League: "Liga",
  Score: "Puntuación",
  EVENTS: "RESUMEN",
  ALL: "TODOS",
  LIVE: "EN DIRECTO",
  FINISHED: "TERMINADOS",
  SCHEDULED: "PROGRAMADOS",
  TODAY: "HOY",
  Two: "Dos",
  "First Half": "Primera Parte",
  "Second Half": "Secunda Parte",
  "Non Liga Div One": "Primera división fuera de la liga",
  "Frauen Bundesliga": "Bundesliga femenina",
  "1. Division": "Primera división",
  "Second Liga": "Segunda liga",
  "First Liga": "Primera Liga",
  "Premijer Liga": "Primera Liga",
  "Prva Liga": "Primera Liga",
  "Esiliiga A": "Liga Premier A",
  "Druha Liga": "Segunda Liga",
  "Division di Honor": "División de Honor",
  "Girone H": "Grupo H",
  "Reserve Pro Liga": "Reserva Pro Liga",
  "Ýokary Liga": "Primera Liga",
  "Liga MX Femenil": "Liga MX Femenina",
  "Premier Liga 2 Division One": "Primera División 2 de la Premier Liga",
  // Otros elementos de traducción aquí...
};

document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("wg-api-football-fixtures");

  if (!widget) {
    console.error(
      "El widget con el ID 'wg-api-football-fixtures' no se encuentra en el DOM."
    );
    return;
  }

  setTimeout(() => {
    const elements = widget.getElementsByTagName("*");
    console.log(elements);
    for (let el of elements) {
      for (let key in translations) {
        if (el.innerHTML.includes(key)) {
          el.innerHTML = el.innerHTML.replace(
            new RegExp(key, "g"),
            translations[key]
          );
        }
      }
    }
  }, 2000); // Ajusta el tiempo según la carga del widget
});

document.addEventListener("click", function (event) {
  let leagueCard = event.target.closest(".competition-card");
  if (!leagueCard) return;
  event.preventDefault();

  let id = leagueCard.getAttribute("data-league");
  let fixtures = document.getElementById("wg-api-football-fixtures");
  fixtures.innerHTML = "";
  fixtures.setAttribute("data-league", id);

  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
});
