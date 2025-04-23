package pt.dualboot.file_manager.utils;

import java.io.File;

public class Constants {
    public static final String UPLOAD_DIRECTORY = System.getProperty("user.home") + File.separator + "file-manager/uploadedFiles" + File.separator;
    public static final String ORIGINAL_NAME_FILE_ATTR = "originalName";
}
