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
import pt.dualboot.file_manager.utils.Env;

import java.io.IOException;
import java.net.URISyntaxException;

import static pt.dualboot.file_manager.utils.Constants.ENV_MAP;

@Slf4j
@AllArgsConstructor
@RestController
public class FileController {

    private final FileService fileService;

    @PostMapping("/v1/file")
    public SavedFileDTO uploadFile(@RequestHeader("Origin") String origin, @RequestParam("file") MultipartFile file) throws IOException, URISyntaxException {
        log.info("Uploading file: {}", file.getOriginalFilename());
        if (isProd(origin)) {
            log.info("Production mode... Returning an empty SavedFileDTO object");
            return SavedFileDTO.builder().build();
        }
        return fileService.saveFile(file);
    }

    @GetMapping("/v1/file/{filePath}")
    public FileDataDTO getFile(@RequestHeader("Origin") String origin, @PathVariable String filePath) throws IOException {
        log.info("Retrieving file: {}", filePath);
        if (isProd(origin)) {
            log.warn("Production mode... Returning an empty FileDataDTO object");
            return FileDataDTO.builder().build();
        }
        FileDataDTO fileDTO = fileService.getFileData(filePath);
        return FileDataDTO.builder().name(fileDTO.getName()).build();
    }

    @GetMapping("/v1/file/{filePath}/download")
    public ResponseEntity<byte[]> downloadFile(@RequestHeader(value = "Origin", required = false) String origin, @PathVariable String filePath) throws IOException {
        log.info("Downloading file: {}", filePath);
        if (isProd(origin)) {
            log.warn("Production mode... Returning an empty array");
            return ResponseEntity.ok().body(new byte[0]);
        }
        FileDTO file = fileService.getFileContent(filePath);
        log.info("File retrieved: {}", file.getName());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(file.getName()).build().toString());
        httpHeaders.set(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION);
        return ResponseEntity.ok().headers(httpHeaders).body(file.getContent());
    }

    private boolean isProd(String origin) {
        log.info("Checking if {} is production", origin);
        if (ENV_MAP.containsKey(origin)) {
            return Env.PROD.equals(ENV_MAP.get(origin));
        }
        return true;
    }
}
