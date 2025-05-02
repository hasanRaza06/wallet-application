import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../redux/slice';

const CounterPage = () => {
    const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const handler = () => {
    dispatch(incrementByAmount(10));
  };

  return (
    <div className='text-2xl'>
      <h1>Count is {count}</h1>
      <button className='border border-black-1' onClick={() => dispatch(increment())}>Increment</button>
      <button className='border border-black-1' onClick={() => dispatch(decrement())}>Decrement</button>
      <button className='border border-black-1' onClick={handler}>Increment by 10</button>
    </div>
  )
}

export default CounterPage