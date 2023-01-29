import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import './App.scss';
import Settings, { initialStyle, IStyle } from './components/settings';
import MinimizeName from './components/minimize-name';
import FlyingSquare from './components/flying-square';
import TextareaDynamic from "./components/textarea-dynamic";

const segment = process.env.REACT_APP_SEGMENT;
const careful = parseInt(process.env.REACT_APP_CAREFUL || '0') === 1;

const text = `
  Welcome to my personal website.
  <br>
  Ok, not that personal, but still.
  <br>
  How ${careful ? '' : 'the fuck'} did you get here?
`;

const App = () => {
  const [style, setStyle] = useState<IStyle>(initialStyle);
  const [amount, setAmount] = useState<number>(1);
  console.log(15, process.env, segment);
  
  
  return (
    <AppRoot applyStyle={style} className="position-relative h-100 d-flex flex-column dynamic-color">
      <div className="d-flex">
        {!careful && <NavLink to="/source" className="m-1 dynamic-color" >source code</NavLink>}
        <NavLink to="/api-docs" className="m-1 dynamic-color" >API Docs</NavLink>
        <NavLink to="/fake-whatsapp" className="m-1 dynamic-color" >Fake WhatsApp</NavLink>
        <NavLink to="/echo" className="m-1 dynamic-color" >Echo</NavLink>
        <NavLink to="/snake" className="m-1 dynamic-color" >Snake (game)</NavLink>
        {/* <NavLink to="/mongoose" className="m-1 dynamic-color" >Mongoose</NavLink>
        <NavLink to="/account" className="m-1 dynamic-color" >Account</NavLink>*/}
        <NavLink to="/pixels-art" className="m-1 dynamic-color" >Pixels Art</NavLink>
        <NavLink to="/shooting" className="m-1 dynamic-color" >Shooting</NavLink>
        <NavLink to="/file-manager" className="m-1 dynamic-color" >File Manager</NavLink>
        <NavLink to="/trello" className="m-1 dynamic-color">Trello</NavLink>
      </div>
      <FlyingSquare amount={amount} className="m-5">
        <PageTitle className="m-0 p-3 change-border-style cd dynamic-color" color={style.color}>
          {segment === 'ciro' && <>
            <MinimizeName name="Ciro"/>
            <MinimizeName name="Souza"/>
            <MinimizeName name="Silva"/>
            <span>Monteiro</span>
          </>}
          {segment === 'fake' && <>
            <span>4everfake</span>
          </>}
        </PageTitle>
      </FlyingSquare>
      <Settings style={style} setStyle={setStyle} setAmount={setAmount} />
      <TextareaDynamic text={text} color={style.color}/>
    </AppRoot>
  );
}



export const Border = (color: string) => `border: 2px solid ${color};`;

const PageTitle = styled.h1<{
  color: string;
}>`
  width: fit-content;
  ${({ color }) => Border(color)};
`

const AppRoot = styled.div<{
  applyStyle: IStyle
}>`
  

  &.dynamic-color, .dynamic-color {
    color: ${({ applyStyle }) => applyStyle.color} !important;
    background: ${({ applyStyle }) => applyStyle.background} !important;
    font-weight: ${({ applyStyle }) => applyStyle.fontWeight} !important;
    
    
  }

  .color-red = {
    color: red !important;
  }

  .dynamic-background-primary {
    background: ${({ applyStyle }) => applyStyle.color} !important;
  }

  // dynamic color border
  .dcb {
    border: 1px solid ${({ applyStyle }) => applyStyle.color};
  }
`;

export default App;
