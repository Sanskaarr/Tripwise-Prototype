package com.tripwise.controller;

import com.tripwise.model.Transaction;
import com.tripwise.model.Wallet;
import com.tripwise.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

        private final WalletService walletService;

        // Get Balance (Create Wallet if it doesn't exist)
        @GetMapping("/balance/{profileId}")
        public Mono<Wallet> getBalance(@PathVariable String profileId) {
                return walletService.getBalance(profileId);
        }

        // Add Funds
        @PostMapping("/add-funds")
        public Mono<Wallet> addFunds(@RequestBody AddFundsRequest request) {
                return walletService.addFunds(request.profileId(), request.amount(), request.method());
        }

        // Get Transaction History
        @GetMapping("/history/{profileId}")
        public Flux<Transaction> getHistory(@PathVariable String profileId) {
                return walletService.getHistory(profileId);
        }

        // DTOs
        public record AddFundsRequest(String profileId, BigDecimal amount, Transaction.PaymentMethod method) {
        }
}
