import { Injectable } from '@angular/core';
import esriRequest from '@arcgis/core/request';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  pointsBaseUrl: string = 'https://api.weather.gov/points/';
  weatherActionId: string = "weather-here";

  constructor(private progressService: ProgressService) { }
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
  // get the weather predictions for a given location.  it's a 2 step process.  first get the forecast url
  // from the location, then get the forecast from the url returned
  getWeatherPredictions(popup: any): Promise<any> {
    let url: string = `${this.pointsBaseUrl}${popup.location.latitude},${popup.location.longitude}`;
    this.progressService.setWorkInProgress(true);

    return esriRequest(url)
      .then((response: any) => {

        let properties = response.data.properties;
        // get the actual forecast using the url returned
        return esriRequest(properties.forecast)
          .then((response: any) => {
            this.progressService.setWorkInProgress(false);
            return response.data.properties;
          })
          .catch((error: any) => {
            this.progressService.setWorkInProgress(false);
          });
      })
      .catch((error: any) => {
        this.progressService.setWorkInProgress(false);
      });
  }
}
