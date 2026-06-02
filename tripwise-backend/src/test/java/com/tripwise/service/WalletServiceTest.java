package com.tripwise.service;

import com.tripwise.model.Transaction;
import com.tripwise.model.Wallet;
import com.tripwise.reactive.repository.TransactionRepository;
import com.tripwise.reactive.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private WalletService walletService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetBalance_ExistingWallet() {
        String profileId = "user123";
        Wallet existingWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("500.00"))
                .currency("INR")
                .build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.just(existingWallet));
        when(walletRepository.save(any(Wallet.class))).thenReturn(Mono.empty());

        Mono<Wallet> result = walletService.getBalance(profileId);

        StepVerifier.create(result)
                .expectNext(existingWallet)
                .verifyComplete();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(walletRepository, never()).save(any(Wallet.class));
    }

    @Test
    void testGetBalance_NewWalletCreated() {
        String profileId = "user123";
        Wallet savedWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(BigDecimal.ZERO)
                .currency("INR")
                .build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.empty());
        when(walletRepository.save(any(Wallet.class))).thenReturn(Mono.just(savedWallet));

        Mono<Wallet> result = walletService.getBalance(profileId);

        StepVerifier.create(result)
                .expectNext(savedWallet)
                .verifyComplete();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(walletRepository, times(1)).save(any(Wallet.class));
    }

    @Test
    void testAddFunds_Success() {
        String profileId = "user123";
        Wallet existingWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("100.00"))
                .currency("INR")
                .build();

        Wallet updatedWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("250.00"))
                .currency("INR")
                .build();

        Transaction savedTransaction = Transaction.builder()
                .id("txn123")
                .walletId("wallet123")
                .amount(new BigDecimal("150.00"))
                .type(Transaction.TransactionType.TOPUP)
                .method(Transaction.PaymentMethod.UPI)
                .status(Transaction.TransactionStatus.SUCCESS)
                .timestamp(LocalDateTime.now())
                .description("Added funds via UPI")
                .build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.just(existingWallet));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(Mono.just(savedTransaction));
        when(walletRepository.save(any(Wallet.class))).thenReturn(Mono.just(updatedWallet));

        Mono<Wallet> result = walletService.addFunds(profileId, new BigDecimal("150.00"), Transaction.PaymentMethod.UPI);

        StepVerifier.create(result)
                .expectNext(updatedWallet)
                .verifyComplete();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(walletRepository, times(1)).save(any(Wallet.class));
    }

    @Test
    void testAddFunds_WalletNotFound() {
        String profileId = "unknown";
        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.empty());

        Mono<Wallet> result = walletService.addFunds(profileId, new BigDecimal("100.00"), Transaction.PaymentMethod.UPI);

        StepVerifier.create(result)
                .expectErrorMatches(throwable -> throwable instanceof RuntimeException &&
                        throwable.getMessage().equals("Wallet not found"))
                .verify();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(walletRepository, never()).save(any(Wallet.class));
    }

    @Test
    void testDeductFunds_Success() {
        String profileId = "user123";
        Wallet existingWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("500.00"))
                .currency("INR")
                .build();

        Wallet updatedWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("300.00"))
                .currency("INR")
                .build();

        Transaction savedTransaction = Transaction.builder()
                .id("txn456")
                .walletId("wallet123")
                .amount(new BigDecimal("200.00"))
                .type(Transaction.TransactionType.SPEND)
                .method(Transaction.PaymentMethod.SYSTEM)
                .status(Transaction.TransactionStatus.SUCCESS)
                .timestamp(LocalDateTime.now())
                .description("Flight booking deduction")
                .build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.just(existingWallet));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(Mono.just(savedTransaction));
        when(walletRepository.save(any(Wallet.class))).thenReturn(Mono.just(updatedWallet));

        Mono<Wallet> result = walletService.deductFunds(profileId, new BigDecimal("200.00"), "Flight booking deduction");

        StepVerifier.create(result)
                .expectNext(updatedWallet)
                .verifyComplete();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(walletRepository, times(1)).save(any(Wallet.class));
    }

    @Test
    void testDeductFunds_InsufficientBalance() {
        String profileId = "user123";
        Wallet existingWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("50.00"))
                .currency("INR")
                .build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.just(existingWallet));

        Mono<Wallet> result = walletService.deductFunds(profileId, new BigDecimal("200.00"), "Flight booking deduction");

        StepVerifier.create(result)
                .expectErrorMatches(throwable -> throwable instanceof RuntimeException &&
                        throwable.getMessage().equals("Insufficient wallet balance"))
                .verify();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(walletRepository, never()).save(any(Wallet.class));
    }

    @Test
    void testDeductFunds_WalletNotFound() {
        String profileId = "unknown";
        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.empty());

        Mono<Wallet> result = walletService.deductFunds(profileId, new BigDecimal("200.00"), "Flight booking deduction");

        StepVerifier.create(result)
                .expectErrorMatches(throwable -> throwable instanceof RuntimeException &&
                        throwable.getMessage().equals("Wallet not found"))
                .verify();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(walletRepository, never()).save(any(Wallet.class));
    }

    @Test
    void testGetHistory() {
        String profileId = "user123";
        Wallet existingWallet = Wallet.builder()
                .id("wallet123")
                .profileId(profileId)
                .balance(new BigDecimal("500.00"))
                .build();

        Transaction t1 = Transaction.builder().id("t1").walletId("wallet123").amount(new BigDecimal("100.00")).build();
        Transaction t2 = Transaction.builder().id("t2").walletId("wallet123").amount(new BigDecimal("200.00")).build();

        when(walletRepository.findByProfileId(profileId)).thenReturn(Mono.just(existingWallet));
        when(transactionRepository.findByWalletId("wallet123")).thenReturn(Flux.just(t1, t2));

        Flux<Transaction> result = walletService.getHistory(profileId);

        StepVerifier.create(result)
                .expectNext(t1)
                .expectNext(t2)
                .verifyComplete();

        verify(walletRepository, times(1)).findByProfileId(profileId);
        verify(transactionRepository, times(1)).findByWalletId("wallet123");
    }
}
