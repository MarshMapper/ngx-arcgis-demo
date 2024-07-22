# ngx-arcgis-demo
Demo project integrating [ArcGIS Maps SDK for JavaScript (4.29)](https://developers.arcgis.com/javascript/latest/) 
and [Calcite Web Comoponents](https://developers.arcgis.com/javascript/latest/calcite-design-system/) with Angular 
and Angular Material 17.x for navigation and layout.  An inital goal was to integrate real-time data from external 
APIs with the high-level components provided in the SDK. These include the 
[eBird API](https://documenter.getpostman.com/view/664302/S1ENwy59) for observation data and NOAA APIs
for weather and tides.

## Demo
The project is automatically deployed to Azure using GitHub Actions each time changes are merged.  It is deployed as a
Static Web App that uses the Azure CDN for caching and delivery:  
[https://icy-wave-0bf8df410.5.azurestaticapps.net/](https://icy-wave-0bf8df410.5.azurestaticapps.net/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3 and can
be built and deployed using the standard Angular CLI commands.  It uses the "application" build target.  Addtionally,
it uses the dotenv-run wrapper around the dotenv package to access environment variables.  A required environment variable
for the eBird API is the API key.  This can be obtained by creating an account at the eBird website and generating a key.
The key should be stored in a .env file in the root of the project.  The .env file is not included in the repository but should have the following format:

NG_APP_EBIRD_API_KEY=xxxxxxxxxxxx

**Important**: Please review the [eBird API Terms of Use](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/)

## Development server
All other functionality should be available with no additional configuration.  

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.  The current Angular "application"
build process generates a large number of "chunk" files.  These can be served from a static web server but typiclally some
type of server-side redirect is required for routing in case the user referehes the page or navigates directly to a route. 
HTTP/2 is assumed / highly recommended for serving the application due to the large number of small files.

## Azure Deployment
To define the eBird API key for Azure deployment, the key should be stored in a GitHub secret.  The secret is referenced in the workflow file azure-static-web-apps.yml

        env:
          NG_APP_EBIRD_API_KEY: ${{ secrets.NG_APP_EBIRD_API_KEY }}

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Roadmap
- Show more detailed information about the bird sightings in popup or separate panel.
- Show lists / tables of features shown on map in separate, responsive panel.
- Possibly make services more reusable and move into library.
- Add stronger typing for external components and services.