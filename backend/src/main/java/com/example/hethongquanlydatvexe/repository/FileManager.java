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

    private static final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();

    /**
     * Ghi danh sách object xuống file JSON
     */
    public <T> void writeList(String filePath, List<T> data) {
        try {
            File file = new File(filePath);

            File parent = file.getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            FileWriter writer = new FileWriter(file);
            gson.toJson(data, writer);
            writer.flush();
            writer.close();

        } catch (IOException e) {
            throw new RuntimeException("Không thể ghi file: " + filePath, e);
        }
    }

    /**
     * Đọc danh sách object từ file JSON
     */
    public <T> List<T> readList(String filePath, Type type) {

        try {

            File file = new File(filePath);

            if (!file.exists()) {
                return new ArrayList<>();
            }

            if (file.length() == 0) {
                return new ArrayList<>();
            }

            FileReader reader = new FileReader(file);

            List<T> data = gson.fromJson(reader, type);

            reader.close();

            if (data == null) {
                return new ArrayList<>();
            }

            return data;

        } catch (IOException e) {
            throw new RuntimeException("Không thể đọc file: " + filePath, e);
        }
    }

    /**
     * Đọc object đơn
     */
    public <T> T readObject(String filePath, Class<T> clazz) {

        try {

            File file = new File(filePath);

            if (!file.exists()) {
                return null;
            }

            FileReader reader = new FileReader(file);

            T object = gson.fromJson(reader, clazz);

            reader.close();

            return object;

        } catch (IOException e) {
            throw new RuntimeException("Không thể đọc file: " + filePath, e);
        }
    }

    /**
     * Ghi object đơn
     */
    public <T> void writeObject(String filePath, T object) {

        try {

            File file = new File(filePath);

            File parent = file.getParentFile();

            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            FileWriter writer = new FileWriter(file);

            gson.toJson(object, writer);

            writer.flush();

            writer.close();

        } catch (IOException e) {
            throw new RuntimeException("Không thể ghi file: " + filePath, e);
        }
    }

    /**
     * Tạo Type cho List<T>
     */
    public static <T> Type getListType(Class<T> clazz) {
        return TypeToken.getParameterized(List.class, clazz).getType();
    }

}