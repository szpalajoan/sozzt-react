export const MOCK_USERS = [
  { id: 1, name: "Anna Nowak" },
  { id: 2, name: "Jan Kowalski" },
  { id: 3, name: "Piotr Wiśniewski" },
  { id: 4, name: "Maria Dąbrowska" },
  { id: 5, name: "Tomasz Lewandowski" }
];

export const STATUS_COLORS = {
  NEW: 'error',
  IN_PROGRESS: 'warning',
  DONE: 'success',
  CANCELLED: 'default'
};

export const STATUS_LABELS = {
  NEW: 'remarks.status.new',
  IN_PROGRESS: 'remarks.status.inProgress',
  DONE: 'remarks.status.done',
  CANCELLED: 'remarks.status.cancelled'
};

export const MOCK_REMARKS = [
  {
    id: 1,
    title: "Brakujące pomiary",
    description: "Należy uzupełnić pomiary w sekcji północnej",
    status: "NEW",
    createdBy: "Jan Kowalski",
    assignedTo: "Anna Nowak",
    createdAt: "2024-03-20T10:00:00Z",
    deadline: "2024-03-25T10:00:00Z",
    stepId: "PRELIMINARY_PLAN"
  },
  {
    id: 2,
    title: "Nieprawidłowe oznaczenia",
    description: "Proszę poprawić oznaczenia na mapie zgodnie ze standardem",
    status: "IN_PROGRESS",
    createdBy: "Anna Nowak",
    createdAt: "2024-03-19T15:30:00Z",
    deadline: "2024-03-23T15:30:00Z",
    stepId: "PRELIMINARY_PLAN"
  }
]; 