import { FaEnvelope, FaPhone, FaIdBadge } from 'react-icons/fa';
import { ClientType } from './lib/types';


type ClientInfoProps = { 
  client?: ClientType | null; 
};

export default function ClientInfo({ client }: ClientInfoProps): JSX.Element {
  console.log("client", client);	

  if (!client) {
    return <p>No client information available.</p>;
  }

  return (
    <>
      <h5 className="mt-5">Client Information</h5>
      <ul className="list-group">
        <li className="list-group-item">
          <FaIdBadge className="icon" /> {client?.name} 
        </li>
        <li className="list-group-item">
          <FaEnvelope className="icon" /> {client?.email}
        </li>
        <li className="list-group-item">
          <FaPhone className="icon" /> {client?.phone}
        </li>
      </ul>
    </>
  );
}