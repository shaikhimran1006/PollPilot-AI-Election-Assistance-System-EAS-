package com.pollpilot.eas.service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.pollpilot.eas.model.PollingLocation;
import com.pollpilot.eas.repository.PollingLocationRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class PollingLocationService {
    private final PollingLocationRepository pollingLocationRepository;
    private final GeoApiContext geoApiContext;

    public PollingLocationService(PollingLocationRepository pollingLocationRepository,
            @Value("${google.maps.apiKey}") String mapsApiKey) {
        this.pollingLocationRepository = pollingLocationRepository;
        this.geoApiContext = new GeoApiContext.Builder().apiKey(mapsApiKey).build();
    }

    @Cacheable(value = "pollingLocations", key = "#address")
    public List<PollingLocation> searchLocations(String userId, String address) throws Exception {
        var results = PlacesApi.textSearchQuery(geoApiContext, "polling station near " + address)
                .await();
        List<PollingLocation> locations = results.results
                .stream()
                .map(result -> {
                    PollingLocation location = new PollingLocation();
                    location.setUserId(userId);
                    location.setName(result.name);
                    location.setAddress(result.formattedAddress);
                    location.setLatitude(result.geometry.location.lat);
                    location.setLongitude(result.geometry.location.lng);
                    return location;
                })
                .collect(Collectors.toList());
        pollingLocationRepository.saveAll(locations);
        return locations;
    }
}
