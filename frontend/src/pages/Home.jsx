import MainLayout from "../component/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <section className="hero">
        <div className="heroContent">
          <div className="heroText">
            <h1 className="heroTitle">Bienvenue sur EduLearn</h1>
            <p className="heroSubtitle">Accédez à des milliers de cours vidéo enregistrés par des experts</p>
            <button className="heroBtn">Explorer les cours</button>
          </div>
          <div className="heroImage">
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop" alt="Learning" />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="statCard">
          <div className="statValue">500+</div>
          <div className="statLabel">Cours disponibles</div>
        </div>

        <div className="statCard">
          <div className="statValue">10,000+</div>
          <div className="statLabel">Heures de vidéo</div>
        </div>

        <div className="statCard">
          <div className="statValue">50,000+</div>
          <div className="statLabel">Étudiants actifs</div>
        </div>

        <div className="statCard">
          <div className="statValue">200+</div>
          <div className="statLabel">Professeurs experts</div>
        </div>
      </section>

      <section className="subscriptions">
        <div className="subscriptionHeader">
          <h2>Nos Offres d'Abonnement</h2>
          <p>Choisissez votre niveau d'études</p>
        </div>

        <div className="subscriptionCards">
          <div className="courseCategory">
            <div className="categoryIcon">🎒</div>
            <div className="categoryName">Collège</div>
            <ul className="courseLevels">
              <li className="levelItem">
                <span className="levelNumber">7ème</span>
                <button className="levelBtn">Accéder</button>
              </li>
              <li className="levelItem">
                <span className="levelNumber">8ème</span>
                <button className="levelBtn">Accéder</button>
              </li>
              <li className="levelItem">
                <span className="levelNumber">9ème</span>
                <button className="levelBtn">Accéder</button>
              </li>
            </ul>
            <button className="categoryBtn">Explorer Collège</button>
          </div>

          <div className="courseCategory featured">
            <div className="categoryIcon">📚</div>
            <div className="categoryName">Lycée</div>
            <ul className="courseLevels">
              <li className="levelItem">
                <span className="levelNumber">1ère</span>
                <button className="levelBtn">Accéder</button>
              </li>
              <li className="levelItem">
                <span className="levelNumber">2ème</span>
                <button className="levelBtn">Accéder</button>
              </li>
              <li className="levelItem">
                <span className="levelNumber">3ème</span>
                <button className="levelBtn">Accéder</button>
              </li>
              <li className="levelItem">
                <span className="levelNumber">Bac</span>
                <button className="levelBtn">Accéder</button>
              </li>
            </ul>
            <button className="categoryBtn featured-btn">Explorer Lycée</button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;