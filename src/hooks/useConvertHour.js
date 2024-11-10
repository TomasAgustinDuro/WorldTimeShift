import { useState, useEffect } from "react";
import moment from "moment-timezone";
import useDataCity from "./UseDataCity";

const useConvertHour = (userInfo) => {
  const [hours, setHours] = useState({
    firstCityHours: "",
    secondCityHours: "",
  });

  const { continent, fetchDataCity } = useDataCity();

  useEffect(() => {
    if (userInfo.userCityStart && userInfo.userCityEnd && userInfo.userHour) {
      // Llamamos a fetchDataCity para obtener los continentes
      fetchDataCity(userInfo.userCityStart, userInfo.userCityEnd);
    }
  }, [userInfo, fetchDataCity]);

  useEffect(() => {
    if (continent.continentStart && continent.continentEnd && userInfo.userHour) {
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

  return hours;
};

export default useConvertHour;
