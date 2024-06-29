import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import { store } from './store';


import './index.scss';
import App from './App';

// import SourceCodePage from './source_code_page';
import Snake from './components/snake';
import Whatsapp from './components/whatsapp';
// import BigWall from './components/big-wall';
// import Account from './components/account';
import styled from 'styled-components';
import PixelsArt from './components/pixels-art';
import APIDocs from './components/api-docs';
import TwitterProfile from './components/twitter/profile';
import Echo from './components/echo';
import Shooting from './components/shooting';
import FileManager from './components/file-manager';
import Trello from './components/trello';
import Chat from './components/chat';


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
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/snake" element={<Snake />} />
            {/* <Route path="/api-docs" element={<APIDocs />} /> */}
            <Route path="/whatsapp" element={<Whatsapp />} />
            {/* <Route path="/echo/:room" element={<Echo />} /> */}
            <Route path="/twitter.com/:username" element={<TwitterProfile />} />
            {/* <Route path="/mongoose" element={<BigWall />} />
            <Route path="/account" element={<Account />} />*/}
            {/* <Route path="/pixels-art/" element={<PixelsArt />} />
            <Route path="/pixels-art/:id" element={<PixelsArt />} /> */}
            <Route path="/shooting" element={<Shooting />} />
            {/* <Route path="/file-manager/" element={<FileManager />} /> */}
            <Route path="/trello/" element={<Trello />} />
            <Route path="/chat/" element={<Chat />} />
          </Routes>
        </HashRouter>
      </Provider>
    </div>
  // </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
