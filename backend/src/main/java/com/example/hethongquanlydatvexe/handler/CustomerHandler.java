package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.Customer;
import com.example.hethongquanlydatvexe.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerHandler {

    // Gọi xuống tầng Service
    private final CustomerService customerService = new CustomerService();

    // ===========================
    // Lấy toàn bộ khách hàng
    // GET /customers
    // ===========================
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {

        List<Customer> customers =
                customerService.getAllCustomers();

        return ResponseEntity.ok(customers);
    }

    // ===========================
    // Tìm khách hàng theo ID
    // GET /customers/{id}
    // ===========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(
            @PathVariable String id) {

        try {

            Customer customer =
                    customerService.findCustomerById(id);

            return ResponseEntity.ok(customer);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Tìm khách hàng theo số điện thoại
    // GET /customers/phone/{phone}
    // ===========================
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> getCustomerByPhone(
            @PathVariable String phone) {

        try {

            Customer customer =
                    customerService.findCustomerByPhone(phone);

            return ResponseEntity.ok(customer);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Tìm khách hàng theo Email
    // GET /customers/email/{email}
    // ===========================
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(
            @PathVariable String email) {

        try {

            Customer customer =
                    customerService.findCustomerByEmail(email);

            return ResponseEntity.ok(customer);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Thêm khách hàng
    // POST /customers
    // ===========================
    @PostMapping
    public ResponseEntity<?> createCustomer(
            @RequestBody Customer customer) {

        try {

            customerService.createCustomer(customer);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Thêm khách hàng thành công.");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Cập nhật khách hàng
    // PUT /customers/{id}
    // ===========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable String id,
            @RequestBody Customer customer) {

        try {

            customer.setId(id);

            customerService.updateCustomer(customer);

            return ResponseEntity.ok(
                    "Cập nhật khách hàng thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Xóa khách hàng
    // DELETE /customers/{id}
    // ===========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(
            @PathVariable String id) {

        try {

            customerService.deleteCustomer(id);

            return ResponseEntity.ok(
                    "Xóa khách hàng thành công."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }
    }

    // ===========================
    // Lọc theo loại khách hàng
    // GET /customers/type/{type}
    // ===========================
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Customer>>
    getCustomersByType(
            @PathVariable String type) {

        List<Customer> customers =
                customerService.findCustomersByType(type);

        return ResponseEntity.ok(customers);
    }

}