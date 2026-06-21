import RootLayout from "@/Layout/RootLayout";
import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import DonationCampaigns from "../Pages/DonationCampaigns";
import PetDonationDetailsPage from "../Pages/DonationDetailsPage";
import Login from "@/components/SharedComponent/Login";
import Register from "@/components/SharedComponent/Register";
import Pets from "../Pages/Pets";
import PetDetails from "@/components/SharedComponent/PetDetails";
import AboutUsSection from "../Pages/AboutUs";
import DashboardHomePage from "@/components/DashboardComponent/DashboardHomePage";
import Dashboard from "@/Layout/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage";
import UserProfile from "@/components/DashboardComponent/UserProfile";
import AddPet from "@/components/DashboardComponent/AddPet";
import MyAddedPets from "@/components/DashboardComponent/MyAddedPets";
import AdoptionRequests from "@/components/DashboardComponent/AdoptionRequests";
import UpdatePet from "@/components/DashboardComponent/UpdatePet";
import CreateDonationCampaign from "@/components/DashboardComponent/CreateDonationCampaign";
import MyDonationCampaigns from "@/components/DashboardComponent/MyDonationCampaigns";
import EditMyDonation from "@/components/DashboardComponent/EditMyDonation";
import MyDonations from "@/components/DashboardComponent/MyDonations";
import AdminDashboard from "@/components/DashboardComponent/AdminDashboard";
import UsersComponent from "@/components/DashboardComponent/Users";
import AllPet from "@/components/DashboardComponent/AllPet";
import AlldonationCampaign from "@/components/DashboardComponent/AlldonationCampaign";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/donations",
        Component: DonationCampaigns,
      },
      {
        path: "/donations-details/:id",
        Component: PetDonationDetailsPage,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/pets",
        Component: Pets,
      },
      {
        path: "/pets/:id",
        Component: PetDetails,
      },

      {
        path: "/about-us",
        Component: AboutUsSection,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <ErrorPage />,
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "add-pet",
        element: (
          <PrivateRoute>
            <AddPet />
          </PrivateRoute>
        ),
      },
      {
        path: "my-added-pets",
        element: (
          <PrivateRoute>
            <MyAddedPets />
          </PrivateRoute>
        ),
      },
      {
        path: "adoption-requests",
        element: (
          <PrivateRoute>
            <AdoptionRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "update-pet/:id",
        element: (
          <PrivateRoute>
            <UpdatePet />
          </PrivateRoute>
        ),
      },
      {
        path: "create-donation-campaign",
        element: (
          <PrivateRoute>
            <CreateDonationCampaign />
          </PrivateRoute>
        ),
      },
      {
        path: "my-donation-campaigns",
        element: (
          <PrivateRoute>
            <MyDonationCampaigns />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-donation/:id",
        element: (
          <PrivateRoute>
            <EditMyDonation />
          </PrivateRoute>
        ),
      },
      {
        path: "my-donations",
        element: (
          <PrivateRoute>
            <MyDonations />
          </PrivateRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/allusers",
        element: (
          <AdminRoute>
            <UsersComponent />
          </AdminRoute>
        ),
      },
      {
        path: "admin/allpets",
        element: (
          <AdminRoute>
            <AllPet />
          </AdminRoute>
        ),
      },
      {
        path: "admin/alldonation",
        element: (
          <AdminRoute>
            <AlldonationCampaign />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
