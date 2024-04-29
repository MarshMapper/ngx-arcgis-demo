import { TestBed } from '@angular/core/testing';

import { GeoDistanceService } from './geo-distance.service';

describe('GeoDistanceService', () => {
  let service: GeoDistanceService;
  let testData = [
    {
      lat1: 37.7749,
      lon1: -122.4194,
      lat2: 37.7749,
      lon2: -122.4194,
      distance: 0
    },
    {
      lat1: 37.7749,
      lon1: -122.4194,
      lat2: 37.7251,
      lon2: -122.5200,
      distance: 10.435266
    },
    {
      lat1: 37.7749,
      lon1: -123.4194,
      lat2: 39.7751,
      lon2: -122.4201,
      distance: 238.6823430
    },    
    {
      lat1: 44.7749,
      lon1: -122.4194,
      lat2: 37.7751,
      lon2: -79.4200,
      distance: 3632.519
    },
    {
      lat1: 44.7749,
      lon1: -79.4194,
      lat2: 44.2134,
      lon2: -79.9876,
      distance: 77.00217
    },
    {
      lat1: 12.7749,
      lon1: 122.4194,
      lat2: 14.7751,
      lon2: 122.4200,
      distance: 222.4121
    },
    {
      lat1: 3.7749,
      lon1: 72.789,
      lat2: 3.4751,
      lon2: 72.4201,
      distance: 52.793932
    },
    {
      lat1: 67.7749,
      lon1: 12.4194,
      lat2: 67.7751,
      lon2: 12.4202,
      distance: 0.040332
    }
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoDistanceService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  testData.forEach(data => {
    it(`should calculate distance between points, using( lat1 ${data.lat1}, lon1 ${data.lon1},  lat2 ${data.lat2}, lon2 ${data.lon2}`,  () => {
      expect(service.cosineDistanceBetweenPoints(data.lat1, data.lon1, data.lat2, data.lon2)).toBeCloseTo(data.distance, 2);
    });
    it(`should determine if 2 points are within 10 km, using( lat1 ${data.lat1}, lon1 ${data.lon1},  lat2 ${data.lat2}, lon2 ${data.lon2}`,  () => {
      if (data.distance <= 10) {
        expect(service.isPointWithinRadius(data.lat1, data.lon1, data.lat2, data.lon2)).toBeTrue();
      } else {  
        expect(service.isPointWithinRadius(data.lat1, data.lon1, data.lat2, data.lon2)).toBeFalse();
      }
    });
  });
});
