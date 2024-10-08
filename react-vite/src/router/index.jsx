import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import Blog from '../components/BlogPage/Blog';
import Comment from '../components/CommentPage/CommentPage';
import MainPage from '../components/SignupLoginPage/MainPage';
import Like from '../components/LikePage/LikePage';
import Follow from '../components/FollowPage/FollowPage';
import Tagged from '../components/Tagged/Tagged';
import Profile from '../components/Profile/Profile';
import About from '../components/HomePage/About';
import ChatComponent from '../components/Chat';
import  { MessageComponent } from '../components/Message';
import { PrivateChatComponent } from '../components/PrivateChat';
import ChatWithAI from '../components/ChatWithAI';
import LogSign from '../components/NewLoginSignupPage/LogSign';
import LoginFormModal from '../components/LoginFormModal';
import SignupFormModal from '../components/SignupFormModal';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/companion",
        element: <MainPage/>
      },
      {
        path: "/",
        element: <LoginFormModal/>
      },
      {
        path: "/home",
        element: <HomePage/>
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "/signup",
        element: <SignupFormModal />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/comment",
        element: <Comment />,
      },
      {
        path: "/like",
        element: <Like />,
      },
      {
        path: "/follow",
        element: <Follow />,
      },
      {
        path: "/tagged",
        element: <Tagged />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/chat",
        // element: <ChatComponent />,
        element: <ChatWithAI />,
      },
      {
        path: "/message",
        element: <MessageComponent />,
      },
      {
        path: "/dm",
        element: <PrivateChatComponent />,
      },
    ],
  },
]);