-- ============================================================================
-- Seed complet EduLearn — à exécuter sur une base FRAÎCHE (après `down -v`)
-- et après que le backend a recréé le schéma (classId en UUID).
-- ============================================================================

-- ===== Admin (admin@edulearn.com / 123456) =====
WITH new_admin AS (
  INSERT INTO users (id, first_name, last_name, email, password, is_active, created_at, role)
  VALUES (gen_random_uuid(), 'Admin', 'EduLearn', 'admin@edulearn.com',
          '$2a$10$jdEtLTrZqLMZ01byo3jj8O3lwExb/eQ6/dIhj9vdKAkuFI88VMGmK',
          true, now(), 'ADMIN')
  RETURNING id
)
INSERT INTO admins (id) SELECT id FROM new_admin;

-- ===== Classes =====
-- Bac (avec filières)
WITH new_class AS (
  INSERT INTO classes (id, title, level, price, created_at)
  VALUES (gen_random_uuid(), 'Bac', 'LYCEE', 30.00, now())
  RETURNING id
)
INSERT INTO class_sections (class_id, section)
SELECT id, s FROM new_class, (VALUES
  ('Mathématiques'),('Sciences expérimentales'),('Sciences techniques'),
  ('Économie et gestion'),('Lettres'),('Sciences de l''informatique'),('Sport')
) AS v(s);

INSERT INTO classes (id, title, level, price, created_at) VALUES
  (gen_random_uuid(), '3ème année', 'LYCEE', 50.00, now()),
  (gen_random_uuid(), '2ème année', 'LYCEE', 20.00, now()),
  (gen_random_uuid(), '1ère année', 'LYCEE', 18.00, now()),
  (gen_random_uuid(), '7ème année', 'COLLEGE', 15.00, now()),
  (gen_random_uuid(), '8ème année', 'COLLEGE', 15.00, now()),
  (gen_random_uuid(), '9ème année', 'COLLEGE', 20.00, now()),
  (gen_random_uuid(), 'Licence Mathématiques', 'UNIV', 50.00, now());

-- Université avec parcours
WITH c AS (
  INSERT INTO classes (id, title, level, price, created_at)
  VALUES (gen_random_uuid(), 'Licence Informatique', 'UNIV', 60.00, now())
  RETURNING id
)
INSERT INTO class_sections (class_id, section)
SELECT id, s FROM c, (VALUES ('Génie logiciel'),('Réseaux'),('Sécurité informatique')) AS v(s);

WITH c AS (
  INSERT INTO classes (id, title, level, price, created_at)
  VALUES (gen_random_uuid(), 'Licence Gestion', 'UNIV', 55.00, now())
  RETURNING id
)
INSERT INTO class_sections (class_id, section)
SELECT id, s FROM c, (VALUES ('Finance'),('Marketing'),('Comptabilité')) AS v(s);

-- ===== Contenu du Bac : cours / chapitres / vidéos =====
-- Cours 1 : Mathématiques
WITH co AS (
  INSERT INTO courses (id, title, description, created_at, class_id)
  VALUES (gen_random_uuid(), 'Mathématiques', 'Cours de mathématiques pour le Bac', now(),
          (SELECT id FROM classes WHERE title = 'Bac' AND level = 'LYCEE'))
  RETURNING id
),
ch AS (
  INSERT INTO chapters (id, title, description, chapter_order, created_at, course_id)
  SELECT gen_random_uuid(), c.title, c.descr, c.ord, now(), co.id
  FROM co, (VALUES
    ('Limites et continuité', 'Notions de limites et de continuité', 1),
    ('Dérivabilité', 'Dérivées et applications', 2)
  ) AS c(title, descr, ord)
  RETURNING id, chapter_order
)
INSERT INTO videos (id, title, description, video_url, video_order, created_at, chapter_id)
SELECT gen_random_uuid(), vid.title, vid.descr, vid.url, vid.ord, now(), ch.id
FROM ch JOIN (VALUES
  (1, 'Introduction aux limites', 'Définition et premiers exemples', 'https://www.youtube.com/watch?v=riXcZT2ICjA', 1),
  (1, 'Calcul de limites',        'Techniques de calcul',            'https://www.youtube.com/watch?v=YNstP0ESndU', 2),
  (2, 'Nombre dérivé et tangente','Définition de la dérivée',        'https://www.youtube.com/watch?v=N2PpRnFqnqY', 1),
  (2, 'Applications des dérivées','Variations et optimisation',      'https://www.youtube.com/watch?v=9vKqVkMQHKk', 2)
) AS vid(chap_ord, title, descr, url, ord) ON vid.chap_ord = ch.chapter_order;

-- Cours 2 : Sciences physiques
WITH co AS (
  INSERT INTO courses (id, title, description, created_at, class_id)
  VALUES (gen_random_uuid(), 'Sciences physiques', 'Cours de physique pour le Bac', now(),
          (SELECT id FROM classes WHERE title = 'Bac' AND level = 'LYCEE'))
  RETURNING id
),
ch AS (
  INSERT INTO chapters (id, title, description, chapter_order, created_at, course_id)
  SELECT gen_random_uuid(), c.title, c.descr, c.ord, now(), co.id
  FROM co, (VALUES
    ('Le dipôle RC', 'Charge et décharge d''un condensateur', 1),
    ('Les ondes',    'Ondes mécaniques et propagation',      2)
  ) AS c(title, descr, ord)
  RETURNING id, chapter_order
)
INSERT INTO videos (id, title, description, video_url, video_order, created_at, chapter_id)
SELECT gen_random_uuid(), vid.title, vid.descr, vid.url, vid.ord, now(), ch.id
FROM ch JOIN (VALUES
  (1, 'Le condensateur',        'Présentation du dipôle RC', 'https://www.youtube.com/watch?v=312phvjkbZw', 1),
  (1, 'Charge et décharge',     'Étude de la réponse du RC', 'https://www.youtube.com/watch?v=ZpVMP9pjFGc', 2),
  (2, 'Introduction aux ondes', 'Notion d''onde mécanique',  'https://www.youtube.com/watch?v=BNHR6IQJGZs', 1),
  (2, 'Propagation des ondes',  'Célérité et période',       'https://www.youtube.com/watch?v=3-xKZKxXuu0', 2)
) AS vid(chap_ord, title, descr, url, ord) ON vid.chap_ord = ch.chapter_order;
