package com.example.hethongquanlydatvexe.handler;

import com.example.hethongquanlydatvexe.model.Customer;
import com.example.hethongquanlydatvexe.dto.ApiResponse;
import com.example.hethongquanlydatvexe.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/customers", "/api/customers"})
@CrossOrigin(origins = "*")
public class CustomerHandler {

    private final CustomerService customerService = new CustomerService();

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.ok(customers, "Lấy danh sách khách hàng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.findCustomerById(id);
        return ResponseEntity.ok(ApiResponse.ok(customer, "Tìm thấy thông tin khách hàng"));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByPhone(@PathVariable String phone) {
        Customer customer = customerService.findCustomerByPhone(phone);
        return ResponseEntity.ok(ApiResponse.ok(customer, "Tìm thấy thông tin khách hàng"));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByEmail(@PathVariable String email) {
        Customer customer = customerService.findCustomerByEmail(email);
        return ResponseEntity.ok(ApiResponse.ok(customer, "Tìm thấy thông tin khách hàng"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createCustomer(@RequestBody Customer customer) {
        customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(null, "Thêm khách hàng thành công."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateCustomer(
            @PathVariable String id,
            @RequestBody Customer customer) {
        customer.setId(id);
        customerService.updateCustomer(customer);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cập nhật thông tin khách hàng thành công."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa khách hàng thành công."));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomersByType(@PathVariable String type) {
        List<Customer> customers = customerService.findCustomersByType(type);
        return ResponseEntity.ok(ApiResponse.ok(customers, "Lấy danh sách khách hàng theo loại thành công"));
    }
}