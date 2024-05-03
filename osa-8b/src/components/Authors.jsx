import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"

const Authors = (props) => {
  const authorQuery = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (authorQuery.loading) {
    return <div>Loading authors...</div>
  } else if (authorQuery.error) {
    return <div className="error">{authorQuery.error.message}</div>
  }

  const { allAuthors: authors } = authorQuery.data

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
