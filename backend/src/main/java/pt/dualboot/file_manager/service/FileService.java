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
import java.nio.charset.Charset;
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
        String fileExtension = getFileExtension(file);

        String fileName = UUID.randomUUID() + fileExtension;
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

        if (file.renameTo(originalFile)) {
            FileDTO fileDTO = FileDTO.builder().name(originalFileName).content(Files.readAllBytes(originalFile.toPath())).build();
            if (!originalFile.delete()) {
                log.error("Failed to delete file: {}", originalFileName);
            } else {
                log.info("Deleted file: {}", originalFileName);
            }
            return fileDTO;
        }
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

    private String getFileExtension(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Filename is empty");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

        if(fileExtension.isEmpty()) {
            throw new IllegalArgumentException("Filename extension is empty");
        }
        return fileExtension;
    }

    private String getOriginalFileName(File file) throws IOException {
        UserDefinedFileAttributeView userDefView = Files.getFileAttributeView(file.toPath(), UserDefinedFileAttributeView.class);
        ByteBuffer byteBuffer = ByteBuffer.allocate(userDefView.size(ORIGINAL_NAME_FILE_ATTR));
        userDefView.read(ORIGINAL_NAME_FILE_ATTR, byteBuffer);
        byteBuffer.flip();
        return Charset.defaultCharset().decode(byteBuffer).toString();
    }

    private File getFile(String fileName) throws FileNotFoundException {
        File file = new File(UPLOAD_DIRECTORY + fileName);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found!");
        }
        return file;
    }

}
