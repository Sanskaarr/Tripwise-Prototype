package com.tripwise.service;

import com.tripwise.dto.BookingOption;
import com.tripwise.dto.BookingRequest;
import com.tripwise.dto.BookingResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);
    private final Random random = new Random();
    
    public BookingResponse searchFlights(BookingRequest request) {
        logger.info("Searching flights from {} to {} for {} passengers", 
            request.getOrigin(), request.getDestination(), request.getNumberOfPassengers());
        
        List<BookingOption> options = new ArrayList<>();
        
        options.add(new BookingOption(
            "FL" + generateId(),
            "Air India Express",
            "Non-stop flight, Economy class, 15kg baggage",
            5000.0 + random.nextInt(3000),
            "06:00 AM",
            "08:30 AM",
            "2h 30m",
            "4.2/5"
        ));
        
        options.add(new BookingOption(
            "FL" + generateId(),
            "IndiGo",
            "Direct flight, Economy class, 15kg baggage",
            4500.0 + random.nextInt(2500),
            "09:00 AM",
            "11:45 AM",
            "2h 45m",
            "4.5/5"
        ));
        
        options.add(new BookingOption(
            "FL" + generateId(),
            "Vistara",
            "Premium Economy, 20kg baggage, In-flight meals",
            7000.0 + random.nextInt(2000),
            "02:00 PM",
            "04:20 PM",
            "2h 20m",
            "4.7/5"
        ));
        
        double totalPrice = options.stream().mapToDouble(BookingOption::getPrice).min().orElse(0.0);
        
        return new BookingResponse(
            generateBookingId(),
            "FLIGHT",
            "AVAILABLE",
            totalPrice * request.getNumberOfPassengers(),
            "INR",
            options,
            "Found " + options.size() + " flight options. Mock data for testing."
        );
    }
    
    public BookingResponse searchHotels(BookingRequest request) {
        logger.info("Searching hotels in {} from {} to {}", 
            request.getDestination(), request.getStartDate(), request.getEndDate());
        
        List<BookingOption> options = new ArrayList<>();
        
        options.add(new BookingOption(
            "HT" + generateId(),
            "Taj Hotel",
            "5-star luxury hotel, Pool, Spa, Free WiFi, Breakfast included",
            8000.0 + random.nextInt(4000),
            request.getStartDate(),
            request.getEndDate(),
            "Per night",
            "4.8/5"
        ));
        
        options.add(new BookingOption(
            "HT" + generateId(),
            "Radisson Blu",
            "4-star hotel, Gym, Restaurant, Free parking",
            5000.0 + random.nextInt(2000),
            request.getStartDate(),
            request.getEndDate(),
            "Per night",
            "4.5/5"
        ));
        
        options.add(new BookingOption(
            "HT" + generateId(),
            "OYO Premium",
            "3-star budget hotel, Clean rooms, AC, WiFi",
            2000.0 + random.nextInt(1000),
            request.getStartDate(),
            request.getEndDate(),
            "Per night",
            "4.0/5"
        ));
        
        double totalPrice = options.stream().mapToDouble(BookingOption::getPrice).min().orElse(0.0);
        
        return new BookingResponse(
            generateBookingId(),
            "HOTEL",
            "AVAILABLE",
            totalPrice,
            "INR",
            options,
            "Found " + options.size() + " hotel options. Mock data for testing."
        );
    }
    
    public BookingResponse searchActivities(BookingRequest request) {
        logger.info("Searching activities in {}", request.getDestination());
        
        List<BookingOption> options = new ArrayList<>();
        
        options.add(new BookingOption(
            "AC" + generateId(),
            "City Tour with Guide",
            "Full day guided tour covering major attractions, Lunch included",
            1500.0,
            "09:00 AM",
            "06:00 PM",
            "9 hours",
            "4.6/5"
        ));
        
        options.add(new BookingOption(
            "AC" + generateId(),
            "Adventure Water Sports",
            "Jet ski, Parasailing, Banana boat rides",
            2500.0,
            "10:00 AM",
            "04:00 PM",
            "6 hours",
            "4.8/5"
        ));
        
        options.add(new BookingOption(
            "AC" + generateId(),
            "Cultural Heritage Walk",
            "Walking tour of historical sites with local expert",
            800.0,
            "07:00 AM",
            "11:00 AM",
            "4 hours",
            "4.4/5"
        ));
        
        double totalPrice = options.stream().mapToDouble(BookingOption::getPrice).sum();
        
        return new BookingResponse(
            generateBookingId(),
            "ACTIVITY",
            "AVAILABLE",
            totalPrice,
            "INR",
            options,
            "Found " + options.size() + " activity options. Mock data for testing."
        );
    }
    
    public BookingResponse confirmBooking(String bookingId, String optionId) {
        logger.info("Confirming booking {} with option {}", bookingId, optionId);
        
        BookingOption confirmedOption = new BookingOption(
            optionId,
            "Confirmed Booking",
            "Your booking has been confirmed. Payment pending.",
            0.0,
            LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            null,
            null,
            null
        );
        
        return new BookingResponse(
            bookingId,
            "CONFIRMED",
            "PAYMENT_PENDING",
            0.0,
            "INR",
            List.of(confirmedOption),
            "Booking confirmed successfully. Please proceed to payment."
        );
    }
    
    private String generateBookingId() {
        return "BK" + System.currentTimeMillis() + random.nextInt(1000);
    }
    
    private String generateId() {
        return String.valueOf(System.currentTimeMillis()).substring(7) + random.nextInt(100);
    }
}
