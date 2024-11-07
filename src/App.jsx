import { useState } from "react";
import "./App.css";
import moment from "moment-timezone";

/*
  Acceder al continente => data.results[0].components.continent
  Acceder al pais => data.results[0].components.country
*/

/*
  Para luego definir opciones de búsqueda
  // const [cityOptions, setCityOptions] = useState({})
*/

function App() {
  // Guardar el horaria del usuario
  const [userInfo, setUserInfo] = useState({
    userHour: "",
    userCityStart: "",
    userCityEnd: "",
  });

  // Guarda el continente obtenido de API
  const [continent, setContinent] = useState({
    continentStart: "",
    continentEnd: "",
  });

  const [hours, setHours] = useState({
    firstCityHours: "",
    secondCityHours: "",
  });

  // Llamar a la API que nos proporcionará el continente
  const fetchDataCity = async (cityOne, cityTwo) => {
    const urlStart = `https://api.opencagedata.com/geocode/v1/json?q=${cityOne}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=es&pretty=1`;
    const urlEnd = `https://api.opencagedata.com/geocode/v1/json?q=${cityTwo}&key=50aa3d82bb2b4d869199b5a59e105aeb&language=es&pretty=1`;

    fetch(urlStart)
      .then((response) => response.json())
      .then((data) =>
        setContinent((prevState) => ({
          ...prevState,
          continentStart: data.results[0].components.continent,
        }))
      );

    fetch(urlEnd)
      .then((response) => response.json())
      .then((data) =>
        setContinent((prevState) => ({
          ...prevState,
          continentEnd: data.results[0].components.continent,
        }))
      );
  };

  // Obtener valor de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Obtener valores, llamar a la api y armar moment.js
  const handleSubmit = () => {
    fetchDataCity(userInfo.userCityStart, userInfo.userCityEnd);

    // Como primer parametro utilizo el horario establecido por el usuario
    // Segundo parametro es el primer continente nombrado
    // Tercer parametro es la primera ciudad
    // El horario debe ir dentro del TZ() para que interprete el horario como si fuese de Madrid, sino toma el horario del sistema y luego lo convierte a Madrid. 
    const firstCity = moment.tz(
      userInfo.userHour,
      "YYYY-MM-DD HH:mm",
      `${continent.continentStart}/${userInfo.userCityStart}`
    );

    // Transformar la zona horaria para retornar el horario deseado
    const secondCity = firstCity
      .clone()
      .tz(`${continent.continentEnd}/${userInfo.userCityEnd}`);

    setHours((prev) => ({
      ...prev,
      firstCityHours: firstCity.format("hh:mm"),
    }));

    setHours((prev) => ({
      ...prev,
      secondCityHours: secondCity.format("hh:mm")
    }));

    console.log("City", continent);
    console.log("Horario:", userInfo.userHour);
    console.log("Ciudad uno", userInfo.userCityStart);
    console.log("Ciudad dos", userInfo.userCityEnd);
    console.log("Estado ciudad uno", continent.continentStart);
    console.log("Estado ciudad dos", continent.continentEnd);
    console.log("Primera ciudad", firstCity.format("hh:mm"));
    console.log("Segunda ciudad", secondCity.format("hh:mm"));
  };

  return (
    <>
      <input type="datetime-local" onChange={handleChange} name="userHour" />

      <input
        type="text"
        placeholder="Ingresar país 1"
        onChange={handleChange}
        name="userCityStart"
      />

      <input
        type="text"
        placeholder="Ingresar país 2"
        onChange={handleChange}
        name="userCityEnd"
      />

      <div>
        <h3>{userInfo.userCityStart}</h3>
        <p>Horario inicial: {hours.firstCityHours}</p>
        <h3>{userInfo.userCityEnd}</h3>
        <p>Horario final: {hours.secondCityHours}</p>
      </div>

      <button onClick={handleSubmit}>Search</button>
    </>
  );
}

export default App;
