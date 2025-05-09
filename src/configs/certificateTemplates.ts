export interface CertificateField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  isUnique?: boolean;
  options?: string[];
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  fields: CertificateField[];
}

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: "student",
    name: "Chứng chỉ học sinh",
    description: "Mẫu chứng chỉ dành cho học sinh",
    fields: [
      {
        key: "studentName",
        label: "Họ và tên",
        type: "text",
        isUnique: true,
      },
      {
        key: "studentId",
        label: "Mã học sinh",
        type: "text",
        isUnique: true,
      },
      {
        key: "className",
        label: "Lớp",
        type: "text",
      },
      {
        key: "schoolName",
        label: "Trường",
        type: "text",
      },
      {
        key: "issueDate",
        label: "Ngày cấp",
        type: "date",
      },
    ],
  },
  {
    id: "teacher",
    name: "Chứng chỉ giáo viên",
    description: "Mẫu chứng chỉ dành cho giáo viên",
    fields: [
      {
        key: "teacherName",
        label: "Họ và tên",
        type: "text",
        isUnique: true,
      },
      {
        key: "teacherId",
        label: "Mã giáo viên",
        type: "text",
        isUnique: true,
      },
      {
        key: "subject",
        label: "Môn học",
        type: "text",
      },
      {
        key: "schoolName",
        label: "Trường",
        type: "text",
      },
      {
        key: "issueDate",
        label: "Ngày cấp",
        type: "date",
      },
    ],
  },
  {
    id: "bachelor-degree",
    name: "Bằng Cử Nhân",
    description: "Mẫu chứng chỉ bằng cử nhân",
    fields: [
      { key: "studentName", label: "Họ và tên", type: "text", isUnique: true },
      { key: "studentId", label: "Mã sinh viên", type: "text", isUnique: true },
      { key: "major", label: "Chuyên ngành", type: "text" },
      { key: "graduationYear", label: "Năm tốt nghiệp", type: "number" },
      { key: "gpa", label: "Điểm trung bình", type: "number" },
      {
        key: "rank",
        label: "Xếp loại",
        type: "select",
        options: ["Xuất sắc", "Giỏi", "Khá", "Trung bình"],
      },
    ],
  },
  {
    id: "certificate",
    name: "Chứng Chỉ",
    description: "Mẫu chứng chỉ chung",
    fields: [
      {
        key: "recipientName",
        label: "Họ và tên người nhận",
        type: "text",
        isUnique: true,
      },
      {
        key: "certificateId",
        label: "Mã chứng chỉ",
        type: "text",
        isUnique: true,
      },
      { key: "issueDate", label: "Ngày cấp", type: "date" },
      { key: "expiryDate", label: "Ngày hết hạn", type: "date" },
      { key: "issuer", label: "Đơn vị cấp", type: "text" },
    ],
  },
  {
    id: "diploma",
    name: "Văn Bằng",
    description: "Mẫu văn bằng chuyên nghiệp",
    fields: [
      {
        key: "holderName",
        label: "Họ và tên người được cấp",
        type: "text",
        isUnique: true,
      },
      { key: "diplomaId", label: "Mã văn bằng", type: "text", isUnique: true },
      { key: "specialization", label: "Chuyên môn", type: "text" },
      { key: "issueDate", label: "Ngày cấp", type: "date" },
      { key: "issuingAuthority", label: "Cơ quan cấp", type: "text" },
      { key: "validityPeriod", label: "Thời hạn hiệu lực", type: "text" },
    ],
  },
];
