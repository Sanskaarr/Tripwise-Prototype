package com.tripwise.controller;

import com.tripwise.model.Transaction;
import com.tripwise.model.Wallet;
import com.tripwise.reactive.repository.TransactionRepository;
import com.tripwise.reactive.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

        private final WalletRepository walletRepository;
        private final TransactionRepository transactionRepository;

        // Get Balance (Create Wallet if it doesn't exist)
        @GetMapping("/balance/{profileId}")
        public Mono<Wallet> getBalance(@PathVariable String profileId) {
                return walletRepository.findByProfileId(profileId)
                                .switchIfEmpty(
                                                walletRepository.save(
                                                                Wallet.builder()
                                                                                .profileId(profileId)
                                                                                .balance(BigDecimal.ZERO)
                                                                                .currency("INR")
                                                                                .build()));
        }

        // Add Funds
        @PostMapping("/add-funds")
        public Mono<Wallet> addFunds(@RequestBody AddFundsRequest request) {
                return walletRepository.findByProfileId(request.profileId())
                                .switchIfEmpty(Mono.error(new RuntimeException("Wallet not found")))
                                .flatMap(wallet -> {
                                        // Update Balance
                                        wallet.setBalance(wallet.getBalance().add(request.amount()));

                                        // Create Transaction Record
                                        Transaction transaction = Transaction.builder()
                                                        .walletId(wallet.getId())
                                                        .amount(request.amount())
                                                        .type(Transaction.TransactionType.TOPUP)
                                                        .method(request.method())
                                                        .status(Transaction.TransactionStatus.SUCCESS)
                                                        .timestamp(LocalDateTime.now())
                                                        .description("Added funds via " + request.method())
                                                        .build();

                                        return transactionRepository.save(transaction)
                                                        .then(walletRepository.save(wallet));
                                });
        }

        // Get Transaction History
        @GetMapping("/history/{profileId}")
        public Flux<Transaction> getHistory(@PathVariable String profileId) {
                return walletRepository.findByProfileId(profileId)
                                .flatMapMany(wallet -> transactionRepository.findByWalletId(wallet.getId()));
        }

        // DTOs
        public record AddFundsRequest(String profileId, BigDecimal amount, Transaction.PaymentMethod method) {
        }
}
