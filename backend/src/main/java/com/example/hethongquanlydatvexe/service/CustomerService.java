package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.repository.CustomerRepository;
import com.example.hethongquanlydatvexe.utils.Constants;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService() {
        this(new CustomerRepository());
    }

    public CustomerService(CustomerRepository customerRepository) {
        if (customerRepository == null) {
            throw new IllegalArgumentException(
                    "CustomerRepository không được để trống"
            );
        }

        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer findCustomerById(String customerId) {
        validateText(customerId, "Mã khách hàng");

        Customer customer =
                customerRepository.findById(customerId.trim());

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy khách hàng có mã: " + customerId
            );
        }

        return customer;
    }

    public Customer findCustomerByPhone(String phone) {
        validateText(phone, "Số điện thoại");

        Customer customer =
                customerRepository.findByPhone(phone.trim());

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy khách hàng có số điện thoại: " + phone
            );
        }

        return customer;
    }

    public Customer findCustomerByEmail(String email) {
        validateText(email, "Email");

        Customer customer =
                customerRepository.findByEmail(email.trim());

        if (customer == null) {
            throw new NoSuchElementException(
                    "Không tìm thấy khách hàng có email: " + email
            );
        }

        return customer;
    }

    public Customer createCustomer(Customer customer) {
        validateCustomer(customer);

        if (customerRepository.exists(customer.getId())) {
            throw new IllegalArgumentException(
                    "Mã khách hàng đã tồn tại: " + customer.getId()
            );
        }

        if (customerRepository.phoneExists(customer.getPhone())) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã tồn tại: " + customer.getPhone()
            );
        }

        if (customerRepository.emailExists(customer.getEmail())) {
            throw new IllegalArgumentException(
                    "Email đã tồn tại: " + customer.getEmail()
            );
        }

        customer.setCustomerType(
                normalizeCustomerType(customer.getCustomerType())
        );

        customerRepository.save(customer);

        return customer;
    }

    public Customer updateCustomer(Customer customer) {
        validateCustomer(customer);

        Customer currentCustomer =
                findCustomerById(customer.getId());

        Customer customerByPhone =
                customerRepository.findByPhone(customer.getPhone());

        if (customerByPhone != null
                && !sameText(
                customerByPhone.getId(),
                currentCustomer.getId()
        )) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã được sử dụng bởi khách hàng khác"
            );
        }

        Customer customerByEmail =
                customerRepository.findByEmail(customer.getEmail());

        if (customerByEmail != null
                && !sameText(
                customerByEmail.getId(),
                currentCustomer.getId()
        )) {
            throw new IllegalArgumentException(
                    "Email đã được sử dụng bởi khách hàng khác"
            );
        }

        customer.setCustomerType(
                normalizeCustomerType(customer.getCustomerType())
        );

        boolean updated = customerRepository.update(customer);

        if (!updated) {
            throw new IllegalStateException(
                    "Không thể cập nhật khách hàng: " + customer.getId()
            );
        }

        return customer;
    }

    public boolean deleteCustomer(String customerId) {
        validateText(customerId, "Mã khách hàng");

        if (!customerRepository.exists(customerId.trim())) {
            throw new NoSuchElementException(
                    "Không tìm thấy khách hàng có mã: " + customerId
            );
        }

        return customerRepository.delete(customerId.trim());
    }

    public boolean customerExists(String customerId) {
        if (isBlank(customerId)) {
            return false;
        }

        return customerRepository.exists(customerId.trim());
    }

    public int countCustomers() {
        return customerRepository.count();
    }

    public String classifyCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException(
                    "Thông tin khách hàng không được để trống"
            );
        }

        return normalizeCustomerType(customer.getCustomerType());
    }

    public String classifyCustomerById(String customerId) {
        return classifyCustomer(
                findCustomerById(customerId)
        );
    }

    public List<Customer> getNormalCustomers() {
        return findCustomersByType(
                Constants.CUSTOMER_THUONG
        );
    }

    public List<Customer> getMemberCustomers() {
        return findCustomersByType(
                Constants.CUSTOMER_THANH_VIEN
        );
    }

    public List<Customer> getVipCustomers() {
        return findCustomersByType(
                Constants.CUSTOMER_VIP
        );
    }

    public List<Customer> findCustomersByType(
            String customerType
    ) {
        String expectedType =
                normalizeCustomerType(customerType);

        List<Customer> result = new ArrayList<>();

        for (Customer customer : customerRepository.findAll()) {
            String currentType =
                    normalizeCustomerType(
                            customer.getCustomerType()
                    );

            if (currentType.equals(expectedType)) {
                result.add(customer);
            }
        }

        return result;
    }

    public int countCustomersByType(String customerType) {
        return findCustomersByType(customerType).size();
    }

    public boolean isNormalCustomer(Customer customer) {
        return Constants.CUSTOMER_THUONG.equals(
                classifyCustomer(customer)
        );
    }

    public boolean isMemberCustomer(Customer customer) {
        return Constants.CUSTOMER_THANH_VIEN.equals(
                classifyCustomer(customer)
        );
    }

    public boolean isVipCustomer(Customer customer) {
        return Constants.CUSTOMER_VIP.equals(
                classifyCustomer(customer)
        );
    }

    private void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException(
                    "Khách hàng không được để trống"
            );
        }

        validateText(customer.getId(), "Mã khách hàng");
        validateText(customer.getFullName(), "Họ tên");
        validateText(customer.getPhone(), "Số điện thoại");
        validateText(customer.getEmail(), "Email");
        validateText(
                customer.getCustomerType(),
                "Loại khách hàng"
        );

        normalizeCustomerType(
                customer.getCustomerType()
        );
    }

    private String normalizeCustomerType(String customerType) {
        validateText(
                customerType,
                "Loại khách hàng"
        );

        String normalized = customerType
                .trim()
                .replace(" ", "")
                .replace("_", "")
                .toLowerCase();

        if (normalized.equals("thuong")
                || normalized.equals("khachthuong")) {
            return Constants.CUSTOMER_THUONG;
        }

        if (normalized.equals("thanhvien")
                || normalized.equals("khachthanhvien")) {
            return Constants.CUSTOMER_THANH_VIEN;
        }

        if (normalized.equals("vip")
                || normalized.equals("khachvip")) {
            return Constants.CUSTOMER_VIP;
        }

        throw new IllegalArgumentException(
                "Loại khách hàng không hợp lệ: " + customerType
        );
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

    private void validateText(
            String value,
            String fieldName
    ) {
        if (isBlank(value)) {
            throw new IllegalArgumentException(
                    fieldName + " không được để trống"
            );
        }
    }
}