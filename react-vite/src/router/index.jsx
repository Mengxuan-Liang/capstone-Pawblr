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

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage/>
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
        path: "signup",
        element: <SignupFormPage />,
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
      }
    ],
  },
]);