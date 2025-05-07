package pt.dualboot.file_manager.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.nio.file.Files;
import java.util.Date;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static pt.dualboot.file_manager.utils.Constants.MAX_FILE_AGE_IN_MS;
import static pt.dualboot.file_manager.utils.Constants.UPLOAD_DIRECTORY;

@Configuration
@EnableScheduling
@Slf4j
public class DeleteOldFilesScheduler {

    @Scheduled(fixedRate = 600000)
    public void deleteOldFiles() {
        log.info("Deleting old files");

        Set<String> fileSet = Stream.of(Objects.requireNonNull(new File(UPLOAD_DIRECTORY).listFiles()))
                .filter(file -> !file.isDirectory())
                .map(File::getAbsolutePath)
                .collect(Collectors.toSet());

        fileSet.forEach(path -> {
            File file = new File(path);
            long diff = new Date().getTime() - file.lastModified();

            if (diff > MAX_FILE_AGE_IN_MS) {
                log.info("Deleting {} because the modified date is {}", file.getName(), new Date(file.lastModified()));
                boolean fileDeleted = file.delete();
                if (fileDeleted) {
                    log.info("Deleted old file {}", path);
                } else {
                    log.error("Failed to delete old file {}", path);
                }
            }
        });


    }
}
