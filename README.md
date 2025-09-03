# 🌦️ Weather App

## 🚀 Flow of the App
1. **On Page Load**  
   - Detects user’s location via GPS.  
   - Fetches weather data.  
   - Displays **Today’s Weather** by default (`showTodays()`).

2. **On City Search**  
   - User enters a city name.  
   - Fetches weather data for that city.  
   - Displays **Today’s Weather** first.

3. **Navigation**  
   - User can toggle between:  
     - **Today’s Weather** → `showTodays()`  
     - **Next 5/6 Days Forecast** → `showNext5Days()`
