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

    public Customer findById(String id) {

        List<Customer> customers = findAll();

        for (Customer customer : customers) {
            if (customer.getId().equals(id)) {
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

    public boolean delete(String id) {

        List<Customer> customers = findAll();

        boolean removed = customers.removeIf(customer ->
                customer.getId().equals(id));

        if (removed) {
            fileManager.writeList(FILE_PATH, customers);
        }

        return removed;
    }

    public boolean exists(String id) {
        return findById(id) != null;
    }

    public int count() {
        return findAll().size();
    }

}