import { Link, useParams } from 'react-router-dom';
import DeleteProjectButton from '../components/DeleteProjectButton';
import { useQuery } from '@apollo/client';

import { Spinner } from '../components/Spinner';
import ClientInfo from '../components/ClientInfo';
import { GET_PROJECT } from '../queries/projectQueries';
import ErrorMessage from '../components/ErrorMessage';
import { GetProjectData } from '../components/lib/types';
import EditProjectForm from '../components/EditProjectForm';



export default function Project(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<GetProjectData, { id: string | undefined }>(GET_PROJECT, {
    variables: { id },
  });


   if (loading) return <Spinner />;
  if (error) return (<ErrorMessage message="Something went wrong. Please try again later." />);

  return (
    <>
      {!loading && !error && (
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
            Back
          </Link>

          <h1>{data?.project.name}</h1>

          <p>{data?.project.description}</p>

          <h5 className="mt-3">Project Status</h5>

          <p className="lead">{data?.project.status}</p>

           <ClientInfo client={data?.project.client} />

          <EditProjectForm project={data!.project} /> 

          {data?.project.id && (
            <DeleteProjectButton projectId={data.project.id} />
          )}
        </div>
      )}
    </>
  );
}