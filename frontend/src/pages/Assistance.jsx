import SecondLayout from "../component/SecondLayout";
import { MailIcon, ChatIcon, PhoneIcon } from "../component/Icons";

const Assistance = () => {
  const supportChannels = [
    {
      id: 1,
      title: "Email",
      description: "support@edulearn.com",
      Icon: MailIcon,
      color: "#dbeafe",
    },
    {
      id: 2,
      title: "Chat",
      description: "Chat en Direct",
      Icon: ChatIcon,
      color: "#dcfce7",
    },
    {
      id: 3,
      title: "Téléphone",
      description: "+216 1234 5678",
      Icon: PhoneIcon,
      color: "#fef3c7",
    },
  ];

  return (
    <SecondLayout>
      <section className="assistance">
        <div className="assistanceHeader">
          <h1>Assistance</h1>
          <p>Nous sommes là pour vous aider</p>
        </div>

        <div className="assistanceGrid">
          {supportChannels.map((channel) => (
            <div key={channel.id} className="assistanceCard">
              <div className="assistanceIconBox" style={{ backgroundColor: channel.color }}>
                <span className="assistanceIcon"><channel.Icon /></span>
              </div>
              <div className="assistanceContent">
                <h3>{channel.title}</h3>
                <p>{channel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SecondLayout>
  );
};

export default Assistance;
