                                                                                import { useEffect, useState } from "react";

const DateFormat = ({ utcTime }: { utcTime: string }) => {
  const [formattedDate, setFormattedDate] = useState("");

  const convertToVietnamTime = () => {
    if (!utcTime) return; // Tránh lỗi nếu utcTime bị null hoặc undefined

    // Parse thời gian đúng chuẩn UTC
    const date = new Date(utcTime); // utcTime phải có dạng "YYYY-MM-DDTHH:mm:ssZ"
    
    // Nếu date không hợp lệ
    if (isNaN(date.getTime())) {
      console.error("Invalid UTC time:", utcTime);
      return;
    }

    // Cộng thêm 7 giờ để chuyển sang giờ Việt Nam
    // date.setUTCHours(date.getUTCHours() + 7);

    const vietnamTime = date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", ""); // Định dạng theo yêu cầu

    setFormattedDate(vietnamTime);
  };

  useEffect(() => {
    convertToVietnamTime();
  }, [utcTime]); // Cập nhật khi `utcTime` thay đổi

  return <div>{formattedDate}</div>;
};

export default DateFormat;