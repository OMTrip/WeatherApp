import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { fetchweatherForecast } from "../components/Utlis/api";
import { translations } from "../components/Utlis/translations";

const HomeScreen = () => {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [backgroundImage, setBackgroundImage] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const languages = [
    { code: "en", label: "English", icon: "🇺🇸" },
    { code: "es", label: "Spanish", icon: "🇪🇸" },
    { code: "hi", label: "Hindi", icon: "🇮🇳" },
  ];
  const t = translations[language];

  useEffect(() => {
    fetchWeatherForCurrentLocation();
  }, [language]);

  const fetchWeatherForCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setIsLoading(true);

      const weatherData = await fetchweatherForecast({
        cityName: `${location.coords.latitude},${location.coords.longitude}`,
        days: 3,
        lang: language,
      });

      if (weatherData) {
        setWeather(weatherData);
        updateBackground(weatherData?.current?.condition?.text);
      } else {
        Alert.alert("Error", "Unable to fetch weather data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while fetching location data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySearch = async (city) => {
    if (!city) {
      Alert.alert("Input Error", "Please enter a valid city name.");
      return;
    }

    try {
      setIsLoading(true);
      const weatherData = await fetchweatherForecast({
        cityName: city,
        days: 3,
        lang: language,
      });

      if (weatherData) {
        setWeather(weatherData);
        updateBackground(weatherData?.current?.condition?.text);
      } else {
        Alert.alert("Error", "City not found. Try another.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while searching for the city.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackground = (condition) => {
    let image;
    if (condition?.includes("Rain")) {
      image = require("../assets/images/rain.jpg");
    } else if (condition?.includes("Sunny")) {
      image = require("../assets/images/summer.jpg");
    } else if (condition?.includes("Cloud")) {
      image = require("../assets/images/cloud.jpg");
    } else {
      image = require("../assets/images/Sunnyweather.jpg");
    }
    setBackgroundImage(image);
  };

  const toggleUnit = () => setUnit(unit === "metric" ? "imperial" : "metric");

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.languageSidebar}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageIcon,
              language === lang.code && styles.selectedLanguage, 
              { zIndex: 999 },
            ]}
            onPress={() => {
              console.log(`Language selected: ${lang.code}`);
              setLanguage(lang.code);
            }}
          >
            <Text style={styles.languageText}>{lang.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          placeholderTextColor="gray"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleCitySearch(searchInput)}
        >
          <Text style={styles.searchButtonText}>{t.searchPlaceholder}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <Text style={styles.loading}>{t.loading}</Text>
        ) : weather?.current ? (
          <>
            <View
              style={{
                position: "relative",
                bottom: "80",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.title}>{weather.location.name}</Text>
              <Text style={styles.temp}>
                {unit === "metric"
                  ? `${weather.current.temp_c}°C`
                  : `${weather.current.temp_f}°F`}
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <Text style={styles.CardTitle}>{t.humidity}:</Text>
                <Text style={styles.details}>
                  {weather?.current?.humidity}%
                </Text>
              </View>
              <View style={styles.windSpeed}>
                <Text style={styles.CardTitle}>{t.windSpeed}:</Text>
                <Text style={styles.details}>
                  {weather.current.wind_kph} km/h
                </Text>
              </View>
              <View style={styles.condition}>
                <Text style={styles.CardTitle}>{t.condition}:</Text>
                <Text style={styles.details}>
                  {weather?.current?.condition?.text}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={toggleUnit}
                style={[styles.button, { width: "70%" }]}
              >
                <Text style={styles.buttonText}>
                  {`${t.switchTo} ${
                    unit === "metric" ? "Fahrenheit" : "Celsius"
                  }`}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.loading}>{t.searchWeather}</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  languageSidebar: {
    position: "absolute",
    left: 10,
    top: 100,
    flexDirection: "column",
  },
  languageIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedLanguage: {
    backgroundColor: "#007BFF",
  },
  languageText: {
    color: "#fff",
    fontSize: 20,
  },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    flexDirection: "row",
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    justifyContent: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },

  loading: {
    fontSize: 20,
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  datalist: {
    backgroundColor: "red",
    width: "100%",
    justifyContent: "space-around ",
  },
  detailRow: {
    flexDirection: "column",
    justifyContent: "center",
  },
  windSpeed: {
    flexDirection: "column",
    justifyContent: "center",
  },
  condition: {
    flexDirection: "column",
    justifyContent: "center",
  },
  details: {
    alignItems: "center",
    marginTop: "8",
    fontSize: 15,
    color: "#333",
  },
  CardTitle: {
    alignItems: "center",
    fontSize: 12,
    color: "#333",
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop:"10",
    backgroundColor: '#007BFF',  
    borderRadius: 8,            
    paddingVertical: 15,
    alignItems: 'center',       
    justifyContent: 'center',   
  },
  buttonText: {
    paddingLeft:'15',
    paddingRight:"15",
    fontSize: 16,               
    color: 'white',              
    fontWeight: 'bold',         
  },
});

export default HomeScreen;
