package com.tripwise;

import com.tripwise.reactive.repository.*;
import com.tripwise.session.TripPlanSessionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration,org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,org.springframework.boot.autoconfigure.mongo.MongoReactiveAutoConfiguration,org.springframework.boot.autoconfigure.data.mongo.MongoReactiveDataAutoConfiguration",
        "jwt.secret=mydefaultsupersecretkeyforjwttokengeneration123456",
        "cors.allowed.origins=http://localhost:3000",
        "razorpay.key.id=mockkey",
        "razorpay.key.secret=mocksecret"
})
class TripwiseApplicationTests {

    @MockBean
    private ReactiveTravelerProfileRepository reactiveTravelerProfileRepository;

    @MockBean
    private WalletRepository walletRepository;

    @MockBean
    private TransactionRepository transactionRepository;

    @MockBean
    private BookingRepository bookingRepository;

    @MockBean
    private ReactiveTripRepository reactiveTripRepository;

    @MockBean
    private ReactiveCoTravelerRepository reactiveCoTravelerRepository;

    @MockBean
    private TravelDocumentRepository travelDocumentRepository;

    @MockBean
    private TripPlanSessionRepository tripPlanSessionRepository;

    @Test
    void contextLoads() {
    }

}
