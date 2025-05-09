import { CertificateValueType } from "@/services/CertificateService";

export interface CertificateField {
  key: string;
  label: string;
  type: CertificateValueType;
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
        type: "String",
        isUnique: true,
      },
      {
        key: "studentId",
        label: "Mã học sinh",
        type: "String",
        isUnique: true,
      },
      {
        key: "className",
        label: "Lớp",
        type: "String",
      },
      {
        key: "schoolName",
        label: "Trường",
        type: "String",
      },
      {
        key: "issueDate",
        label: "Ngày cấp",
        type: "Date",
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
        type: "String",
        isUnique: true,
      },
      {
        key: "teacherId",
        label: "Mã giáo viên",
        type: "String",
        isUnique: true,
      },
      {
        key: "subject",
        label: "Môn học",
        type: "String",
      },
      {
        key: "schoolName",
        label: "Trường",
        type: "String",
      },
      {
        key: "issueDate",
        label: "Ngày cấp",
        type: "Date",
      },
    ],
  },
  {
    id: "bachelor-degree",
    name: "Bằng Cử Nhân",
    description: "Mẫu chứng chỉ bằng cử nhân",
    fields: [
      {
        key: "studentName",
        label: "Họ và tên",
        type: "String",
        isUnique: true,
      },
      {
        key: "studentId",
        label: "Mã sinh viên",
        type: "String",
        isUnique: true,
      },
      { key: "major", label: "Chuyên ngành", type: "String" },
      { key: "graduationYear", label: "Năm tốt nghiệp", type: "Number" },
      { key: "gpa", label: "Điểm trung bình", type: "Number" },
      {
        key: "rank",
        label: "Xếp loại",
        type: "String",
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
        type: "String",
        isUnique: true,
      },
      {
        key: "certificateId",
        label: "Mã chứng chỉ",
        type: "String",
        isUnique: true,
      },
      { key: "issueDate", label: "Ngày cấp", type: "Date" },
      { key: "expiryDate", label: "Ngày hết hạn", type: "Date" },
      { key: "issuer", label: "Đơn vị cấp", type: "String" },
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
        type: "String",
        isUnique: true,
      },
      {
        key: "diplomaId",
        label: "Mã văn bằng",
        type: "String",
        isUnique: true,
      },
      { key: "specialization", label: "Chuyên môn", type: "String" },
      { key: "issueDate", label: "Ngày cấp", type: "Date" },
      { key: "issuingAuthority", label: "Cơ quan cấp", type: "String" },
      { key: "validityPeriod", label: "Thời hạn hiệu lực", type: "String" },
    ],
  },
];
