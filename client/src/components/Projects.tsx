import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../queries/projectQueries';
// import { Spinner } from './Spinner';
import ErrorMessage from './ErrorMessage';
import { ProjectType } from './lib/types';
import ProjectCard from './ProjectCard';


type GetProjectsDataType = { 
    projects: ProjectType[] 
};

export default function Projects(): JSX.Element {
  const { error, data } = useQuery<GetProjectsDataType>(GET_PROJECTS);

  if (error)  return <ErrorMessage message="Something went wrong while fetching data. Please try again later." />;
  
  return (
    <>
      {data && data.projects && data.projects.length > 0 ? (
        <div className="row mt-4">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}{" "}
        </div>
      ) : (
        <p>No Projects</p>
      )}
    </>
  );
}