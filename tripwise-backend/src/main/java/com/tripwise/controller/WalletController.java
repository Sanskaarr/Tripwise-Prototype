package com.tripwise.controller;

import com.tripwise.model.Transaction;
import com.tripwise.model.Wallet;
import com.tripwise.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

        private final WalletService walletService;

        // Get Balance (Create Wallet if it doesn't exist)
        @GetMapping("/balance/{profileId}")
        public ResponseEntity<Wallet> getBalance(@PathVariable String profileId) {
                Wallet wallet = walletService.getBalance(profileId).block();
                return ResponseEntity.ok(wallet);
        }

        // Add Funds
        @PostMapping("/add-funds")
        public ResponseEntity<Wallet> addFunds(@RequestBody AddFundsRequest request) {
                Wallet wallet = walletService.addFunds(request.profileId(), request.amount(), request.method()).block();
                return ResponseEntity.ok(wallet);
        }

        // Get Transaction History
        @GetMapping("/history/{profileId}")
        public ResponseEntity<List<Transaction>> getHistory(@PathVariable String profileId) {
                List<Transaction> transactions = walletService.getHistory(profileId).collectList().block();
                return ResponseEntity.ok(transactions != null ? transactions : List.of());
        }

        // DTOs
        public record AddFundsRequest(String profileId, BigDecimal amount, Transaction.PaymentMethod method) {
        }
}
