import React, { useEffect, useRef, useState } from "react";

import "./MainSearcherPage.css";

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
}

function MainSearcherPage() {
  const inputReference = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [weatherData, setWeatherData] = useState<CityWeatherData[]>([]);

  useEffect(() => {
    console.log(weatherData);
  }, [weatherData]);

  const pullWeatherData = async (city: string) => {
    const data = await fetch(`https://weatherdbi.herokuapp.com/data/weather/${city}`);
    const json: CityWeatherData = await data.json();

    let permissionToAddData = true;

    weatherData.map((weather) => {
      if (weather.region == json.region) {
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
      </div>
    </div>
  )
}

export default MainSearcherPage;