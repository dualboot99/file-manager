package pt.dualboot.file_manager.utils;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class Constants {
    public static final String UPLOAD_DIRECTORY = System.getProperty("user.home") + File.separator + "file-manager/uploadedFiles" + File.separator;
    public static final String ORIGINAL_NAME_FILE_ATTR = "originalName";
    public static final Map<String, Env> ENV_MAP = new HashMap<>() {{
        put("http://localhost:4200", Env.LOCAL);
        put("http://192.168.1.100", Env.INTERNAL);
        put("https://rmourato-dev.dynip.sapo.pt", Env.PROD);
    }};
    public static final int MAX_FILE_AGE_IN_MS = 7 * 24 * 60 * 60 * 1000;

}
