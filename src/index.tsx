import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SourceCodePage from './source_code_page';
import Snake from './components/snake';
import FakeWhatsapp from './components/fake-whatsapp';
// import BigWall from './components/big-wall';
// import Account from './components/account';
import styled from 'styled-components';
import PixelsArt from './components/pixels-art';
import APIDocs from './components/api-docs';
import TwitterProfile from './components/twitter/profile';
import Echo from './components/echo';

const segment = process.env.REACT_APP_SEGMENT;
const careful = parseInt(process.env.REACT_APP_CAREFUL || '0') === 1;

const RedAttention = styled.div`
  color: red;
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <div className="h-100 d-flex flex-column">
      <RedAttention className="m-1">
        <span>origin: {segment} - </span>
        <span className="ms-1">{careful ? 'careful' : 'fire at will'}</span>
      </RedAttention>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          {!careful && <Route path="/source" element={<SourceCodePage />} />}
          <Route path="/snake" element={<Snake />} />
          <Route path="/api-docs" element={<APIDocs />} />
          <Route path="/fake-whatsapp" element={<FakeWhatsapp />} />
          <Route path="/echo/:room" element={<Echo />} />
          <Route path="/twitter.com/:username" element={<TwitterProfile />} />
          {/* <Route path="/mongoose" element={<BigWall />} />
          <Route path="/account" element={<Account />} />*/}
          <Route path="/pixels-art/" element={<PixelsArt />} />
          <Route path="/pixels-art/:id" element={<PixelsArt />} />
        </Routes>
      </HashRouter>
    </div>
  // </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
