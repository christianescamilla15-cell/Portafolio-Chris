import { TICKET_STATUS_FLOW } from "../constants/colors.js";

export const getNextTicketStatus = (currentStatus) => {
  const idx = TICKET_STATUS_FLOW.indexOf(currentStatus);
  if (idx < 0 || idx >= TICKET_STATUS_FLOW.length - 1) return null;
  return TICKET_STATUS_FLOW[idx + 1];
};
