import MainLayout from "../component/MainLayout";
import { MissionIcon, TeamIcon, GlobeIcon } from "../component/Icons";

const About = () => {
  return (
    <MainLayout>
      <section className="about">
        <div className="aboutContainer">
          <div className="aboutHeader">
            <h1>À Propos de EduLearn</h1>
            <p>Votre plateforme d'apprentissage en ligne de confiance</p>
          </div>

          <div className="aboutContent">
            <div className="aboutSection">
              <div className="sectionIcon"><MissionIcon /></div>
              <h2>Notre Mission</h2>
              <p>
                Rendre l'éducation de qualité accessible à tous. Nous croyons que chacun 
                mérite la chance d'apprendre et de progresser à son rythme.
              </p>
            </div>

            <div className="aboutSection">
              <div className="sectionIcon"><TeamIcon /></div>
              <h2>Notre Équipe</h2>
              <p>
                Composée d'experts en éducation et de professionnels passionnés, 
                notre équipe travaille chaque jour pour créer le meilleur contenu pédagogique.
              </p>
            </div>

            <div className="aboutSection">
              <div className="sectionIcon"><GlobeIcon /></div>
              <h2>Notre Vision</h2>
              <p>
                Créer une communauté mondiale d'apprenants où chacun peut développer 
                ses compétences et atteindre ses objectifs académiques.
              </p>
            </div>
          </div>

          <div className="aboutStats">
            <h2>Nos Chiffres</h2>
            <div className="statsGrid">
              <div className="statItem">
                <div className="statNumber">50,000+</div>
                <div className="statText">Étudiants inscrits</div>
              </div>
              <div className="statItem">
                <div className="statNumber">500+</div>
                <div className="statText">Cours disponibles</div>
              </div>
              <div className="statItem">
                <div className="statNumber">200+</div>
                <div className="statText">Professeurs experts</div>
              </div>
              <div className="statItem">
                <div className="statNumber">10,000+</div>
                <div className="statText">Heures de contenu</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
