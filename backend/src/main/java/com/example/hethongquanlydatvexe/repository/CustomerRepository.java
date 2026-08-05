package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.model.Customer;

import java.util.List;

public class CustomerRepository {

    private static final String FILE_PATH = "data/customers.json";

    private final FileManager fileManager = new FileManager();

    public List<Customer> findAll() {
        return fileManager.readList(
                FILE_PATH,
                FileManager.getListType(Customer.class)
        );
    }

    public Customer findById(String customerId) {
        if (isBlank(customerId)) {
            return null;
        }

        for (Customer customer : findAll()) {
            if (sameText(
                    customer.getId(),
                    customerId
            )) {
                return customer;
            }
        }

        return null;
    }

    public Customer findByPhone(String phone) {
        if (isBlank(phone)) {
            return null;
        }

        for (Customer customer : findAll()) {
            if (sameText(
                    customer.getPhone(),
                    phone
            )) {
                return customer;
            }
        }

        return null;
    }

    public Customer findByEmail(String email) {
        if (isBlank(email)) {
            return null;
        }

        for (Customer customer : findAll()) {
            if (sameText(
                    customer.getEmail(),
                    email
            )) {
                return customer;
            }
        }

        return null;
    }

    public void save(Customer customer) {
        List<Customer> customers = findAll();

        customers.add(customer);

        fileManager.writeList(
                FILE_PATH,
                customers
        );
    }

    public boolean update(Customer customer) {
        if (customer == null
                || isBlank(customer.getId())) {

            return false;
        }

        List<Customer> customers = findAll();

        for (int i = 0; i < customers.size(); i++) {
            Customer currentCustomer =
                    customers.get(i);

            if (sameText(
                    currentCustomer.getId(),
                    customer.getId()
            )) {
                customers.set(i, customer);

                fileManager.writeList(
                        FILE_PATH,
                        customers
                );

                return true;
            }
        }

        return false;
    }

    public boolean delete(String customerId) {
        if (isBlank(customerId)) {
            return false;
        }

        List<Customer> customers = findAll();

        boolean removed = customers.removeIf(
                customer -> sameText(
                        customer.getId(),
                        customerId
                )
        );

        if (removed) {
            fileManager.writeList(
                    FILE_PATH,
                    customers
            );
        }

        return removed;
    }

    public boolean exists(String customerId) {
        return findById(customerId) != null;
    }

    public boolean phoneExists(String phone) {
        return findByPhone(phone) != null;
    }

    public boolean emailExists(String email) {
        return findByEmail(email) != null;
    }

    public int count() {
        return findAll().size();
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