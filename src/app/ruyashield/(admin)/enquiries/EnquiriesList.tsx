"use client";

import { useMemo, useState } from "react";
import type { ActionResult } from "@/cms/actions";
import type { Enquiry, EnquiryStage } from "@/cms/types";
import { EnquiryRow } from "./EnquiryRow";
import styles from "../../admin.module.css";

const FILTERS = ["All", "New", "Replied", "Call booked", "Proposal", "Won", "Lost"] as const;

export function EnquiriesList({
  enquiries,
  action,
}: {
  enquiries: Enquiry[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: enquiries.length };
    for (const e of enquiries) map[e.stage] = (map[e.stage] || 0) + 1;
    return map;
  }, [enquiries]);

  const visible = useMemo(() => {
    if (filter === "All") return enquiries;
    return enquiries.filter((e) => e.stage === (filter as EnquiryStage));
  }, [enquiries, filter]);

  const firstNewId = enquiries.find((e) => e.stage === "New")?.id;

  return (
    <div>
      <div className={styles.enquiryFilters} role="tablist" aria-label="Filter by stage">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={styles.enquiryFilter}
            data-active={filter === f ? "true" : "false"}
            onClick={() => setFilter(f)}
          >
            {f}
            <span>{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className={styles.emptyPanel}>
          <p className={styles.muted}>No enquiries in this stage.</p>
        </div>
      ) : (
        <div className={styles.enquiryList}>
          {visible.map((enquiry) => (
            <EnquiryRow
              key={enquiry.id}
              enquiry={enquiry}
              action={action}
              defaultOpen={enquiry.id === firstNewId && filter === "All"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
