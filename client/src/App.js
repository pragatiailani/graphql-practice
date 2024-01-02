import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";

const query = gql`
    query GetTodosWithUser {
        getUsers {
            id
            name
            username
        }
    }
`;

function App() {
    const { data, loading } = useQuery(query);
    if (loading)
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    Loading...
                </header>
            </div>
        );

    // return <div className="App">{JSON.stringify(data)}</div>;

    return (
        <div className="App">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {data.getUsers.map((user) => (
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
