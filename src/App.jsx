import { useState } from "react";
import "./App.css";
import { Autocomplete, TextField } from "@mui/material";
import { useDataCity, useConvertHour } from "./hooks";
import useCityOptions from "./hooks/useCityOptions"; // Asegúrate de importar el hook

function App() {
  const [userInfo, setUserInfo] = useState({
    userHour: "",
    userCityStart: "",
    userCityEnd: "",
  });

  const hours = useConvertHour(userInfo); // Llamar al hook de conversión de hora
  const { cityOptions, fetchCityOptions } = useCityOptions(); // Usar el hook de ciudades

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCityInputChange = (event, newValue) => {
    fetchCityOptions(newValue);
  };

  const handleSubmit = () => {
    if (userInfo.userCityStart && userInfo.userCityEnd) {
      // El hook useDataCity ya maneja las llamadas API
    } else {
      console.error("Por favor, selecciona ambas ciudades.");
    }
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
            options={cityOptions.map((option) => ({
              ...option,
              label: `${option.name}, ${option.country}`,
            }))}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) =>
              option.geonameid === value.geonameid
            } // Compara por geonameid o un campo único
            onInputChange={handleCityInputChange}
            onChange={(event, newValue) => {
              setUserInfo((prev) => ({
                ...prev,
                userCityStart: newValue ? newValue.label : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Primera ciudad"
                variant="outlined"
              />
            )}
          />

          <Autocomplete
            options={cityOptions.map((option) => ({
              ...option,
              label: `${option.name}, ${option.country}`,
            }))}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) =>
              option.geonameid === value.geonameid
            }
            onInputChange={handleCityInputChange}
            onChange={(event, newValue) => {
              setUserInfo((prev) => ({
                ...prev,
                userCityEnd: newValue ? newValue.label : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Segunda ciudad"
                variant="outlined"
              />
            )}
          />

          <button onClick={handleSubmit}>Search</button>
        </div>
        <div className="informacion">
          <h3>
            {userInfo.userCityStart
              ? userInfo.userCityStart
              : "Ciudad no seleccionada"}
          </h3>
          <p>Horario inicial: {hours.firstCityHours}</p>
          <h3>
            {userInfo.userCityEnd
              ? userInfo.userCityEnd
              : "Ciudad no seleccionada"}
          </h3>
          <p>Horario final: {hours.secondCityHours}</p>
        </div>
      </section>
    </>
  );
}

export default App;
