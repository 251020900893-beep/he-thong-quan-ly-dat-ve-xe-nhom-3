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
import java.util.function.Function;

public class FileManager {

    /**
     * Shared file-system lock trong cùng JVM.
     *
     * Quan trọng:
     * - readList() khóa read đơn lẻ.
     * - writeList() khóa write đơn lẻ.
     * - updateList() khóa toàn bộ READ -> MODIFY -> WRITE.
     */
    private static final Object FILE_LOCK = new Object();

    private final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();

    private File resolveFile(String filePath) {
        File file = new File(filePath);

        if (file.exists()) {
            return file;
        }

        File backendFile = new File("backend/" + filePath);

        if (backendFile.exists()) {
            return backendFile;
        }

        if (filePath.startsWith("backend/")) {
            File directFile =
                    new File(filePath.replace("backend/", ""));

            if (directFile.exists()) {
                return directFile;
            }
        }

        return file;
    }

    /**
     * Read-only operation.
     */
    public <T> List<T> readList(
            String filePath,
            Type type
    ) {
        synchronized (FILE_LOCK) {
            return readListUnsafe(filePath, type);
        }
    }

    /**
     * Write-only operation.
     */
    public <T> void writeList(
            String filePath,
            List<T> data
    ) {
        synchronized (FILE_LOCK) {
            writeListUnsafe(filePath, data);
        }
    }

    /**
     * Atomic READ -> MODIFY -> WRITE.
     *
     * Đây là operation quan trọng để tránh:
     *
     * Thread A: read
     * Thread B: read
     * Thread A: modify/write
     * Thread B: modify/write
     *
     * dẫn tới lost update.
     */
    public <T, R> R updateList(
            String filePath,
            Type type,
            Function<List<T>, R> operation
    ) {
        if (operation == null) {
            throw new IllegalArgumentException(
                    "Operation không được để null"
            );
        }

        synchronized (FILE_LOCK) {

            List<T> data =
                    readListUnsafe(filePath, type);

            R result =
                    operation.apply(data);

            writeListUnsafe(filePath, data);

            return result;
        }
    }

    /**
     * Read implementation.
     *
     * Method này KHÔNG tự synchronized.
     * Caller phải đảm bảo đã giữ FILE_LOCK.
     */
    private <T> List<T> readListUnsafe(
            String filePath,
            Type type
    ) {
        try {
            File file = resolveFile(filePath);

            if (!file.exists() || file.length() == 0) {
                return new ArrayList<>();
            }

            try (FileReader reader = new FileReader(file)) {

                List<T> data =
                        gson.fromJson(reader, type);

                return data != null
                        ? data
                        : new ArrayList<>();
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Lỗi đọc file database: "
                            + filePath,
                    e
            );
        }
    }

    /**
     * Write implementation.
     *
     * Method này KHÔNG tự synchronized.
     * Caller phải đảm bảo đã giữ FILE_LOCK.
     */
    private <T> void writeListUnsafe(
            String filePath,
            List<T> data
    ) {
        try {
            File file =
                    resolveFile(filePath);

            File parent =
                    file.getParentFile();

            if (parent != null
                    && !parent.exists()) {

                parent.mkdirs();
            }

            try (FileWriter writer =
                         new FileWriter(file)) {

                gson.toJson(data, writer);
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Lỗi ghi file database: "
                            + filePath,
                    e
            );
        }
    }

    public static <T> Type getListType(
            Class<T> clazz
    ) {
        return TypeToken
                .getParameterized(
                        List.class,
                        clazz
                )
                .getType();
    }
}