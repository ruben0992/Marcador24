const API_KEY = "1d8e2196aea2407e5d9353fd2812d237";
const BASE_URL = "https://v3.football.api-sports.io/";

async function fetchData(endPoint) {
  try {
    const apiURL = BASE_URL + endPoint;
    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "1d8e2196aea2407e5d9353fd2812d237",
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
      redirect: "follow",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById('wg-api-football-games');
  const dateInput = document.getElementById('data-date');

  const today = new Date().toISOString().split('T')[0];
  widget.setAttribute('data-date', today); 


  
});




