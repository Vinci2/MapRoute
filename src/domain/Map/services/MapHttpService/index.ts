const ROUTE_DATA_URL = 'files/routeToPrint.json';

export async function fetchBicycleRoute() {
    const response = await fetch(ROUTE_DATA_URL);
    const parsed = await response.json();
    const polyline = JSON.parse(parsed.polyline); 
    return polyline[0] || '';
}
