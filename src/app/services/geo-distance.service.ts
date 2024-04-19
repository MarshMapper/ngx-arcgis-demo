import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoDistanceService {
  // the distance calculation is relatively expensive, and we can use the minimum number of km per
  // degree latitude to quickly filter points outside the radius of interest.
  minimumKmPerDegree: number = 110.574;
  searchDistanceKm: number = 10;
  maximumSearchDegrees: number = this.searchDistanceKm / this.minimumKmPerDegree;
  earthRadiusKm: number = 6371;
  radiansPerDegree: number = Math.PI / 180;

  constructor() { }
  // Calculate the distance between two points on the Earth's surface 
  // using the spherical law of cosines. 
  cosineDistanceBetweenPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
    lat1 *= this.radiansPerDegree;
    lon1 *= this.radiansPerDegree;
    lat2 *= this.radiansPerDegree;
    lon2 *= this.radiansPerDegree;

    return Math.acos(Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.cos(lon2 - lon1)) * this.earthRadiusKm;
  }
  // isPointWithinRadius returns true if the distance between the two points is less than the search distance
  isPointWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number): boolean {
    if (Math.abs(lat1 - lat2) > this.maximumSearchDegrees) {
      return false;
    }
    return this.cosineDistanceBetweenPoints(lat1, lon1, lat2, lon2) <= this.searchDistanceKm;
  }
}
