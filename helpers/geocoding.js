














function geocodeAddress(address, city, state) {
    return new Promise((resolve, reject) => {
        
        
        
        
        setTimeout(() => {
            
            
            
            
            if (city && state) {
                
                resolve({
                    latitude: parseFloat((Math.random() * 10 + 30).toFixed(6)),
                    longitude: parseFloat((Math.random() * 10 + 70).toFixed(6)),
                    formattedAddress: address || `${city}, ${state}`
                });
            } else {
                reject(new Error('City and state are required for geocoding'));
            }
        }, 100);
    });
}










function calculateDistance(lat1, lon1, lat2, lon2) {
    
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; 
    
    return distance;
}









function findNearbyDonations(userLocation, donations, maxDistance = 10) {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        return donations; 
    }
    
    return donations.filter(donation => {
        if (!donation.location || !donation.location.latitude || !donation.location.longitude) {
            return false; 
        }
        
        
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            donation.location.latitude,
            donation.location.longitude
        );
        
        
        donation.distance = parseFloat(distance.toFixed(2));
        
        
        return distance <= maxDistance;
    }).sort((a, b) => a.distance - b.distance); 
}

module.exports = {
    geocodeAddress,
    calculateDistance,
    findNearbyDonations
};