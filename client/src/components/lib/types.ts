
export interface ClientType {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface ProjectType {
    id: string;
    clientId: string;
    name: string;
    description: string;
    status: string;
    client?: ClientType;
  }
  

 
  export type GetProjectData = {
    project: ProjectType;
  };