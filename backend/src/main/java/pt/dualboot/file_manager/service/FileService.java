package pt.dualboot.file_manager.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pt.dualboot.file_manager.model.FileDTO;
import pt.dualboot.file_manager.model.FileDataDTO;
import pt.dualboot.file_manager.model.SavedFileDTO;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.attribute.UserDefinedFileAttributeView;
import java.util.Objects;
import java.util.UUID;

import static pt.dualboot.file_manager.utils.Constants.ORIGINAL_NAME_FILE_ATTR;
import static pt.dualboot.file_manager.utils.Constants.UPLOAD_DIRECTORY;

@Slf4j
@Service
public class FileService {

    public SavedFileDTO saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString();
        log.info("Renaming file to {}", fileName);
        String filePath = UPLOAD_DIRECTORY + fileName;

        if(!new File(UPLOAD_DIRECTORY).exists()){
            log.info("Upload directory {} does not exist... Creating it!", UPLOAD_DIRECTORY);
            boolean dirCreated = new File(UPLOAD_DIRECTORY).mkdirs();
            if(!dirCreated){
                log.error("Failed to create directory: {}", UPLOAD_DIRECTORY);
                throw new RuntimeException("Failed to create directory");
            }
            log.info("Upload directory created successfully!");
        }

        log.info("Saving file: {} in {}", fileName, filePath);
        File dest = new File(filePath);
        file.transferTo(dest);
        UserDefinedFileAttributeView userDefView = Files.getFileAttributeView(dest.toPath(), UserDefinedFileAttributeView.class);
        userDefView.write(ORIGINAL_NAME_FILE_ATTR, ByteBuffer.wrap(Objects.requireNonNull(file.getOriginalFilename()).getBytes(StandardCharsets.UTF_8)));

        log.info("Saved file: {} in {}", fileName, dest.getAbsolutePath());

        return SavedFileDTO.builder().path(fileName).build();
    }

    public FileDTO getFileContent(String fileName) throws IOException {
        File file = getFile(fileName);
        String originalFileName = getOriginalFileName(file);
        File originalFile = new File(UPLOAD_DIRECTORY + originalFileName);
        log.info("Renaming to original file: {}", originalFile.getName());
        if (file.renameTo(originalFile)) {
            log.info("File renamed successfully... Deleting it!");
            FileDTO fileDTO = FileDTO.builder().name(originalFileName).content(Files.readAllBytes(originalFile.toPath())).build();
            if (!originalFile.delete()) {
                log.error("Failed to delete file: {}", originalFileName);
            } else {
                log.info("Deleted file: {}", originalFileName);
            }
            return fileDTO;
        }
        log.error("Failed to rename file: {}", originalFileName);
        log.info("Deleting file: {}", fileName);
        if (!file.delete()) {
            log.error("Failed to delete file: {}", fileName);
        } else {
            log.info("Deleted file: {}", fileName);
        }
        throw new FileNotFoundException("Failed to rename file!");
    }

    public FileDataDTO getFileData(String fileName) throws IOException {
        File file = getFile(fileName);
        return FileDataDTO.builder().name(getOriginalFileName(file)).build();
    }

    private String getOriginalFileName(File file) throws IOException {
        log.info("Getting original name of file: {}", file.getName());
        UserDefinedFileAttributeView userDefView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView.class);
        ByteBuffer byteBuffer = ByteBuffer.allocate(userDefView.size(ORIGINAL_NAME_FILE_ATTR));
        userDefView.read(ORIGINAL_NAME_FILE_ATTR, byteBuffer);
        byteBuffer.flip();
        String originalName = new String(byteBuffer.array(), StandardCharsets.UTF_8);
        log.info("Original name of file: {}", originalName);
        return originalName;
    }

    private File getFile(String fileName) throws FileNotFoundException {
        String filePath = UPLOAD_DIRECTORY + fileName;
        log.info("Getting file: {}", filePath);
        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found!");
        }
        return file;
    }

}
