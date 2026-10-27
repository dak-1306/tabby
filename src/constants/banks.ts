export interface BankInfo {
  code: string;
  shortName: string;
  fullName: string;
}

export const VIETNAM_BANKS: BankInfo[] = [
  { code: "MB", shortName: "MBBank", fullName: "Ngân hàng TMCP Quân đội" },
  {
    code: "VCB",
    shortName: "Vietcombank",
    fullName: "Ngân hàng TMCP Ngoại thương Việt Nam",
  },
  {
    code: "TCB",
    shortName: "Techcombank",
    fullName: "Ngân hàng TMCP Kỹ thương Việt Nam",
  },
  {
    code: "VPB",
    shortName: "VPBank",
    fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
  },
  {
    code: "CTG",
    shortName: "VietinBank",
    fullName: "Ngân hàng TMCP Công Thương Việt Nam",
  },
  {
    code: "BIDV",
    shortName: "BIDV",
    fullName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
  },
  { code: "TPB", shortName: "TPBank", fullName: "Ngân hàng TMCP Tiên Phong" },
  { code: "ACB", shortName: "ACB", fullName: "Ngân hàng TMCP Á Châu" },
  {
    code: "STB",
    shortName: "Sacombank",
    fullName: "Ngân hàng TMCP Sài Gòn Thương Tín",
  },
  {
    code: "VIB",
    shortName: "VIB",
    fullName: "Ngân hàng TMCP Quốc Tế Việt Nam",
  },
  {
    code: "MSB",
    shortName: "MSB",
    fullName: "Ngân hàng TMCP Hàng Hải Việt Nam",
  },
  { code: "OCB", shortName: "OCB", fullName: "Ngân hàng TMCP Phương Đông" },
  {
    code: "SHB",
    shortName: "SHB",
    fullName: "Ngân hàng TMCP Sài Gòn - Hà Nội",
  },
  {
    code: "VBA",
    shortName: "Agribank",
    fullName: "Ngân hàng Nông nghiệp & PTNT Việt Nam",
  },
];
