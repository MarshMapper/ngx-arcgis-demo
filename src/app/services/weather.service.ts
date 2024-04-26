import { Injectable } from '@angular/core';
import esriRequest from '@arcgis/core/request';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  pointsBaseUrl: string = 'https://api.weather.gov/points/';
  weatherActionId: string = "weather-here";

  constructor() { }
  getWeatherAction(): any {
    return {
      title: "Weather",
      id:  this.weatherActionId,
      image: "/assets/images/nws-16x16.png"
    };
  }
  getWeatherActionId(): string {
    return this.weatherActionId;
  }
  getWeatherPredictions(popup: any): Promise<any> {
    let url: string = `${this.pointsBaseUrl}${popup.location.latitude},${popup.location.longitude}`;
    return esriRequest(url)
      .then((response: any) => {
        let properties = response.data.properties;
        return esriRequest(properties.forecast)
          .then((response: any) => {
            return response.data.properties;
          });
      });
  }
}
