import { useState } from "react";

const useCityOptions = (city) => {
  // Estado para almacenar las opciones de la ciudad
  const [cityOptions, setCityOptions] = useState([]);

  // Función para realizar la búsqueda de ciudades
  const fetchCityOptions = async (city) => {
    setCityOptions([]); // Limpiar las opciones anteriores
    console.log(city)

    const username = "tomasduro"; // Cambia esto por tu nombre de usuario de Geonames
    const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=10&lang=es&username=${username}`;

    try {
      // Realizar la llamada a la API
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.geonames && data.geonames.length > 0) {
        // Extraer los nombres de las ciudades y el país
        const cityResults = data.geonames.map((result) => ({
          name: result.toponymName,
          country: result.countryName, // Incluye el país
        }));

        // Filtrar los resultados que coinciden parcialmente con la ciudad ingresada
        const filteredResults = cityResults.filter((result) =>
          result.name.toLowerCase().includes(city.toLowerCase())
        );

        // Si hay resultados, actualizar el estado de las opciones de ciudad
        if (filteredResults.length > 0) {
          setCityOptions((prevState) => {
            // Asegurarse de que no haya duplicados
            return [...new Set([...prevState, ...filteredResults])];
          });
        }
      }
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  return { cityOptions, fetchCityOptions };
};

export default useCityOptions;
