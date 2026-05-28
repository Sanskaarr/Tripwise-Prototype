package com.tripwise.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingPaymentRequest {
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    // Amount deducted from wallet before this request was made (null = no wallet used)
    private BigDecimal walletAmountUsed;
}
