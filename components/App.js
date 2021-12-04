import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage";
import AdverVideoUploadPage from "./views/VideoUploadPage/AdverVideoUploadPage";

import MyVideoPage from "./views/VideoModifyPage/MyVideoPage";
import VideoModifyPage from "./views/VideoModifyPage/VideoModifyPage";

import VideoDetailPage from './views/VideoDetailPage/VideoDetailPage';
import VideoSearchPage from './views/VideoSearchPage/VideoSearchPage';

import MedalUploadPage from "./views/Medal/MedalUploadPage/MedalUploadPage";
import MedalLandingPage from "./views/Medal/MedalLandingPage/MedalLandingPage";
import MedalDetailPage from './views/Medal/MedalDetailPage/MedalDetailPage';
import MedalUpdatePage from './views/Medal/MedalUpdatePage/MedalUpdatePage';

import WalletPage from './views/WalletPage/WalletPage';
import SendCoinPage from './views/SendCoinPage/SendCoinPage';

//null   아무나 들어갈수 있음
//true   로그인 한 사람만 접근 가능
//false  로그인 안한 사람만 접근 가능
// 관리자와 일반로그인 사용자 구분은 여기서 안함 

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} /> 

          <Route exact path="/login" component={Auth(LoginPage, false)} /> 
          <Route exact path="/register" component={Auth(RegisterPage, false)} />

          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
          <Route exact path="/video/modify/myVideo/:userId" component={Auth(MyVideoPage, true)} />
          <Route exact path="/video/modify/modifyVideo/:videoId" component={Auth(VideoModifyPage, true)} />

          <Route exact path="/video/adverUpload" component={Auth(AdverVideoUploadPage, true)} />
          

          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} /> 
          <Route exact path="/video/search/:videoTitle" component={Auth(VideoSearchPage, null)} /> 
          

          <Route exact path="/medal" component={Auth(MedalLandingPage,null)} />
          <Route exact path="/medal/upload" component={Auth(MedalUploadPage,true)} />
          <Route exact path="/medal/:medalId" component={Auth(MedalDetailPage,true)} />
          <Route exact path="/medal/update/:medalId" component={Auth(MedalUpdatePage,true)} />

          
          <Route exact path="/wallet/:userId" component={Auth(WalletPage, true)} />
          <Route exact path="/wallet/sendCoin/:userId" component={Auth(SendCoinPage, true)} />
          
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
