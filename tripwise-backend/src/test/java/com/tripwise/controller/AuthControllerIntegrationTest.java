package com.tripwise.controller;

import com.tripwise.model.TravelerProfile;
import com.tripwise.security.JwtAuthenticationFilter;
import com.tripwise.security.JwtUtil;
import com.tripwise.security.SecurityConfig;
import com.tripwise.service.ProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import jakarta.servlet.http.Cookie;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import com.tripwise.reactive.repository.*;
import com.tripwise.session.TripPlanSessionRepository;

import org.springframework.test.web.servlet.MvcResult;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = AuthController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        BookingController.class,
                        ChatController.class,
                        CoTravelerController.class,
                        InteractiveTripController.class,
                        PaymentController.class,
                        ProfileController.class,
                        TravelDocumentController.class,
                        TripController.class,
                        WalletController.class,
                        GlobalExceptionHandler.class
                }
        )
)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtUtil.class})
@TestPropertySource(properties = {
        "jwt.secret=mydefaultsupersecretkeyforjwttokengeneration123456",
        "cors.allowed.origins=http://localhost:3000",
        "server.cookie.secure=false"
})
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockBean
    private ProfileService profileService;

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
    public void testLogin_NewUser_Success() throws Exception {
        String identifier = "test@example.com";
        when(profileService.findByIdentifier(identifier)).thenReturn(Mono.empty());

        MvcResult mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"" + identifier + "\"}"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.exists").value(false))
                .andExpect(jsonPath("$.isNewUser").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("auth_token=")));
    }

    @Test
    public void testLogin_ExistingUser_Success() throws Exception {
        String identifier = "test@example.com";
        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId("user123")
                .status("DRAFT")
                .build();
        when(profileService.findByIdentifier(identifier)).thenReturn(Mono.just(mockProfile));

        MvcResult mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"" + identifier + "\"}"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.exists").value(true))
                .andExpect(jsonPath("$.profile.profileId").value("user123"))
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    public void testLogin_EmptyIdentifier_BadRequest() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"\"}"))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Identifier is required"));
    }

    @Test
    public void testLogout_Success() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out"))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("auth_token=;")));
    }

    @Test
    public void testValidateSession_NoToken_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/validate"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testValidateSession_ValidToken_Success() throws Exception {
        String identifier = "test@example.com";
        String token = jwtUtil.generateToken(identifier);

        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId("user123")
                .status("DRAFT")
                .build();
        when(profileService.findByIdentifier(identifier)).thenReturn(Mono.just(mockProfile));

        MvcResult mvcResult = mockMvc.perform(get("/api/auth/validate")
                        .cookie(new Cookie("auth_token", token)))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.isValid").value(true))
                .andExpect(jsonPath("$.profile.profileId").value("user123"));
    }
}
