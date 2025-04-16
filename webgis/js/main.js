// Global variables
let map;
let indiaStates;
let stateGeoLayer;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initMap();
    loadGeoJSONData();
    initSearch();
});

// Initialize the Leaflet map
function initMap() {
    map = L.map('map').setView([22.5937, 82.9629], 5); // Centered on India

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
}

// Load GeoJSON data
function loadGeoJSONData() {
    showLoading();

    // Change this path to where your GeoJSON file is located
    fetch('data/india-states.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            indiaStates = data;
            renderMap(data);
            displayStateInformation(data);
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading GeoJSON:', error);
            alert('Failed to load map data. Please check the console for details.');
        });
}

// Render the map with GeoJSON data
function renderMap(data) {
    // Remove previous layer if exists
    if (stateGeoLayer) {
        map.removeLayer(stateGeoLayer);
    }

    // Add GeoJSON layer
    stateGeoLayer = L.geoJSON(data, {
        style: {
            color: '#0d6efd',
            weight: 1,
            fillOpacity: 0.2,
            fillColor: '#0d6efd'
        },
        onEachFeature: function (feature, layer) {
            // Get state name from properties
            const stateName = feature.properties.NAME_1;

            // Bind popup with state name
            layer.bindPopup(`<strong>${stateName}</strong>`);

            // Add hover effect
            layer.on({
                mouseover: function (e) {
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                mouseout: function (e) {
                    if (!layer.isHighlighted) {
                        stateGeoLayer.resetStyle(layer);
                    }
                },
                click: function (e) {
                    // Show state info in sidebar when clicked
                    displayStateDetails(feature);
                }
            });
        }
    }).addTo(map);

    // Fit map to the GeoJSON bounds
    map.fitBounds(stateGeoLayer.getBounds());
}

// Display state details in sidebar when clicked
function displayStateDetails(feature) {
    const stateName = feature.properties.NAME_1;
    const population = getRandomPopulation();
    const stateType = feature.properties.TYPE_1 || "State";

    const searchResultsElement = document.getElementById('searchResults');
    searchResultsElement.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${stateName}</h5>
                <p class="card-text">Population: ${formatPopulation(population)}</p>
                <p class="card-text">Type: ${stateType}</p>
            </div>
        </div>
    `;
}

// Display state information in sidebar
function displayStateInformation(data) {
    // Get all state names
    const states = data.features.map(feature => {
        return {
            name: feature.properties.NAME_1,
            type: feature.properties.TYPE_1 || "State"
        };
    });

    // Display total number of states
    const totalStatesElement = document.getElementById('totalStates');
    totalStatesElement.innerHTML = `<p>Total States/Territories: <strong>${states.length}</strong></p>`;

    // Display 5 random states with dummy population
    const randomStatesElement = document.getElementById('randomStates');
    randomStatesElement.innerHTML = '<h6 class="mb-3">Random State Data:</h6>';

    // Get 5 random states
    const randomStates = getRandomStates(states, 5);

    // Create list of random states
    let statesList = '<ul class="list-group">';
    randomStates.forEach(state => {
        const population = getRandomPopulation();
        statesList += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${state.name}
            <span class="badge bg-primary rounded-pill">${formatPopulation(population)}</span>
        </li>`;
    });
    statesList += '</ul>';

    randomStatesElement.innerHTML += statesList;
}

// Initialize search functionality
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('stateSearch');

    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform search based on input
function performSearch() {
    const searchInput = document.getElementById('stateSearch');
    const searchQuery = searchInput.value.trim().toLowerCase();
    const searchResultsElement = document.getElementById('searchResults');

    if (!searchQuery) {
        searchResultsElement.innerHTML = '<p class="text-danger">Please enter a state name</p>';
        return;
    }

    if (!indiaStates) {
        searchResultsElement.innerHTML = '<p class="text-danger">Data not loaded yet. Please try again.</p>';
        return;
    }

    // Find matching state
    const matchingFeature = indiaStates.features.find(feature => {
        const stateName = feature.properties.NAME_1.toLowerCase();
        return stateName.includes(searchQuery);
    });

    if (matchingFeature) {
        const stateName = matchingFeature.properties.NAME_1;
        const stateType = matchingFeature.properties.TYPE_1 || "State";
        const population = getRandomPopulation();

        // Display result in sidebar
        searchResultsElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${stateName}</h5>
                    <p class="card-text">Population: ${formatPopulation(population)}</p>
                    <p class="card-text">Type: ${stateType}</p>
                </div>
            </div>
        `;

        // Highlight state on map
        highlightState(matchingFeature);
    } else {
        searchResultsElement.innerHTML = '<p class="text-danger">State not found. Try another name.</p>';
    }
}

// Highlight the searched state on the map
function highlightState(feature) {
    // Reset previous highlighting
    stateGeoLayer.eachLayer(layer => {
        stateGeoLayer.resetStyle(layer);
        layer.isHighlighted = false;
    });

    // Find and highlight the layer
    stateGeoLayer.eachLayer(layer => {
        const layerFeature = layer.feature;
        const layerStateName = layerFeature.properties.NAME_1;
        const featureStateName = feature.properties.NAME_1;

        if (layerStateName === featureStateName) {
            layer.setStyle({
                fillColor: '#dc3545',
                fillOpacity: 0.6,
                weight: 2,
                color: '#dc3545'
            });
            layer.isHighlighted = true;

            // Zoom to the state
            map.fitBounds(layer.getBounds());
            layer.openPopup();
        }
    });
}

// Generate random population between min and max values
function getRandomPopulation(min = 500000, max = 50000000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format population with commas
function formatPopulation(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get random states
function getRandomStates(states, count) {
    const shuffled = [...states].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Show loading indicator
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}
