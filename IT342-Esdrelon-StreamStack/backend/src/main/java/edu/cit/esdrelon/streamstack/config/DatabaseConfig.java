package edu.cit.esdrelon.streamstack.config;

import javax.sql.DataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration(proxyBeanMethods = false)
/**
 * SINGLETON PATTERN (Spring Managed)
 * Spring Boot automatically ensures the DataSource is a Singleton.
 */
public class DatabaseConfig {
    // I-delete ang private constructor ug manual DataSourceBuilder
    // Pasagdi lang kini nga class nga empty o butangi lang og comments
    // Ang Spring na ang bahala mokuha sa data gikan sa application.properties
}