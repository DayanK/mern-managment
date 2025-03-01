import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Project from './pages/Project';


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(_, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});


const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: cache,
});

function App() {

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />

          <div className="container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/projects/:id' element={<Project />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App
