import { useState } from "react";

const useDataCity = () => {
  const [continent, setContinent] = useState({
    continentStart: "",
    continentEnd: "",
  });

  const fetchDataCity = async (cityOne, cityTwo) => {
    // Limpiar las entradas de ciudad para que solo contengan el nombre de la ciudad
    const cleanedCityOne = cityOne.split(",")[0].trim();
    const cleanedCityTwo = cityTwo.split(",")[0].trim();

    const urlStart = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cleanedCityOne)}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;
    const urlEnd = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cleanedCityTwo)}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;

    try {
      // Obtener el continente para cityOne
      const responseStart = await fetch(urlStart);
      const dataStart = await responseStart.json();
      console.log(dataStart);
      
      if (dataStart.results && dataStart.results.length > 0) {
        setContinent((prevState) => ({
          ...prevState,
          continentStart:
            dataStart.results[0].components.continent === "South America" ||
            dataStart.results[0].components.continent === "North America"
              ? "America"
              : dataStart.results[0].components.continent,
        }));
      } else {
        console.error("No se encontraron resultados para cityOne");
      }

      // Obtener el continente para cityTwo
      const responseEnd = await fetch(urlEnd);
      const dataEnd = await responseEnd.json();
      
      if (dataEnd.results && dataEnd.results.length > 0) {
        setContinent((prevState) => ({
          ...prevState,
          continentEnd:
            dataEnd.results[0].components.continent === "South America" ||
            dataEnd.results[0].components.continent === "North America"
              ? "America"
              : dataEnd.results[0].components.continent,
        }));
      } else {
        console.error("No se encontraron resultados para cityTwo");
      }
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  return { continent, fetchDataCity };
};

export default useDataCity;
