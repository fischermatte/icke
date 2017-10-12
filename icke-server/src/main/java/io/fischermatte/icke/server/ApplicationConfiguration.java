package io.fischermatte.icke.server;

import io.fischermatte.icke.server.bootstrap.DataInitializer;
import io.fischermatte.icke.server.project.data.Project;
import io.fischermatte.icke.server.project.data.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;

@EnableAsync
@Configuration
public class ApplicationConfiguration {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationConfiguration.class);

    @Autowired
    private DataInitializer dataInitializer;

    /**
     * TaskExecutor so we can use @Async annotation. E.g. when sending emails.
     */
    @Bean
    public Executor taskExecutor() {
        return new SimpleAsyncTaskExecutor();
    }

    @Bean
    public ProjectRepository projectRepository() {
        return new ProjectRepository() {
            private List<Project> projects = new ArrayList<>();

            @Override
            public Project findOne(UUID projectId) {
                return this.projects.stream().filter(project -> project.getId().equals(projectId))
                        .findFirst().orElse(null);
            }

            @Override
            public List<Project> findAll() {
                return projects;
            }

            @Override
            public void save(List<Project> projects) {
                this.projects = projects;
            }
        };
    }

    @PostConstruct
    public void onInit() {
        LOG.info("inserting test data... ");
        dataInitializer.intialize();
    }


}
