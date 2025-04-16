# India States WebGIS Application

A lightweight, responsive WebGIS dashboard for visualizing Indian states, built with **Leaflet.js** and **Bootstrap**.

---

## Tools & Libraries Used

- **Leaflet.js** – For rendering interactive maps and handling GeoJSON data.
- **Bootstrap 5** – For responsive layout and styling.
- **OpenStreetMap** – As the base map tile provider.
- **GeoJSON** – Format for Indian state boundaries.
- **Vanilla JavaScript** – For application logic and interactivity.

---

## Steps to Run the Project

### 1. **Clone or Download the Project**
- Place your `india-states.geojson` file in the `data/` folder.

### 2. **Start a Local Server**

You have several options:

#### **A. VS Code Live Server (Recommended)**
- Open the project folder in VS Code.
- Right-click `index.html` and select **"Open with Live Server"**.

#### **B. Python HTTP Server**
- Open a terminal in your project folder and run:
`python -m http.server 8000`

- Visit [http://localhost:8000](http://localhost:8000) in your browser.

#### **C. Node.js HTTP Server**
- Make sure [Node.js](https://nodejs.org/) is installed.
- In your project folder, run:
`npx http-server -p 8000`

*(If you don’t have `http-server`, install it with `npm install -g http-server`)*
- Visit [http://localhost:8000](http://localhost:8000) in your browser.

### 3. **View on Mobile**
- Connect your phone and computer to the same Wi-Fi network.
- Find your computer’s local IP address (e.g., `192.168.1.10`).
- On your phone’s browser, visit:  
`http://<your-computer-ip>:8000`

---

## My Approach

I designed this application to be clean, interactive, and user-friendly.  
- I used **Bootstrap’s grid system** to create a responsive layout with a sidebar and map area.
- **Leaflet.js** is utilized for rendering the map, loading Indian state boundaries from a local GeoJSON file, and displaying state names in popups.
- The sidebar provides:
  - The total number of states
  - Five random states with dummy population values
  - A search box for highlighting and displaying selected state information
- All data loading, search, and UI updates are handled with **vanilla JavaScript**.
- The site is tested and optimized for both desktop and mobile browsers.

---
