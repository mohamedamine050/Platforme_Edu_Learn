package com.e_learning.project.config;

import com.e_learning.project.model.*;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Données de démonstration (classes, cours, chapitres, vidéos) — DEV uniquement (profil "dev").
 * Idempotent : ne fait rien si des classes existent déjà.
 * L'administrateur par défaut est créé par {@link AdminInitializer} (tous environnements).
 */
@Component
@Profile("dev")
@Order(2) // après AdminInitializer
public class DevDataInitializer implements CommandLineRunner {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;

    public DevDataInitializer(ClassRepository classRepository, CourseRepository courseRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (classRepository.count() > 0) {
            return; // déjà initialisé
        }

        // Classes
        ClassEntity bac = seedClass("Bac", "LYCEE", new BigDecimal("30.00"), List.of(
                "Mathématiques", "Sciences expérimentales", "Sciences techniques",
                "Économie et gestion", "Lettres", "Sciences de l'informatique", "Sport"));
        seedClass("3ème année", "LYCEE", new BigDecimal("50.00"), List.of());
        seedClass("2ème année", "LYCEE", new BigDecimal("20.00"), List.of());
        seedClass("1ère année", "LYCEE", new BigDecimal("18.00"), List.of());
        seedClass("7ème année", "COLLEGE", new BigDecimal("15.00"), List.of());
        seedClass("8ème année", "COLLEGE", new BigDecimal("15.00"), List.of());
        seedClass("9ème année", "COLLEGE", new BigDecimal("20.00"), List.of());
        seedClass("Licence Mathématiques", "UNIV", new BigDecimal("50.00"), List.of());
        seedClass("Licence Informatique", "UNIV", new BigDecimal("60.00"),
                List.of("Génie logiciel", "Réseaux", "Sécurité informatique"));
        seedClass("Licence Gestion", "UNIV", new BigDecimal("55.00"),
                List.of("Finance", "Marketing", "Comptabilité"));

        // Cours du Bac : Mathématiques (commun à toutes les sections)
        CourseEntity maths = newCourse(bac, "Mathématiques", "Cours de mathématiques pour le Bac");
        addChapter(maths, "Limites et continuité", "Notions de limites et de continuité", 1,
                new String[][]{
                        {"Introduction aux limites", "Définition et premiers exemples", "https://www.youtube.com/watch?v=riXcZT2ICjA"},
                        {"Calcul de limites", "Techniques de calcul", "https://www.youtube.com/watch?v=YNstP0ESndU"}});
        addChapter(maths, "Dérivabilité", "Dérivées et applications", 2,
                new String[][]{
                        {"Nombre dérivé et tangente", "Définition de la dérivée", "https://www.youtube.com/watch?v=N2PpRnFqnqY"},
                        {"Applications des dérivées", "Variations et optimisation", "https://www.youtube.com/watch?v=9vKqVkMQHKk"}});
        courseRepository.save(maths);

        // Cours du Bac : Sciences physiques (réservé aux sections scientifiques)
        CourseEntity phys = newCourse(bac, "Sciences physiques", "Cours de physique pour le Bac");
        bac.getSections().stream()
                .filter(s -> s.getName().equals("Sciences expérimentales") || s.getName().equals("Sciences techniques"))
                .forEach(s -> phys.getSections().add(s));
        addChapter(phys, "Le dipôle RC", "Charge et décharge d'un condensateur", 1,
                new String[][]{
                        {"Le condensateur", "Présentation du dipôle RC", "https://www.youtube.com/watch?v=312phvjkbZw"},
                        {"Charge et décharge", "Étude de la réponse du RC", "https://www.youtube.com/watch?v=ZpVMP9pjFGc"}});
        addChapter(phys, "Les ondes", "Ondes mécaniques et propagation", 2,
                new String[][]{
                        {"Introduction aux ondes", "Notion d'onde mécanique", "https://www.youtube.com/watch?v=BNHR6IQJGZs"},
                        {"Propagation des ondes", "Célérité et période", "https://www.youtube.com/watch?v=3-xKZKxXuu0"}});
        courseRepository.save(phys);
    }

    private ClassEntity seedClass(String title, String level, BigDecimal price, List<String> sectionNames) {
        ClassEntity c = ClassEntity.builder().title(title).level(level).price(price).build();
        // Par défaut, chaque section démarre au prix de la classe (modifiable ensuite dans l'admin).
        sectionNames.forEach(n -> c.getSections().add(
                SectionEntity.builder().name(n).price(price).classEntity(c).build()));
        return classRepository.save(c);
    }

    private CourseEntity newCourse(ClassEntity clazz, String title, String description) {
        return CourseEntity.builder().title(title).description(description).classEntity(clazz).build();
    }

    // Ajoute un chapitre (avec ses vidéos) à un cours. videos[i] = {titre, description, url}
    private void addChapter(CourseEntity course, String title, String description, int order, String[][] videos) {
        ChapterEntity chapter = ChapterEntity.builder()
                .title(title).description(description).chapterOrder(order).course(course).build();
        int vo = 1;
        for (String[] v : videos) {
            chapter.getVideos().add(VideoEntity.builder()
                    .title(v[0]).description(v[1]).videoUrl(v[2]).videoOrder(vo++).chapter(chapter).build());
        }
        course.getChapters().add(chapter);
    }
}
