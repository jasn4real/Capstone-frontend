import React from 'react';
import './components-set.css';
const HButton = ({id, onclick, innerText}) => {
  return <button className='HButton'>{innerText}</button>;
};

const HButtonLarge = ({id, onclick, innerText}) => {
  return <button></button>;
};

const HInput = ({className = "input", type = "text", value, onChange = ()=>{}}) => {
  return <input className={className} type={type} value={value} onChange={onChange}/>;
};

export {HButton, HInput};