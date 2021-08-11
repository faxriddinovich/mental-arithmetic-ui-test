import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "focus-visible/dist/focus-visible";

import { theme } from "config/theme";
import { ViewLessonPage } from "pages/lesson/view.page";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/lesson/view">
            <ViewLessonPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};
