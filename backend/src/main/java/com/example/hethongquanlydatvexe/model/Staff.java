package com.example.hethongquanlydatvexe.model;

public class Staff extends User {
    private String role; // Ví dụ: QuanLy, NhanVienBanVe

    public Staff() {
        super();
    }

    public Staff(String id, String fullName, String phone, String email, String role) {
        super(id, fullName, phone, email);
        this.role = role;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}