const Persons = ({persons, newFilter, deletePersonHandler}) => {
    return (
        <div>
        {persons.map(person => {if (person.name.toLowerCase().includes(newFilter)) {
          return(
            <p key={person.name}>{person.name} - {person.number} <button onClick={() => deletePersonHandler(person.id)}>delete</button></p>
          )
        }
      }
        )}
      </div>
    )
  }
  
  export default Persons