package com.example.hethongquanlydatvexe.repository;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class FileManager {

    private final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();

    private File resolveFile(String filePath) {
        File file = new File(filePath);
        if (file.exists()) return file;

        // Nếu chạy từ thư mục root thì kiểm tra thư mục backend/
        File backendFile = new File("backend/" + filePath);
        if (backendFile.exists()) return backendFile;

        // Nếu chạy từ backend/ mà path là backend/data
        if (filePath.startsWith("backend/")) {
            File directFile = new File(filePath.replace("backend/", ""));
            if (directFile.exists()) return directFile;
        }

        return file; // Trả về file ban đầu để tạo mới nếu cần
    }

    public synchronized <T> List<T> readList(String filePath, Type type) {
        try {
            File file = resolveFile(filePath);

            if (!file.exists() || file.length() == 0) {
                return new ArrayList<>();
            }

            try (FileReader reader = new FileReader(file)) {
                List<T> data = gson.fromJson(reader, type);
                return (data != null) ? data : new ArrayList<>();
            }
        } catch (IOException e) {
            System.err.println("Cảnh báo: Không thể đọc file " + filePath + ", tạo danh sách rỗng.");
            return new ArrayList<>();
        }
    }

    public synchronized <T> void writeList(String filePath, List<T> data) {
        try {
            File file = resolveFile(filePath);
            File parent = file.getParentFile();

            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            try (FileWriter writer = new FileWriter(file)) {
                gson.toJson(data, writer);
            }
        } catch (IOException e) {
            throw new RuntimeException("Không thể ghi file: " + filePath, e);
        }
    }

    public static <T> Type getListType(Class<T> clazz) {
        return TypeToken.getParameterized(List.class, clazz).getType();
    }
}