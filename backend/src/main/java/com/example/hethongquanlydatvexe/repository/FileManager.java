package com.example.hethongquanlydatvexe.repository;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class FileManager {

    private static final Gson GSON = new GsonBuilder()
            .setPrettyPrinting()
            .create();

    public <T> void writeList(
            String filePath,
            List<T> data
    ) {
        validateFilePath(filePath);

        List<T> safeData =
                data == null ? new ArrayList<>() : data;

        File file = prepareFile(filePath);

        try (FileWriter writer = new FileWriter(file)) {
            GSON.toJson(safeData, writer);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Không thể ghi file: " + filePath,
                    e
            );
        }
    }

    public <T> List<T> readList(
            String filePath,
            Type type
    ) {
        validateFilePath(filePath);

        if (type == null) {
            throw new IllegalArgumentException(
                    "Kiểu dữ liệu không được để trống"
            );
        }

        File file = new File(filePath);

        if (!file.exists() || file.length() == 0) {
            return new ArrayList<>();
        }

        try (FileReader reader = new FileReader(file)) {
            List<T> data = GSON.fromJson(reader, type);

            return data == null
                    ? new ArrayList<>()
                    : data;
        } catch (JsonParseException e) {
            throw new RuntimeException(
                    "Dữ liệu JSON không hợp lệ: " + filePath,
                    e
            );
        } catch (IOException e) {
            throw new RuntimeException(
                    "Không thể đọc file: " + filePath,
                    e
            );
        }
    }

    public <T> T readObject(
            String filePath,
            Class<T> clazz
    ) {
        validateFilePath(filePath);

        if (clazz == null) {
            throw new IllegalArgumentException(
                    "Class dữ liệu không được để trống"
            );
        }

        File file = new File(filePath);

        if (!file.exists() || file.length() == 0) {
            return null;
        }

        try (FileReader reader = new FileReader(file)) {
            return GSON.fromJson(reader, clazz);
        } catch (JsonParseException e) {
            throw new RuntimeException(
                    "Dữ liệu JSON không hợp lệ: " + filePath,
                    e
            );
        } catch (IOException e) {
            throw new RuntimeException(
                    "Không thể đọc file: " + filePath,
                    e
            );
        }
    }

    public <T> void writeObject(
            String filePath,
            T object
    ) {
        validateFilePath(filePath);

        File file = prepareFile(filePath);

        try (FileWriter writer = new FileWriter(file)) {
            GSON.toJson(object, writer);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Không thể ghi file: " + filePath,
                    e
            );
        }
    }

    public static <T> Type getListType(
            Class<T> clazz
    ) {
        if (clazz == null) {
            throw new IllegalArgumentException(
                    "Class dữ liệu không được để trống"
            );
        }

        return TypeToken
                .getParameterized(List.class, clazz)
                .getType();
    }

    private File prepareFile(String filePath) {
        File file = new File(filePath);
        File parent = file.getParentFile();

        if (parent != null
                && !parent.exists()
                && !parent.mkdirs()) {

            throw new RuntimeException(
                    "Không thể tạo thư mục: "
                            + parent.getPath()
            );
        }

        return file;
    }

    private void validateFilePath(String filePath) {
        if (filePath == null
                || filePath.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Đường dẫn file không được để trống"
            );
        }
    }
}