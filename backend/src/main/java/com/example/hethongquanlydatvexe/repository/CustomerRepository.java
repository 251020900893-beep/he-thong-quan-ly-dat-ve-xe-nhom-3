package com.example.hethongquanlydatvexe.repository;

import com.example.hethongquanlydatvexe.Customer;

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
        List<Customer> customers = findAll();

        customers.add(customer);

        fileManager.writeList(FILE_PATH, customers);
    }

    public boolean update(Customer customer) {
        List<Customer> customers = findAll();

        for (int i = 0; i < customers.size(); i++) {
            if (customers.get(i).getId().equals(customer.getId())) {
                customers.set(i, customer);

                fileManager.writeList(FILE_PATH, customers);

                return true;
            }
        }

        return false;
    }

    public boolean delete(String customerId) {
        List<Customer> customers = findAll();

        for (int i = 0; i < customers.size(); i++) {
            if (customers.get(i).getId().equals(customerId)) {
                customers.remove(i);

                fileManager.writeList(FILE_PATH, customers);

                return true;
            }
        }

        return false;
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