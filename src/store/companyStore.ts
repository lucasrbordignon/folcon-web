import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompanyUser = Database["public"]["Tables"]["company_users"]["Row"];

type CompanyState = {
  companies: CompanyUser[];
  activeCompany: CompanyUser | null;
  setCompanies: (companies: CompanyUser[]) => void;
  setActiveCompany: (company: CompanyUser) => Promise<void>;
  clear: () => void;
};

export const useCompanyStore = create(
  persist<CompanyState>(
    (set) => ({
      companies: [],
      activeCompany: null,
      setCompanies: (companies) => set({ companies }),
      setActiveCompany: async (company) => {
        set({ activeCompany: company });
        if (company?.company_id) {
          await supabase.rpc("set_active_company", {
            company_id: company.company_id,
          });
        }
      },
      clear: () => set({ companies: [], activeCompany: null }),
    }),
    { name: "company-store" }
  )
);
