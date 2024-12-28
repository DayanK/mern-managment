import {  useQuery } from "@apollo/client"
import ClientRow from "./ClientRow";
import { ClientType } from "./lib/types";
import { GET_CLIENTS } from "../queries/clientQueries";
import { Spinner } from "./Spinner";
import ErrorMessage from "./ErrorMessage";


type GetClientsDataType = { 
    clients: ClientType[]; 
};

export default function Clients(): JSX.Element {
   const { loading, error, data } = useQuery<GetClientsDataType>(GET_CLIENTS);


   if (loading) return <Spinner /> ;
   if (error) return <ErrorMessage message="Something went wrong while fetching data. Please try again later." />;  return (
    <>
        {!loading && !error && data && (
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.clients.map((client)  => (
                        <ClientRow 
                            key={client.id} 
                            client={client} 
                            />
                    ))}
                </tbody>
            </table>
        )}
    </>
  )
}
