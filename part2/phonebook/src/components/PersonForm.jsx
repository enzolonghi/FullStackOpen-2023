const PersonForm = ({submitHandler, nameInputValue, nameHandler, numberInputValue, numberHandler}) => {
    return(
        <form onSubmit={submitHandler}>
        <div>
          Name: <input value={nameInputValue} onChange={nameHandler}/>
        </div>
        <br/>
        <div>
          Number: <input value={numberInputValue} onChange={numberHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm