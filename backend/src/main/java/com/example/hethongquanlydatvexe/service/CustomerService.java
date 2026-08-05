package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.repository.CustomerRepository;
import com.example.hethongquanlydatvexe.utils.Constants;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class CustomerService {

    private final CustomerRepository customerRepository =
            new CustomerRepository();

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer findCustomerById(String customerId) {
        Customer customer = customerRepository.findById(customerId);

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy khách hàng: " + customerId
            );
        }

        return customer;
    }

    public Customer findCustomerByPhone(String phone) {
        Customer customer = customerRepository.findByPhone(phone);

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy số điện thoại: " + phone
            );
        }

        return customer;
    }

    public Customer findCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy email: " + email
            );
        }

        return customer;
    }

    public void createCustomer(Customer customer) {
        validateCustomer(customer);

        if (customerRepository.exists(customer.getId())) {
            throw new IllegalArgumentException(
                    "Mã khách hàng đã tồn tại"
            );
        }

        if (customerRepository.phoneExists(customer.getPhone())) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã tồn tại"
            );
        }

        if (customerRepository.emailExists(customer.getEmail())) {
            throw new IllegalArgumentException(
                    "Email đã tồn tại"
            );
        }

        customerRepository.save(customer);
    }

    public boolean updateCustomer(Customer customer) {
        validateCustomer(customer);

        if (!customerRepository.exists(customer.getId())) {
            throw new NoSuchElementException(
                    "Khách hàng không tồn tại"
            );
        }

        return customerRepository.update(customer);
    }

    public boolean deleteCustomer(String customerId) {
        if (!customerRepository.exists(customerId)) {
            throw new NoSuchElementException(
                    "Khách hàng không tồn tại"
            );
        }

        return customerRepository.delete(customerId);
    }

    public List<Customer> findCustomersByType(String customerType) {
        List<Customer> result = new ArrayList<>();
        List<Customer> customers = customerRepository.findAll();

        for (Customer customer : customers) {
            if (customer.getCustomerType().equals(customerType)) {
                result.add(customer);
            }
        }

        return result;
    }

    public boolean isVipCustomer(Customer customer) {
        return customer.getCustomerType()
                .equals(Constants.CUSTOMER_VIP);
    }

    private void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException(
                    "Khách hàng không được để trống"
            );
        }

        if (customer.getId() == null
                || customer.getId().isEmpty()) {
            throw new IllegalArgumentException(
                    "Mã khách hàng không được để trống"
            );
        }

        if (customer.getFullName() == null
                || customer.getFullName().isEmpty()) {
            throw new IllegalArgumentException(
                    "Họ tên không được để trống"
            );
        }

        if (customer.getPhone() == null
                || customer.getPhone().isEmpty()) {
            throw new IllegalArgumentException(
                    "Số điện thoại không được để trống"
            );
        }

        if (customer.getEmail() == null
                || customer.getEmail().isEmpty()) {
            throw new IllegalArgumentException(
                    "Email không được để trống"
            );
        }

        String type = customer.getCustomerType();

        if (!type.equals(Constants.CUSTOMER_THUONG)
                && !type.equals(Constants.CUSTOMER_THANH_VIEN)
                && !type.equals(Constants.CUSTOMER_VIP)) {
            throw new IllegalArgumentException(
                    "Loại khách hàng không hợp lệ"
            );
        }
    }
}