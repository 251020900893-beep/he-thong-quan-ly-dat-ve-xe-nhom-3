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
        List<Customer> customers = findAll();

        for (Customer customer : customers) {
            if (customer.getId().equals(customerId)) {
                return customer;
            }
        }

        return null;
    }

    public Customer findByPhone(String phone) {
        List<Customer> customers = findAll();

        for (Customer customer : customers) {
            if (customer.getPhone().equals(phone)) {
                return customer;
            }
        }

        return null;
    }

    public Customer findByEmail(String email) {
        List<Customer> customers = findAll();

        for (Customer customer : customers) {
            if (customer.getEmail().equals(email)) {
                return customer;
            }
        }

        return null;
    }

    public void save(Customer customer) {
        fileManager.<Customer, Void>updateList(FILE_PATH, FileManager.getListType(Customer.class), customers -> {
            boolean duplicate = customers.stream().anyMatch(existing ->
                    existing.getId().equals(customer.getId())
                            || existing.getPhone().equals(customer.getPhone()));
            if (duplicate) {
                throw new IllegalArgumentException("Mã hoặc số điện thoại khách hàng đã tồn tại");
            }
            customers.add(customer);
            return null;
        });
    }

    public boolean update(Customer customer) {
        return fileManager.<Customer, Boolean>updateList(FILE_PATH, FileManager.getListType(Customer.class), customers -> {
            for (int i = 0; i < customers.size(); i++) {
                if (customers.get(i).getId().equals(customer.getId())) {
                    customers.set(i, customer);
                    return true;
                }
            }
            return false;
        });
    }

    public boolean delete(String customerId) {
        return fileManager.<Customer, Boolean>updateList(FILE_PATH, FileManager.getListType(Customer.class), customers ->
                customers.removeIf(customer -> customer.getId().equals(customerId)));
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
}
