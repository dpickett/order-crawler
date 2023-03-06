import { useState } from "react";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderLookupForm } from "./orderLookup/orderLookupForm";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderLookupForm />
    </QueryClientProvider>
  );
};

export default App;
