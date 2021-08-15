import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "focus-visible/dist/focus-visible";

import { theme } from "config/theme";
import { ViewLessonPage } from "pages/lesson/view";

import { CourseList } from "pages/course/list";
import { ViewCoursePage } from "pages/course/view";

import { CreateUser } from "pages/user/create";
import { LoginUser } from "pages/user/login";

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
          <Route path="/user/create">
            <CreateUser />
          </Route>
          <Route path="/user/login">
            <LoginUser />
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};
