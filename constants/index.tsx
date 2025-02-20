import {
  FaDollarSign,
  FaFileInvoice,
  FaPiggyBank,
  FaRegCreditCard,
  FaRegStar,
  FaUserCircle,
  FaGlassCheers,
} from "react-icons/fa";
import { AiOutlineAppstore } from "react-icons/ai";

export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];

export const DEFAULT_BUDGET_RULES = {
  needsPercentage: 50,
  savingsPercentage: 30,
  wantsPercentage: 20,
  actualNeedsPercentage: 0,
  actualSavingsPercentage: 0,
  actualWantsPercentage: 0,
};

export const sidebarLinks = [
  {
    icon: AiOutlineAppstore,
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: FaDollarSign,
    route: "/income",
    label: "Income",
  },
  {
    icon: FaFileInvoice,
    route: "/charges",
    label: "Charges",
  },
  {
    icon: FaPiggyBank,
    route: "/savings",
    label: "Savings and Investments",
  },
  {
    icon: FaRegCreditCard,
    route: "/debts",
    label: "Debts",
  },
  {
    icon: FaGlassCheers,
    route: "/pleasures",
    label: "Pleasures & reserve funds",
  },
  {
    icon: FaRegStar,
    route: "/upgrade",
    label: "Upgrade",
  },
  {
    icon: FaUserCircle,
    route: "/profile",
    label: "Profile",
  },
];
