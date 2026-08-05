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

    public <T> List<T> readList(String filePath, Type type) {
        try {
            File file = new File(filePath);

            if (!file.exists() || file.length() == 0) {
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
            throw new RuntimeException(
                    "Không thể đọc file: " + filePath
            );
        }
    }

    public <T> void writeList(String filePath, List<T> data) {
        try {
            File file = new File(filePath);
            File parent = file.getParentFile();

            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            FileWriter writer = new FileWriter(file);
            gson.toJson(data, writer);
            writer.close();
        } catch (IOException e) {
            throw new RuntimeException(
                    "Không thể ghi file: " + filePath
            );
        }
    }

    public static <T> Type getListType(Class<T> clazz) {
        return TypeToken
                .getParameterized(List.class, clazz)
                .getType();
    }
}