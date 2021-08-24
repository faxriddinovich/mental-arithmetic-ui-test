import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Redirect, BrowserRouter, Switch, Route } from "react-router-dom";
import "focus-visible/dist/focus-visible";

import { theme } from "config/theme";
import { ViewLessonPage } from "pages/lesson/view";

import { CourseList } from "pages/course/list";
import { ViewCoursePage } from "pages/course/view";
import { PanicPage } from 'pages/panic'

import { CreateUserPage } from "pages/user/create";
import { UserLoginPage } from "pages/user/login";

import { UserProfilePage } from "pages/user/profile";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/lesson">
            <ViewLessonPage />
          </Route>
          <Route path="/course">
            <ViewCoursePage />
          </Route>
          <Route path="/courses">
            <CourseList />
          </Route>
          <Route path="/user/create" component={CreateUserPage} />
          <Route path="/user/login" component={UserLoginPage} />
          <Route path="/panic" component={PanicPage} />
          <Route path="/profile">
            <UserProfilePage />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};
