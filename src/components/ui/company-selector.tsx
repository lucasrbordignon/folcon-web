import { useCompanyStore } from "@/store/companyStore";

export function CompanySelector() {
  const { companies, activeCompany, setActiveCompany } = useCompanyStore();

  return (
    <select
      value={activeCompany?.company_id || ""}
      onChange={(e) => {
        const selected = companies.find((c) => c.company_id === e.target.value);
        if (selected) setActiveCompany(selected);
      }}
      className="tracking-tight text-foreground bg-transparent border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    >
      {companies.map((c) => (
        <option key={c.company_id} value={String(c.company_id)}>
          {c?.company_name?.toUpperCase() ?? "Nenhuma selecionada"}
        </option>
      ))}
    </select>
  );
}