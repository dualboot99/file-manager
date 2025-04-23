package pt.dualboot.file_manager.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavedFileDTO {
    String path;
}
