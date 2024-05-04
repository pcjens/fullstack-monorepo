import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const booksQuery = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (booksQuery.loading) {
    return <div>Loading books...</div>
  } else if (booksQuery.error) {
    return <div className="error">{booksQuery.error.message}</div>
  }

  const { allBooks: books } = booksQuery.data

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
