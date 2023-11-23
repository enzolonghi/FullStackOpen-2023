const Filter = ({inputValue, handler}) => {
    return (
        <div>
        Filter by name: <input value={inputValue} onChange={handler}/>
      </div>
    )
  }
  
  export default Filter