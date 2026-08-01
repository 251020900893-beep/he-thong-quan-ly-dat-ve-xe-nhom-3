package com.example.hethongquanlydatvexe.model;

public class Customer extends User {
    private String customerType; // Ví dụ: Thuong, VIP

    public Customer() {
        super();
    }

    public Customer(String id, String fullName, String phone, String email, String customerType) {
        super(id, fullName, phone, email);
        this.customerType = customerType;
    }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }
}