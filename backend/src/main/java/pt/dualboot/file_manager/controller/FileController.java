package pt.dualboot.file_manager.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pt.dualboot.file_manager.model.FileDTO;
import pt.dualboot.file_manager.model.FileDataDTO;
import pt.dualboot.file_manager.model.SavedFileDTO;
import pt.dualboot.file_manager.service.FileService;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:4200/,https://rmourato-dev.dynip.sapo.pt", maxAge = 3600)
@Slf4j
@AllArgsConstructor
@RestController
public class FileController {

    private final FileService fileService;

    @PostMapping("/v1/file")
    public SavedFileDTO uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        log.info("Uploading file: {}", file.getOriginalFilename());
        return fileService.saveFile(file);
    }

    @GetMapping("/v1/file/{filePath}")
    public FileDataDTO getFile(@PathVariable String filePath) throws IOException {
        log.info("Retrieving file: {}", filePath);
        FileDataDTO fileDTO = fileService.getFileData(filePath);
        return FileDataDTO.builder().name(fileDTO.getName()).build();
    }

    @GetMapping("/v1/file/{filePath}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String filePath) throws IOException {
        log.info("Downloading file: {}", filePath);

        FileDTO file = fileService.getFileContent(filePath);

        log.info("File retrieved: {}", file.getName());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.getName()).build().toString());
        return ResponseEntity.ok().headers(httpHeaders).body(file.getContent());
    }
}
