package com.tripwise.service;

import com.tripwise.dto.TripIntentRequest;
import com.tripwise.dto.TripIntentResponse;
import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OpenAIService openAIService;

    public TripIntentResponse processTravelIntent(TripIntentRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        String userContext = buildUserContext(user);
        String language = request.getLanguage() != null ? request.getLanguage() : "English";

        String aiSuggestion = openAIService.generateTravelSuggestion(
                request.getUserInput(),
                userContext,
                language
        );

        return new TripIntentResponse(aiSuggestion, "Trip suggestion generated successfully");
    }

    private String buildUserContext(User user) {
        StringBuilder context = new StringBuilder();
        
        if (user.getPreferredLanguage() != null) {
            context.append("Preferred Language: ").append(user.getPreferredLanguage()).append("\n");
        }
        if (user.getBudgetRange() != null) {
            context.append("Budget Range: ").append(user.getBudgetRange()).append("\n");
        }
        if (user.getTravelStyle() != null) {
            context.append("Travel Style: ").append(user.getTravelStyle()).append("\n");
        }
        if (user.getDietaryPreferences() != null) {
            context.append("Dietary Preferences: ").append(user.getDietaryPreferences()).append("\n");
        }
        if (user.getInterests() != null) {
            context.append("Interests: ").append(user.getInterests()).append("\n");
        }
        if (user.getPastTravelExperience() != null) {
            context.append("Past Travel Experience: ").append(user.getPastTravelExperience()).append("\n");
        }
        
        return context.toString();
    }
}
