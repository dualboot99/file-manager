package pt.dualboot.file_manager.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static pt.dualboot.file_manager.utils.Constants.ENV_MAP;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = ENV_MAP.keySet().toArray(new String[0]);

        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .maxAge(3600);
    }
}