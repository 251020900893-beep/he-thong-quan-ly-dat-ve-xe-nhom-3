package com.example.hethongquanlydatvexe.utils;

import java.util.regex.Pattern;

public class ValidationUtil {

    private ValidationUtil() {
    }

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^(0|\\+84)\\d{9,10}$");

    public static void requireNotBlank(
            String value,
            String fieldName
    ) {
        if (value == null || value.isEmpty()) {
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

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException(
                    "Email không hợp lệ"
            );
        }
    }

    public static void validatePhone(String phone) {
        requireNotBlank(phone, "Số điện thoại");

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException(
                    "Số điện thoại không hợp lệ"
            );
        }
    }

    public static void requireCustomerType(String type) {
        requireNotBlank(type, "Loại khách hàng");

        if (!type.equals(Constants.CUSTOMER_THUONG)
                && !type.equals(Constants.CUSTOMER_THANH_VIEN)
                && !type.equals(Constants.CUSTOMER_VIP)) {

            throw new IllegalArgumentException(
                    "Loại khách hàng không hợp lệ"
            );
        }
    }

    public static void requireSeatType(String type) {
        requireNotBlank(type, "Loại ghế");

        if (!type.equals(Constants.SEAT_THUONG)
                && !type.equals(Constants.SEAT_VIP)) {

            throw new IllegalArgumentException(
                    "Loại ghế không hợp lệ"
            );
        }
    }

    public static void requireSeatStatus(String status) {
        requireNotBlank(status, "Trạng thái ghế");

        if (!status.equals(Constants.SEAT_CON_TRONG)
                && !status.equals(Constants.SEAT_DA_DAT)) {

            throw new IllegalArgumentException(
                    "Trạng thái ghế không hợp lệ"
            );
        }
    }
}