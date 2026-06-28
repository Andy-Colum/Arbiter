"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Patient } from "./types";
import { PATIENTS } from "./data";

interface CohortStore {
  patients: Patient[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  selectAllEligible: () => void;
  clearSelection: () => void;
  addPatient: (p: Patient) => void;
  dispatchedIds: string[];
  dispatch: () => void;
  selectedPatients: Patient[];
  dispatchedPatients: Patient[];
}

const Ctx = createContext<CohortStore | null>(null);

export function CohortProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);

  const value = useMemo<CohortStore>(() => {
    const isEligible = (p: Patient) =>
      p.status !== "Confirmed" && p.status !== "Opted-out";

    return {
      patients,
      selectedIds,
      dispatchedIds,
      toggleSelect: (id) =>
        setSelectedIds((prev) =>
          prev.includes(id)
            ? prev.filter((x) => x !== id)
            : [...prev, id]
        ),
      selectAllEligible: () =>
        setSelectedIds(patients.filter(isEligible).map((p) => p.id)),
      clearSelection: () => setSelectedIds([]),
      addPatient: (p) => setPatients((prev) => [p, ...prev]),
      dispatch: () => setDispatchedIds(selectedIds),
      get selectedPatients() {
        return patients.filter((p) => selectedIds.includes(p.id));
      },
      get dispatchedPatients() {
        return patients.filter((p) => dispatchedIds.includes(p.id));
      },
    };
  }, [patients, selectedIds, dispatchedIds]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCohort() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCohort must be used within CohortProvider");
  return ctx;
}
