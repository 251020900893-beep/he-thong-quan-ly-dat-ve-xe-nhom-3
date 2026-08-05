package com.example.hethongquanlydatvexe.service;

import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.repository.CustomerRepository;

import java.util.ArrayList;
import java.util.List;

public class CustomerService {

    private static final String TYPE_NORMAL = "Thuong";
    private static final String TYPE_MEMBER = "ThanhVien";
    private static final String TYPE_VIP = "VIP";

    private final CustomerRepository customerRepository;

    public CustomerService() {
        this.customerRepository = new CustomerRepository();
    }

    public CustomerService(CustomerRepository customerRepository) {
        if (customerRepository == null) {
            throw new IllegalArgumentException(
                    "CustomerRepository không được để trống"
            );
        }

        this.customerRepository = customerRepository;
    }

    // Lấy toàn bộ khách hàng
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Tìm khách hàng theo mã
    public Customer findCustomerById(String customerId)
            throws Exception {

        validateText(customerId, "Mã khách hàng");

        Customer customer = customerRepository.findById(
                customerId.trim()
        );

        if (customer == null) {
            throw new Exception(
                    "Không tìm thấy khách hàng có mã: "
                            + customerId
            );
        }

        return customer;
    }

    // Kiểm tra khách hàng có tồn tại
    public boolean customerExists(String customerId) {
        if (customerId == null
                || customerId.trim().isEmpty()) {

            return false;
        }

        return customerRepository.exists(
                customerId.trim()
        );
    }

    // Đếm tổng số khách hàng
    public int countCustomers() {
        return customerRepository.count();
    }

    // Phân loại khách hàng theo đối tượng Customer
    public String classifyCustomer(Customer customer)
            throws Exception {

        if (customer == null) {
            throw new Exception(
                    "Thông tin khách hàng không được để trống"
            );
        }

        return normalizeCustomerType(
                customer.getCustomerType()
        );
    }

    // Tìm khách theo mã rồi phân loại
    public String classifyCustomerById(String customerId)
            throws Exception {

        Customer customer = findCustomerById(customerId);

        return classifyCustomer(customer);
    }

    // Lấy danh sách khách thường
    public List<Customer> getNormalCustomers()
            throws Exception {

        return findCustomersByType(TYPE_NORMAL);
    }

    // Lấy danh sách khách thành viên
    public List<Customer> getMemberCustomers()
            throws Exception {

        return findCustomersByType(TYPE_MEMBER);
    }

    // Lấy danh sách khách VIP
    public List<Customer> getVipCustomers()
            throws Exception {

        return findCustomersByType(TYPE_VIP);
    }

    // Lọc khách hàng theo loại
    public List<Customer> findCustomersByType(
            String customerType
    ) throws Exception {

        String normalizedType =
                normalizeCustomerType(customerType);

        List<Customer> result = new ArrayList<>();

        for (Customer customer
                : customerRepository.findAll()) {

            String currentType =
                    normalizeCustomerType(
                            customer.getCustomerType()
                    );

            if (currentType.equals(normalizedType)) {
                result.add(customer);
            }
        }

        return result;
    }

    // Đếm khách hàng theo loại
    public int countCustomersByType(String customerType)
            throws Exception {

        String normalizedType =
                normalizeCustomerType(customerType);

        int count = 0;

        for (Customer customer
                : customerRepository.findAll()) {

            String currentType =
                    normalizeCustomerType(
                            customer.getCustomerType()
                    );

            if (currentType.equals(normalizedType)) {
                count++;
            }
        }

        return count;
    }

    // Kiểm tra khách có phải khách thường
    public boolean isNormalCustomer(Customer customer)
            throws Exception {

        return TYPE_NORMAL.equals(
                classifyCustomer(customer)
        );
    }

    // Kiểm tra khách có phải thành viên
    public boolean isMemberCustomer(Customer customer)
            throws Exception {

        return TYPE_MEMBER.equals(
                classifyCustomer(customer)
        );
    }

    // Kiểm tra khách có phải VIP
    public boolean isVipCustomer(Customer customer)
            throws Exception {

        return TYPE_VIP.equals(
                classifyCustomer(customer)
        );
    }

    // Chuẩn hóa cách viết loại khách hàng
    private String normalizeCustomerType(
            String customerType
    ) throws Exception {

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
                || normalized.equals("khachthuong")
                || normalized.equals("normal")) {

            return TYPE_NORMAL;
        }

        if (normalized.equals("thanhvien")
                || normalized.equals("khachthanhvien")
                || normalized.equals("member")) {

            return TYPE_MEMBER;
        }

        if (normalized.equals("vip")
                || normalized.equals("khachvip")) {

            return TYPE_VIP;
        }

        throw new Exception(
                "Loại khách hàng không hợp lệ: "
                        + customerType
        );
    }

    // Kiểm tra dữ liệu chuỗi đầu vào
    private void validateText(
            String value,
            String fieldName
    ) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    fieldName + " không được để trống"
            );
        }
    }
}