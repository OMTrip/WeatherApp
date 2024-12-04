import axios from "axios";

const API_KEY = "e711f6a99227484595b135602240312";
const forecastendpoint = (params) =>
  `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationcastendpoint = (params) =>
  `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const callApi = async (endpoint) => {
  const otpions = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(otpions);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const fetchweatherForecast = (endpoint) => {
  return callApi(forecastendpoint(endpoint));
};

export const fetchweatherlocation = (endpoint) => {
  return callApi(locationcastendpoint(endpoint));
};
