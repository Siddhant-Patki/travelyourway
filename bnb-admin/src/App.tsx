import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { firebaseAuth, firestoreDatabase } from "./lib/firebase";
import { ListingList, ListingCreate, ListingEdit, ListingShow } from "./pages/listing";
import { ReservationList, ReservationCreate, ReservationEdit, ReservationShow } from "./pages/reservations";
import { DiningList, DiningCreate, DiningEdit, DiningShow } from "./pages/dining";
import { DiningReservationList, DiningReservationCreate, DiningReservationEdit, DiningReservationShow } from "./pages/dining-reservations";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={firestoreDatabase.getDataProvider()}
                authProvider={firebaseAuth.getAuthProvider()}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "listing",
                    list: "/listing",
                    create: "/listing/create",
                    edit: "/listing/edit/:id",
                    show: "/listing/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Listings",
                    },
                  },
                  {
                    name: "reservations",
                    list: "/reservations",
                    create: "/reservations/create",
                    edit: "/reservations/edit/:id",
                    show: "/reservations/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Reservations",
                    },
                  },
                  {
                    name: "dining",
                    list: "/dining",
                    create: "/dining/create",
                    edit: "/dining/edit/:id",
                    show: "/dining/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Dining",
                    },
                  },
                  {
                    name: "dining_reservations",
                    list: "/dining-reservations",
                    create: "/dining-reservations/create",
                    edit: "/dining-reservations/edit/:id",
                    show: "/dining-reservations/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Dining Reservations",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "YHB3ZA-83x0mh-wHGXLs",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    }
                  >
                    <Route index element={<NavigateToResource resource="listing" />} />

                    {/* Listing - Custom Pages */}
                    <Route path="/listing">
                      <Route index element={<ListingList />} />
                      <Route path="create" element={<ListingCreate />} />
                      <Route path="edit/:id" element={<ListingEdit />} />
                      <Route path="show/:id" element={<ListingShow />} />
                    </Route>

                    {/* Reservations - Custom Pages */}
                    <Route path="/reservations">
                      <Route index element={<ReservationList />} />
                      <Route path="create" element={<ReservationCreate />} />
                      <Route path="edit/:id" element={<ReservationEdit />} />
                      <Route path="show/:id" element={<ReservationShow />} />
                    </Route>

                    {/* Dining - Custom Pages */}
                    <Route path="/dining">
                      <Route index element={<DiningList />} />
                      <Route path="create" element={<DiningCreate />} />
                      <Route path="edit/:id" element={<DiningEdit />} />
                      <Route path="show/:id" element={<DiningShow />} />
                    </Route>

                    {/* Dining Reservations - Custom Pages */}
                    <Route path="/dining-reservations">
                      <Route index element={<DiningReservationList />} />
                      <Route path="create" element={<DiningReservationCreate />} />
                      <Route path="edit/:id" element={<DiningReservationEdit />} />
                      <Route path="show/:id" element={<DiningReservationShow />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
