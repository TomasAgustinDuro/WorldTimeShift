import { useState, useEffect } from "react";
import "./App.css";
import moment from "moment-timezone";
import { Autocomplete, TextField } from "@mui/material";

function App() {
  // Guardar el horaria del usuario.
  const [userInfo, setUserInfo] = useState({
    userHour: "",
    userCityStart: "",
    userCityEnd: "",
  });

  // Guarda el continente obtenido de API.
  const [continent, setContinent] = useState({
    continentStart: "",
    continentEnd: "",
  });

  // Guardar la hora original y la hora convertida a la ciudad elegida.
  const [hours, setHours] = useState({
    firstCityHours: "",
    secondCityHours: "",
  });

  // Para luego definir opciones de búsqueda
  const [cityOptions, setCityOptions] = useState([]);

  // Opciones para países
  // Opciones para países
  const fetchDataOptions = (city) => {
    setCityOptions([]);
    const username = "tomasduro";  // Cambia esto por tu nombre de usuario de Geonames
    const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=10&lang=es&username=${username}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.geonames && data.geonames.length > 0) {
          const cityResults = data.geonames.map((result) => result.toponymName); // Usamos `toponymName` para obtener el nombre de la ciudad

          // Filtrar los resultados que coinciden parcialmente
          const filteredResults = cityResults.filter((result) =>
            result.toLowerCase().includes(city.toLowerCase()) // Coincidencia parcial
          );

          if (filteredResults.length > 0) {
            setCityOptions((prevState) => {
              // Asegurarse de que no haya duplicados
              return [...new Set([...prevState, ...filteredResults])];
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
};

  
  
  // Llamar a la API que nos proporcionará el continente
  const fetchDataCity = async (cityOne, cityTwo) => {
    const urlStart = `https://api.opencagedata.com/geocode/v1/json?q=${cityOne}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;
    const urlEnd = `https://api.opencagedata.com/geocode/v1/json?q=${cityTwo}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=en&pretty=1`;

    // OpenCage tiene un apartado para timezone que viene con formato Continent/City revisar
    fetch(urlStart)
      .then((response) => response.json())
      .then((data) =>
        setContinent((prevState) => ({
          ...prevState,
          continentStart:
            data.results[0].components.continent === "South America" ||
            data.results[0].components.continent === "North America"
              ? "America"
              : data.results[0].components.continent,
        }))
      );

    fetch(urlEnd)
      .then((response) => response.json())
      .then((data) =>
        setContinent((prevState) => ({
          ...prevState,
          continentEnd:
            data.results[0].components.continent === "South America" ||
            data.results[0].components.continent === "North America"
              ? "America"
              : data.results[0].components.continent,
        }))
      );
  };

  // Obtener valor de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userHour") {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (
      continent.continentStart &&
      continent.continentEnd &&
      userInfo.userHour
    ) {
      const firstCity = moment.tz(
        userInfo.userHour,
        "YYYY-MM-DD HH:mm",
        `${continent.continentStart}/${userInfo.userCityStart}`
      );
      if (!firstCity.isValid()) {
        console.error("Hora no válida para la ciudad de inicio");
      }

      const secondCity = firstCity
        .clone()
        .tz(`${continent.continentEnd}/${userInfo.userCityEnd}`);
      if (!secondCity.isValid()) {
        console.error("Hora no válida para la ciudad de destino");
      }

      setHours({
        firstCityHours: firstCity.format("HH:mm"),
        secondCityHours: secondCity.format("HH:mm"),
      });
    }
  }, [continent, userInfo]);

  // Obtener valores, llamar a la api y armar moment.js
  const handleSubmit = () => {
    console.log("cities", userInfo.userCityStart, userInfo.userCityEnd);
    console.log("horario usuario", userInfo.userHour);
    fetchDataCity(userInfo.userCityStart, userInfo.userCityEnd);
  };
  return (
    <>
      <section>
        <div className="form">
          <h2>World Time Shift</h2>
          <input
            type="datetime-local"
            onChange={handleChange}
            name="userHour"
          />

          <Autocomplete
            options={cityOptions}
            onInputChange={(event, value) => fetchDataOptions(value)}
            onChange={(event, newValue) => {
              let cityTest = newValue
                .split(",")[0]
                .replace(/[áéíóú]/g, (match) => {
                  const replacements = {
                    á: "a",
                    é: "e",
                    í: "i",
                    ó: "o",
                    ú: "u",
                  };
                  return replacements[match];
                })
                .replace(/\s+/g, "_"); // Reemplazar los espacios por guiones bajos
              setUserInfo((prev) => ({
                ...prev,
                userCityStart: cityTest || "", // Actualiza la ciudad de inicio
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Primera ciudad"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000", // Cambia el borde a negro
                    },
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#000", // Cambia el color del label a negro
                    },
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={cityOptions}
            onInputChange={(event, value) => fetchDataOptions(value)}
            onChange={(event, newValue) => {
              let cityTest = newValue
                .split(",")[0]
                .replace(/[áéíóú]/g, (match) => {
                  const replacements = {
                    á: "a",
                    é: "e",
                    í: "i",
                    ó: "o",
                    ú: "u",
                  };
                  return replacements[match];
                })
                .replace(/\s+/g, "_"); // Reemplazar los espacios por guiones bajos

              setUserInfo((prev) => ({
                ...prev,
                userCityEnd: cityTest || "", // Actualiza la ciudad de inicio
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Segunda ciudad"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000", // Cambia el borde a negro
                    },
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#000", // Cambia el color del label a negro
                    },
                  },
                }}
              />
            )}
          />

          <button onClick={handleSubmit}>Search</button>
        </div>

        <div className="informacion">
          <h3>{userInfo.userCityStart.replace(/_/g, " ")}</h3>{" "}
          {/* Reemplaza guion bajo por espacio */}
          <p>Horario inicial: {hours.firstCityHours}</p>
          <h3>{userInfo.userCityEnd.replace(/_/g, " ")}</h3>{" "}
          {/* Reemplaza guion bajo por espacio */}
          <p>Horario final: {hours.secondCityHours}</p>
        </div>
      </section>
    </>
  );
}

export default App;
