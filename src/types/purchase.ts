
export type Purchase = {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  payment_method: 'card' | 'pix';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};
