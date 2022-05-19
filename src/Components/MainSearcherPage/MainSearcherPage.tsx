import React, { useEffect, useRef, useState } from "react";

import "./searcher_page_styles/MainSearcherPage.css";
import "./city_weather_block_styles/CityWeatherBlock.css"

interface CityWeatherData {
  currentConditions: {
    comment: string,
    dayhour: string,
    humidity: string,
    iconURL: string,
    precip: string
    temp: {
      c: number,
      f: number
    },
    wind: {
      km: number,
      miles: number
    }
  },

  data_source: string,

  next_days: [{
    comment: string,
    day: string,
    iconURL: string,
    max_temp: {
      c: number,
      f: number
    },
    min_temp: {
      c: number,
      f: number
    }
  }],

  region: string,

  status: string
  drawStatus: string
}

function MainSearcherPage() {
  const inputReference = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [weatherData, setWeatherData] = useState<CityWeatherData[]>([]);  

  useEffect(() => {
    displayData();
  }, [weatherData]);

  const removeCity = (city: string) => {
    setWeatherData(weatherData.filter((data) => {
      return data.region.split(',')[0] !== city;
    }));
  }

  const displayData = () => {
    return weatherData.map((data_block) => {
      const wordsArray = data_block.region.split(',');

      return (
        <div key={`${wordsArray[0]}_block`} className="weather_block">
          <div key={`${wordsArray[0]}_data`} className="weather_block_data">
            <h4>{wordsArray[0]}</h4>
            <p className="weather_hour">{data_block.currentConditions.dayhour}</p>
            <p className="weather_comment">{data_block.currentConditions.comment}</p>
            <p className="weather_temp">{`Temperature: ${data_block.currentConditions.temp.c}C / ${data_block.currentConditions.temp.f}F`}</p>
            <p className="weather_humidity_precip">{`Humidity: ${data_block.currentConditions.humidity}, Precip: ${data_block.currentConditions.precip}`}</p>
            <p className="weather_wind">{`Wind: ${data_block.currentConditions.wind.km}kmh`}</p>
            <button onClick={() => removeCity(wordsArray[0])}>Remove</button>
          </div>
          <img className="weather_icon" src={data_block.currentConditions.iconURL} />
        </div>
      )
    })
  }

  const pullWeatherData = async (city: string) => {
    const data = await fetch(`https://weatherdbi.herokuapp.com/data/weather/${city}`);
    const json: CityWeatherData = await data.json();

    let permissionToAddData = true;

    weatherData.forEach((weather) => {
      if (weather.region === json.region) {
        console.log('already added');
        permissionToAddData = false;
      }
    })
    
    if (json.status !== 'fail' && permissionToAddData) {
      setWeatherData(oldArray => [...oldArray, json]);
    }
  }

  const submitCity = () => {
    const city = inputReference.current.value;
    pullWeatherData(city);
  }

  return (
    <div>
      <div className="submitting_block">
        <input ref={inputReference} type='text' placeholder="Type in Your City" />
        <button onClick={submitCity}>Submit</button>
        <div className="weather_container">
          {
            displayData()
          }
        </div>
      </div>
    </div>
  )
}

export default MainSearcherPage;