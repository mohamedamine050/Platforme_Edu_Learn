import MainLayout from "../component/MainLayout";

const Offers = () => {
  const levelSections = [
    {
      level: "7ème",
      sections: [
        { name: "Collège", icon: "📚", description: "Tous les cours de 7ème", courses: 120, price: "7.99DT" },
      ]
    },
    {
      level: "8ème",
      sections: [
        { name: "Collège", icon: "📚", description: "Tous les cours de 8ème", courses: 125, price: "7.99DT" },
      ]
    },
    {
      level: "9ème",
      sections: [
        { name: "Collège", icon: "📚", description: "Tous les cours de 9ème", courses: 130, price: "9.99DT" },
      ]
    },
    {
      level: "1ère",
      sections: [
        { name: "Technique", icon: "🔧", description: "Mécanique, électronique et informatique appliquée", courses: 45, price: "12.99DT" },
        { name: "Science", icon: "🔬", description: "Sciences naturelles, physique et chimie", courses: 50, price: "12.99DT" },
        { name: "Général", icon: "📚", description: "Littérature, histoire et géographie", courses: 42, price: "12.99DT" },
      ]
    },
    {
      level: "2ème",
      sections: [
        { name: "Technique", icon: "🔧", description: "Approfondissement technique et technologie", courses: 48, price: "12.99DT" },
        { name: "Science", icon: "🔬", description: "Biologie, chimie avancée et physique", courses: 52, price: "12.99DT" },
        { name: "Français", icon: "📖", description: "Maîtrisez la grammaire et la littérature", courses: 45, price: "12.99DT" },
        { name: "Math", icon: "🧮", description: "Algèbre, géométrie et calcul avancé", courses: 55, price: "12.99DT" },
      ]
    },
    {
      level: "3ème",
      sections: [
        { name: "Technique", icon: "🔧", description: "Préparation technique pour le BAC", courses: 50, price: "14.99DT" },
        { name: "Science", icon: "🔬", description: "Biologie, chimie et physique intensifs", courses: 58, price: "14.99DT" },
        { name: "Géographie", icon: "🌍", description: "Géographie, environnement et société", courses: 40, price: "14.99DT" },
        { name: "Philosophie", icon: "🤔", description: "Éthique, logique et métaphysique", courses: 38, price: "14.99DT" },
      ]
    },
    {
      level: "BAC",
      sections: [
        { name: "Sciences", icon: "🔬", description: "Biologie, chimie et physique pour l'examen final", courses: 68, price: "17.99DT" },
        { name: "Mathématiques", icon: "📊", description: "Analyse, algèbre linéaire et probabilités intensives", courses: 65, price: "17.99DT" },
        { name: "Technique", icon: "🔧", description: "Spécialités techniques du BAC", courses: 52, price: "17.99DT" },
        { name: "Littéraire", icon: "✒️", description: "Littérature, philosophie et histoire", courses: 48, price: "17.99DT" },
      ]
    }
  ];

  return (
    <MainLayout>
      <section className="offers">
        <div className="offersHeader">
          <h1>Nos Offres d'Abonnement</h1>
          <p>Explorez nos cours par niveau et section</p>
        </div>

        {/* Collège Section - Displayed in Parallel */}
        <div className="collegeSection">
          <div className="levelSectionHeader">
            <h2 className="levelTitle">Collège</h2>
          </div>
          <div className="collegeLevelsGrid">
            {levelSections.slice(0, 3).map((levelGroup, levelIdx) => (
              <div key={levelIdx} className="collegeLevelCard">
                <div className="collegeLevelIcon">📚</div>
                <h3>{levelGroup.level}</h3>
                {levelGroup.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <p className="collegeDescription">{section.description}</p>
                    <div className="collegeLevelStats">
                      <span>{section.courses} cours</span>
                      <span className="sectionPrice">{section.price}</span>
                    </div>
                    <button className="viewCoursesBtn">Voir les cours</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Lycée Section - Displayed Vertically */}
        <div className="lyceeSection">
          <div className="levelSectionHeader">
            <h2 className="levelTitle">Lycée</h2>
          </div>
          {levelSections.slice(3).map((levelGroup, levelIdx) => (
            <div key={levelIdx + 3} className="levelSection">
              <div className="levelSectionHeader">
                <h2 className="levelTitle">{levelGroup.level}</h2>
              </div>

              <div className="sectionsGrid">
                {levelGroup.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="sectionCard">
                    <div className="sectionLevel">{levelGroup.level} - {section.name}</div>
                    <div className="sectionIcon">{section.icon}</div>
                    <h3>{section.name}</h3>
                    <p>{section.description}</p>
                    <div className="sectionStats">
                      <span>{section.courses} cours</span>
                      <span className="sectionPrice">{section.price}</span>
                    </div>
                    <button className="viewCoursesBtn">Voir les cours</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="offersInfo">
          <h2>Pourquoi choisir EduLearn?</h2>
          <div className="infoGrid">
            <div className="infoCard">
              <div className="infoIcon">🎓</div>
              <h3>Cours de Qualité</h3>
              <p>Créés par des professeurs experts et expérimentés</p>
            </div>
            <div className="infoCard">
              <div className="infoIcon">📱</div>
              <h3>Accès Illimité</h3>
              <p>Regardez les cours autant de fois que vous le souhaitez</p>
            </div>
            <div className="infoCard">
              <div className="infoIcon">🏆</div>
              <h3>Certificats</h3>
              <p>Obtenez des certificats reconnaissance après chaque cours</p>
            </div>
            <div className="infoCard">
              <div className="infoIcon">💬</div>
              <h3>Support Réactif</h3>
              <p>Posez vos questions et recevez des réponses rapidement</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Offers;
