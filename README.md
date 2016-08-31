___NeighborGood___
==================

** Summary **
The NeighborGood app estimates safety, accessibility, and environment of neighborhoods within the city of  Seattle, based on a user’s address. The vision and creation of the app was by Henry Bi, Alex Southwell, Carey LaMothe, and Dustin Wurtz.

Web Link: http://healthy-home-search.herokuapp.com/
Github Link: https://github.com/honghaobi/healthy-home-search

### Technologies Used:
* Node.js
* Express
* Jade
* Foundation
* Mapbox
* Postgres database with Knex
* Google OAuth
* D3.js
* MapBox for map and plotting
* HTML
* CSS
* Javascript
* JSON
* Deployed on Heroku

### APIs Used:
* Data.seattle.gov
* BreezoMeter
* Walk Score
* Zomato

NeighborGood is intended to be a user friendly tool for a user to research a particular neighborhood within the city of Seattle that they are interested in or gather more data on their current neighborhood. When a user submits an address, data will be acquired through over 15 Ajax calls to the above listed APIs. This data is placed into four different categories and given a score. The data and scores will be displayed through Jade and Express routing in a user friendly layout. The categories and their subtopics are listed below:

### Community
* Schools
* Parks
* Restaurants
* View Points
* Cultural Spaces

### Accessibility
* Bus Stops
* Parking Lots/Garages

### Environment
* Construction Permits for:
* Single Family
* Multi-family
* Commercial
* Institutional
* Industrial
* Air Quality

### Safety (Crime within the last year)
* Crime Type
* Day of Week
* Day of Month
* Time of Day

This data represents a 1.5 mile radius around the specified address. Each piece of data has a longitude and latitude associated with it. We then used that coordinate and placed it on it’s appropriate map. These maps are displayed to the user through MapBox with the appropriate points and can be filtered by their subtopics. In order to compare and score different aspects of city areas, we created an algorithm that assigns a score on a scale from 1 to 100. Where 100 is the best score. A user will also have the opportunity to save their searches, by signing up for a profile on the app. There are two ways for a user to sign up. They can sign up by providing an email address, username and password. Or they can sign up by approving the application to use their Google Account through OAuth. If a user provides an email address, username and password, the application will store this information in a database. Then when the user desires to login, a check will be performed to check if they are already a registered user and sign them in.

Once they receive a profile they will be provided a dashboard where they can save all their search locations and their scores. A user will also be able to re-search any past saved address and receive the most up to date score and data of their specified address. All of the user’s saved searches will be saved within a database through Postgres and Knex.
