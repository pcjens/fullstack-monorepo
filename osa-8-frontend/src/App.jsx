import { useState } from "react";
import { useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [page, setPage] = useState("authors");
  const [prevPage, setPrevPage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('books-login-token'));
  const apolloClient = useApolloClient();

  const openLoginPage = () => {
    if (page !== "login") {
      setPrevPage(page);
    }
    setPage("login");
  };
  const logout = () => {
    setToken(null);
    localStorage.clear();
    apolloClient.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token != null && (<button onClick={() => setPage("add")}>add book</button>)}
        {token != null && (<button onClick={() => setPage("recs")}>recommendations</button>)}
        {token != null && (<button onClick={() => logout()}>logout</button>)}
        {token == null && (<button onClick={() => openLoginPage()}>login</button>)}
      </div>

      <Authors show={page === "authors"} loggedIn={token != null} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recs"} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage} prevPage={prevPage} />
    </div>
  );
};

export default App;
