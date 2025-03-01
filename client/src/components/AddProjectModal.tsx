import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FaList } from "react-icons/fa";
import { GET_PROJECTS } from "../queries/projectQueries";
import { GET_CLIENTS } from "../queries/clientQueries";
import { ADD_PROJECT } from "../mutation/projectMutation";
import { ProjectType } from "./lib/types";
import { ClientType } from "./lib/types";


type GetProjectsDataType = { 
    projects: ProjectType[]; 
}; 

type GetClientsDataType = { 
    clients: ClientType[]; 
};

export default function AddProjectModal() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [clientId, setClientId] = useState<string>('');
    const [status, setStatus] = useState<string>('new'); 


    const[addProject] = useMutation(ADD_PROJECT, {
        variables: { name, description, clientId, status },
        //refetchQueries: [{ query: GET_PROJECTS }],
        update(cache, { data: { addProject } }) {
            const existingData = cache.readQuery<GetProjectsDataType>({
            query: GET_PROJECTS,
            });
    
            if (existingData && existingData.projects) {
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { projects: [...existingData.projects, addProject ] },
            });
            }
        },
    })

    // Get Client for select
    const { loading, error, data } = useQuery<GetClientsDataType>(GET_CLIENTS);

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (name === "" || description === "" || status === "") {
        return alert("Please fill in all fields");
      }

      addProject({ variables: { name, clientId, description, status } });

      setName("");
      setDescription("");
      setStatus("new");
      setClientId("");
    };

    if (loading) return null;
    if (error) return `Something went wrong: ${error.message}`;

    return (
        <>
          {!loading && !error && (
            <>
              <button
                type='button'
                className='btn btn-primary'
                data-bs-toggle='modal'
                data-bs-target='#addProjectModal'
              >
                <div className='d-flex align-items-center'>
                  <FaList className='icon' />
                  <div>New Project</div>
                </div>
              </button>
    
              <div
                className='modal fade'
                id='addProjectModal'
                aria-labelledby='addProjectModalLabel'
                aria-hidden='true'
              >
                <div className='modal-dialog'>
                  <div className='modal-content'>
                    <div className='modal-header'>
                      <h5 className='modal-title' id='addProjectModalLabel'>
                        New Project
                      </h5>
                      <button
                        type='button'
                        className='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      ></button>
                    </div>
                    <div className='modal-body'>
                      <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                          <label className='form-label'>Name</label>
                          <input
                            type='text'
                            className='form-control'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Description</label>
                          <textarea
                            className='form-control'
                            id='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Status</label>
                          <select
                            id='status'
                            className='form-select'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value='new'>Not Started</option>
                            <option value='progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                          </select>
                        </div>
    
                        <div className='mb-3'>
                          <label className='form-label'>Client</label>
                          <select
                            id='clientId'
                            className='form-select'
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                          >
                            <option value=''>Select Client</option>
                            {data?.clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </select>
                        </div>
    
                        <button
                          type='submit'
                          data-bs-dismiss='modal'
                          className='btn btn-primary'
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      );
}
