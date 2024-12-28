import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { GET_PROJECTS } from '../queries/projectQueries';
import { useMutation } from '@apollo/client';
import { DELETE_PROJECT } from '../mutation/projectMutation';

type DeleteProjectButtonProps = {
  projectId: string;
};

export default function DeleteProjectButton({ projectId }: DeleteProjectButtonProps): JSX.Element {
  const navigate = useNavigate();

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: { id: projectId },
    onCompleted: () => navigate('/'),
    refetchQueries: [{ query: GET_PROJECTS }],
  });


  const handleDeleteProject = () => {
      deleteProject()
        .then(() => {
          console.log(`Project with ID ${projectId} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
        });
    };


  return (
    <div className='d-flex mt-5 ms-auto'>
      <button className='btn btn-danger m-2' onClick={handleDeleteProject}>
        <FaTrash className='icon' /> 
        Delete Project
      </button>
    </div>
  );
}
