package com.example.hethongquanlydatvexe.utils;

import java.util.regex.Pattern;

public final class ValidationUtil {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^(0|\\+84)\\d{9,10}$");

    private ValidationUtil() {
    }

    public static void requireNotBlank(
            String value,
            String fieldName
    ) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    fieldName + " không được để trống"
            );
        }
    }

    public static void requirePositive(
            double value,
            String fieldName
    ) {
        if (value <= 0) {
            throw new IllegalArgumentException(
                    fieldName + " phải lớn hơn 0"
            );
        }
    }

    public static void validateEmail(String email) {
        requireNotBlank(email, "Email");

        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException(
                    "Email không hợp lệ"
            );
        }
    }

    public static void validatePhone(String phone) {
        requireNotBlank(phone, "Số điện thoại");

        if (!PHONE_PATTERN.matcher(phone.trim()).matches()) {
            throw new IllegalArgumentException(
                    "Số điện thoại không hợp lệ"
            );
        }
    }

    public static void requireCustomerType(String type) {
        requireNotBlank(type, "Loại khách hàng");

        String normalized = normalize(type);

        boolean valid =
                normalized.equals(normalize(
                        Constants.CUSTOMER_THUONG
                ))
                        || normalized.equals(normalize(
                        Constants.CUSTOMER_THANH_VIEN
                ))
                        || normalized.equals(normalize(
                        Constants.CUSTOMER_VIP
                ));

        if (!valid) {
            throw new IllegalArgumentException(
                    "Loại khách hàng không hợp lệ"
            );
        }
    }

    public static void requireSeatType(String type) {
        requireNotBlank(type, "Loại ghế");

        String normalized = normalize(type);

        boolean valid =
                normalized.equals(normalize(
                        Constants.SEAT_THUONG
                ))
                        || normalized.equals(normalize(
                        Constants.SEAT_VIP
                ));

        if (!valid) {
            throw new IllegalArgumentException(
                    "Loại ghế không hợp lệ"
            );
        }
    }

    public static void requireSeatStatus(String status) {
        requireNotBlank(status, "Trạng thái ghế");

        String normalized = normalize(status);

        boolean valid =
                normalized.equals(normalize(
                        Constants.SEAT_CON_TRONG
                ))
                        || normalized.equals(normalize(
                        Constants.SEAT_DA_DAT
                ));

        if (!valid) {
            throw new IllegalArgumentException(
                    "Trạng thái ghế không hợp lệ"
            );
        }
    }

    private static String normalize(String value) {
        return value
                .trim()
                .replace(" ", "")
                .replace("_", "")
                .toLowerCase();
    }
}