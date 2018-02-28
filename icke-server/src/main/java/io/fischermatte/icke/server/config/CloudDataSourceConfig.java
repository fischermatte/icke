package io.fischermatte.icke.server.config;

import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.cloud.service.PooledServiceConnectorConfig;
import org.springframework.cloud.service.relational.DataSourceConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile({"cloud"})
public class CloudDataSourceConfig extends AbstractCloudConfig {

    @Bean
    public DataSource dataSource() {
        // FAB put in for pooling (min=5,max=30,wait=3000)
        PooledServiceConnectorConfig.PoolConfig poolConfig = new PooledServiceConnectorConfig.PoolConfig(1, 5, 3000);
        DataSourceConfig dataSourceConfig = new DataSourceConfig(poolConfig, null);
        return connectionFactory().dataSource(dataSourceConfig);
    }

}
