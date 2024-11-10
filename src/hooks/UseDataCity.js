import { useState } from "react";

const useDataCity = () => {
  const [continent, setContinent] = useState({
    continentStart: "",
    continentEnd: "",
  });

  const fetchDataCity = async (cityOne, cityTwo) => {
    const urlStart = `https://api.opencagedata.com/geocode/v1/json?q=${cityOne}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;
    const urlEnd = `https://api.opencagedata.com/geocode/v1/json?q=${cityTwo}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;

    try {
      // Obtener el continente para cityOne
      const responseStart = await fetch(urlStart);
      const dataStart = await responseStart.json();
      console.log(dataStart)
      setContinent((prevState) => ({
        ...prevState,
        continentStart:
          dataStart.results[0].components.continent === "South America" ||
          dataStart.results[0].components.continent === "North America"
            ? "America"
            : dataStart.results[0].components.continent,
      }));

      // Obtener el continente para cityTwo
      const responseEnd = await fetch(urlEnd);
      const dataEnd = await responseEnd.json();
      setContinent((prevState) => ({
        ...prevState,
        continentEnd:
          dataEnd.results[0].components.continent === "South America" ||
          dataEnd.results[0].components.continent === "North America"
            ? "America"
            : dataEnd.results[0].components.continent,
      }));
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  return { continent, fetchDataCity };
};

export default useDataCity;
