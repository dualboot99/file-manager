package pt.dualboot.file_manager.model;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class SavedFileDTO {
    String path;
}
