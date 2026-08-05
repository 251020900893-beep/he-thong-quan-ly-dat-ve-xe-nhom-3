package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Payment;

import java.util.ArrayList;
import java.util.List;

public class PaymentRepository {

    private static final String FILE_PATH = "data/payments.json";

    private final FileManager fileManager = new FileManager();

    public List<Payment> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(Payment.class)
        );
    }

    public Payment findById(String paymentId) {
        if (isBlank(paymentId)) {
            return null;
        }

        for (Payment payment : findAll()) {
            if (sameText(
                    payment.getPaymentId(),
                    paymentId
            )) {
                return payment;
            }
        }

        return null;
    }

    public List<Payment> findByMethod(
            String paymentMethod
    ) {
        List<Payment> result = new ArrayList<>();

        if (isBlank(paymentMethod)) {
            return result;
        }

        for (Payment payment : findAll()) {
            if (sameText(
                    payment.getPaymentMethod(),
                    paymentMethod
            )) {
                result.add(payment);
            }
        }

        return result;
    }

    public List<Payment> findByStatus(
            String paymentStatus
    ) {
        List<Payment> result = new ArrayList<>();

        if (isBlank(paymentStatus)) {
            return result;
        }

        for (Payment payment : findAll()) {
            if (sameText(
                    payment.getPaymentStatus(),
                    paymentStatus
            )) {
                result.add(payment);
            }
        }

        return result;
    }

    public void save(Payment payment) {
        List<Payment> payments = findAll();

        payments.add(payment);

        fileManager.writeList(
                FILE_PATH,
                payments
        );
    }

    public boolean update(Payment payment) {
        if (payment == null
                || isBlank(payment.getPaymentId())) {

            return false;
        }

        List<Payment> payments = findAll();

        for (int i = 0; i < payments.size(); i++) {
            Payment currentPayment = payments.get(i);

            if (sameText(
                    currentPayment.getPaymentId(),
                    payment.getPaymentId()
            )) {
                payments.set(i, payment);

                fileManager.writeList(
                        FILE_PATH,
                        payments
                );

                return true;
            }
        }

        return false;
    }

    public boolean updateStatus(
            String paymentId,
            String paymentStatus
    ) {
        if (isBlank(paymentId)
                || isBlank(paymentStatus)) {

            return false;
        }

        List<Payment> payments = findAll();

        for (Payment payment : payments) {
            if (sameText(
                    payment.getPaymentId(),
                    paymentId
            )) {
                payment.setPaymentStatus(
                        paymentStatus.trim()
                );

                fileManager.writeList(
                        FILE_PATH,
                        payments
                );

                return true;
            }
        }

        return false;
    }

    public boolean delete(String paymentId) {
        if (isBlank(paymentId)) {
            return false;
        }

        List<Payment> payments = findAll();

        boolean removed = payments.removeIf(
                payment -> sameText(
                        payment.getPaymentId(),
                        paymentId
                )
        );

        if (removed) {
            fileManager.writeList(
                    FILE_PATH,
                    payments
            );
        }

        return removed;
    }

    public boolean exists(String paymentId) {
        return findById(paymentId) != null;
    }

    public int count() {
        return findAll().size();
    }

    public int countByMethod(
            String paymentMethod
    ) {
        return findByMethod(
                paymentMethod
        ).size();
    }

    public int countByStatus(
            String paymentStatus
    ) {
        return findByStatus(
                paymentStatus
        ).size();
    }

    private boolean sameText(
            String firstValue,
            String secondValue
    ) {
        return firstValue != null
                && secondValue != null
                && firstValue.trim()
                .equalsIgnoreCase(secondValue.trim());
    }

    private boolean isBlank(String value) {
        return value == null
                || value.trim().isEmpty();
    }
}