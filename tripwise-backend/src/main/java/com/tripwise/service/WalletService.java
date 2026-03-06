package com.tripwise.service;

import com.tripwise.model.Transaction;
import com.tripwise.model.Wallet;
import com.tripwise.reactive.repository.TransactionRepository;
import com.tripwise.reactive.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public Mono<Wallet> getBalance(String profileId) {
        return walletRepository.findByProfileId(profileId)
                .switchIfEmpty(
                        walletRepository.save(
                                Wallet.builder()
                                        .profileId(profileId)
                                        .balance(BigDecimal.ZERO)
                                        .currency("INR")
                                        .build()));
    }

    public Mono<Wallet> addFunds(String profileId, BigDecimal amount, Transaction.PaymentMethod method) {
        return walletRepository.findByProfileId(profileId)
                .switchIfEmpty(Mono.error(new RuntimeException("Wallet not found")))
                .flatMap(wallet -> {
                    // Update Balance
                    wallet.setBalance(wallet.getBalance().add(amount));

                    // Create Transaction Record
                    Transaction transaction = Transaction.builder()
                            .walletId(wallet.getId())
                            .amount(amount)
                            .type(Transaction.TransactionType.TOPUP)
                            .method(method)
                            .status(Transaction.TransactionStatus.SUCCESS)
                            .timestamp(LocalDateTime.now())
                            .description("Added funds via " + method)
                            .build();

                    return transactionRepository.save(transaction)
                            .then(walletRepository.save(wallet));
                });
    }

    // Overloaded method for internal use (e.g. from PaymentController)
    public Mono<Wallet> creditFunds(String profileId, BigDecimal amount) {
        return addFunds(profileId, amount, Transaction.PaymentMethod.UPI); // Defaulting to UPI/Online for now
    }

    public Flux<Transaction> getHistory(String profileId) {
        return walletRepository.findByProfileId(profileId)
                .flatMapMany(wallet -> transactionRepository.findByWalletId(wallet.getId()));
    }
}
