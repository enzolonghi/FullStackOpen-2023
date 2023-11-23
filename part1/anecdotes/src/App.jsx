import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];
   
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0)
  
  const handleNext = () => {
    const random_number = Math.floor(Math.random() * 8);
    setSelected(random_number)
  };

  const handleVote = () => {
    const newVoteCount = [...votes];
    newVoteCount[selected]++;
    setVotes(newVoteCount);
  };

  const max_votes_index = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>  
      <p>This anecdote has: {votes[selected]} votes</p>
      <Button text='next anecdote' handleClick={handleNext}/>
      <Button text='vote' handleClick={handleVote}/>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[max_votes_index]}</p>
      <p>This anecdote has: {votes[max_votes_index]} votes</p>
    </div>
  );
};
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)


export default App;