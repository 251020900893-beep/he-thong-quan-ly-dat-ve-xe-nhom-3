package com.example.hethongquanlydatvexe.repository;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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

    public <T> List<T> readResourceList(String resourcePath, Type type) {
        synchronized (FILE_LOCK) {
            try (InputStream stream = FileManager.class.getResourceAsStream(resourcePath)) {
                if (stream == null) {
                    throw new IllegalStateException("Không tìm thấy dữ liệu mặc định: " + resourcePath);
                }
                try (InputStreamReader reader = new InputStreamReader(stream, StandardCharsets.UTF_8)) {
                    List<T> data = gson.fromJson(reader, type);
                    return data != null ? data : new ArrayList<>();
                }
            } catch (IOException e) {
                throw new RuntimeException("Lỗi đọc dữ liệu mặc định: " + resourcePath, e);
            }
        }
    }

    public <A, B> void replaceTwoLists(
            String firstPath, List<A> firstData,
            String secondPath, List<B> secondData) {
        synchronized (FILE_LOCK) {
            File firstFile = resolveFile(firstPath);
            File secondFile = resolveFile(secondPath);
            byte[] firstBackup = readExistingBytes(firstFile);
            byte[] secondBackup = readExistingBytes(secondFile);
            try {
                writeListUnsafe(firstPath, firstData);
                writeListUnsafe(secondPath, secondData);
            } catch (RuntimeException failure) {
                restoreBytes(firstFile, firstBackup);
                restoreBytes(secondFile, secondBackup);
                throw failure;
            }
        }
    }

    private byte[] readExistingBytes(File file) {
        try {
            return file.exists() ? Files.readAllBytes(file.toPath()) : null;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi sao lưu file database: " + file, e);
        }
    }

    private void restoreBytes(File file, byte[] backup) {
        try {
            if (backup == null) {
                Files.deleteIfExists(file.toPath());
            } else {
                Files.write(file.toPath(), backup);
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi rollback file database: " + file, e);
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

            Path target = file.toPath().toAbsolutePath();
            Path directory = target.getParent();
            Path temporary = Files.createTempFile(directory, file.getName(), ".tmp");
            try (BufferedWriter writer = Files.newBufferedWriter(temporary, StandardCharsets.UTF_8)) {
                gson.toJson(data, writer);
            }

            try {
                Files.move(temporary, target,
                        StandardCopyOption.ATOMIC_MOVE,
                        StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException ex) {
                Files.move(temporary, target, StandardCopyOption.REPLACE_EXISTING);
            } finally {
                Files.deleteIfExists(temporary);
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
