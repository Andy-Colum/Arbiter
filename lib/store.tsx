"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { AppointmentRecord } from "./types";
import { APPOINTMENTS } from "./data";

interface CohortStore {
  appointments: AppointmentRecord[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  selectAllEligible: () => void;
  clearSelection: () => void;
  addAppointment: (a: AppointmentRecord) => void;
  dispatchedIds: string[];
  dispatch: () => void;
  selectedAppointments: AppointmentRecord[];
  dispatchedAppointments: AppointmentRecord[];
  // The primary record passed to the workflow — first selected.
  activeAppointment: AppointmentRecord | null;
}

const Ctx = createContext<CohortStore | null>(null);

export function CohortProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(APPOINTMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);

  const value = useMemo<CohortStore>(() => {
    const isEligible = (a: AppointmentRecord) =>
      a.appointmentStatus !== "Confirmed";

    const selectedAppointments = appointments.filter((a) =>
      selectedIds.includes(a.appointmentId)
    );
    const dispatchedAppointments = appointments.filter((a) =>
      dispatchedIds.includes(a.appointmentId)
    );

    return {
      appointments,
      selectedIds,
      dispatchedIds,
      selectedAppointments,
      dispatchedAppointments,
      activeAppointment:
        dispatchedAppointments.length > 0
          ? dispatchedAppointments[0]
          : selectedAppointments[0] ?? null,
      toggleSelect: (id) =>
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        ),
      selectAllEligible: () =>
        setSelectedIds(
          appointments.filter(isEligible).map((a) => a.appointmentId)
        ),
      clearSelection: () => setSelectedIds([]),
      addAppointment: (a) => setAppointments((prev) => [a, ...prev]),
      dispatch: () => setDispatchedIds(selectedIds),
    };
  }, [appointments, selectedIds, dispatchedIds]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCohort() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCohort must be used within CohortProvider");
  return ctx;
}
