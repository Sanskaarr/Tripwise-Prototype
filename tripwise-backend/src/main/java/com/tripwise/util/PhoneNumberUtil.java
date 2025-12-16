package com.tripwise.util;

public class PhoneNumberUtil {
    
    public static String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }
        
        String normalized = phoneNumber.trim();
        
        normalized = normalized.replaceAll("\\s+", "");
        normalized = normalized.replaceAll("-", "");
        normalized = normalized.replaceAll("\\(", "");
        normalized = normalized.replaceAll("\\)", "");
        
        if (normalized.startsWith("+")) {
            normalized = normalized.substring(1);
        }
        
        if (normalized.startsWith("91") && normalized.length() == 12) {
            normalized = normalized.substring(2);
        } else if (normalized.startsWith("0") && normalized.length() == 11) {
            normalized = normalized.substring(1);
        }
        
        if (normalized.length() != 10) {
            return phoneNumber.trim();
        }
        
        return normalized;
    }
}
