package com.tripwise.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    @Field("walletId")
    private String walletId;

    @Field("amount")
    private BigDecimal amount;

    @Field("type")
    private TransactionType type; // TOPUP, SPEND, REFUND

    @Field("method")
    private PaymentMethod method; // UPI, CARD, NET_BANKING

    @Field("status")
    private TransactionStatus status; // SUCCESS, PENDING, FAILED

    @Field("timestamp")
    private LocalDateTime timestamp;

    @Field("description")
    private String description;

    public enum TransactionType {
        TOPUP, SPEND, REFUND
    }

    public enum PaymentMethod {
        UPI, NET_BANKING, DEBIT_CARD, CREDIT_CARD, SYSTEM
    }

    public enum TransactionStatus {
        SUCCESS, PENDING, FAILED
    }
}
