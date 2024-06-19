type GeocodeResponse = {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
};

export async function getLatLng(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=AIzaSyAOdWmJyDnSCCJ5Nwg9Pmgb4KDLzgvISjw`;
  try {
    const response = await fetch(url);
    const data: GeocodeResponse = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding API error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}

export function calculateDistance(
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const origin = new google.maps.LatLng(originLat, originLng);
    const destination = new google.maps.LatLng(destinationLat, destinationLng);
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const distanceInKms = response.rows[0].elements[0].distance.text;
          resolve(distanceInKms);
        } else {
          console.error("Distance Matrix API error:", status);
          reject(null);
        }
      }
    );
  });
}
