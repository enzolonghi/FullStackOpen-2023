import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [colorMessage, setColorMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notification = (message, color) => {
    setColorMessage(`${color}`)
    setErrorMessage(
      `${message}`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addNumber = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber
    }
    //Check if the person is already on the phonebook
    for (let person in persons) {
      if (JSON.stringify(persons[person].name) === JSON.stringify(nameObject.name)) {
        if(window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
          personService
          .update(persons[person].id, nameObject)
          .then(updatedPerson => {
              setPersons(persons.map(p => p.id !== persons[person].id ? p : updatedPerson))
              notification(`'${nameObject.name}' is updated succesfully`, 'green')
            })
          .catch(error => {
            setPersons(persons.filter(p => p.id!== persons[person].id))
            notification(`Information of ${persons[person].name} has already been removed from server`,'red')
          })
          setNewName('');
          setNewNumber('');
        }
        return;
      };
    };
    personService
    .create(nameObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewNumber('');
      notification(`'${nameObject.name}' is added succesfully to the database`, 'green')
    })
    
  };

  const deletePersonHandler = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
    personService
    .deletePerson(id)
    .then(returnedPersons => {
      notification('The person was removed succesfully from the database', 'red');
      })
    setPersons(persons.filter(person => person.id!== id));
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={colorMessage}/>
      <Filter inputValue={newFilter} handler={handleFilterChange}/>
      <h2>Add a new number</h2>
      <PersonForm submitHandler={addNumber}
        nameInputValue={newName}
        nameHandler={handleNameChange}
        numberInputValue={newNumber}
        numberHandler={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} deletePersonHandler={deletePersonHandler}/>
    </div>
  )
}

export default App
