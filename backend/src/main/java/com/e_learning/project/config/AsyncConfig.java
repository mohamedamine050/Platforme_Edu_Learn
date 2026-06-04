package com.e_learning.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

// Pool de threads borné pour les tâches @Async (envoi d'emails).
// Bonne pratique : on évite le SimpleAsyncTaskExecutor par défaut, qui crée un
// thread illimité par appel. Ici la file et le nombre de threads sont plafonnés.
@Configuration
public class AsyncConfig {

    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-mail-");
        executor.initialize();
        return executor;
    }
}
