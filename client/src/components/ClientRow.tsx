import { FaTrash } from "react-icons/fa";
import { ClientType } from "./lib/types";
import { DELETE_CLIENTS } from "../mutation/clientMutations";
import { useMutation } from "@apollo/client";
import { GET_CLIENTS } from "../queries/clientQueries";

type ClientRowProps = {
  client: ClientType;
};

type GetClientsDataType = {
  clients: ClientType[];
};
const ClientRow = ({ client }: ClientRowProps) => {

  const [deleteClient] = useMutation(DELETE_CLIENTS, {
      refetchQueries: [{ query: GET_CLIENTS }],
      awaitRefetchQueries: true,
    
      variables: { id: client.id },

      update(cache, { data: { deleteClient } }) {

        const existingData = cache.readQuery<GetClientsDataType>({
          query: GET_CLIENTS,
        });
    
        if (existingData?.clients) {
          const updatedClients = existingData.clients.filter(
            (existingClient) => existingClient.id !== deleteClient.id
          );

          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              clients: updatedClients,
            },
          })

          console.log("Cache updated:", updatedClients);

        }
      },
  });

  const handleClick = () => {
    deleteClient({ variables: { id: client.id } })
  }

  return (
    <tr key={client.id}>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={handleClick}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default ClientRow;
