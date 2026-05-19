import React, { useState } from 'react';
import './Chatbox.scss';

// הגדרת הטיפוס למבנה של הודעה בצ'אט
interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "שלום! ברוכים הבאים לניו דלי. במה אוכל לעזור?", isBot: true }
  ]);
  const [input, setInput] = useState<string>("");

  // לוגיקת ניתוח התשובות (מקומי)
  const getBotResponse = (text: string): string => {
    const cleanText = text.toLowerCase();

    if (cleanText.includes("שעות") || cleanText.includes("מתי פתוח")) {
      return "חנות 'ניו דלי' פתוחה בימים א'-ד' בין השעות 08:00 ל-20:00, ובימי חמישי עד 22:00. בשישי אנו סגורים.";
    }
    if (cleanText.includes("כשר") || cleanText.includes("כשרות")) {
      return "כל הבשרים ב'ניו דלי' הם בכשרות מהודרת גלאט חלק למהדרין.";
    }
    if (cleanText.includes("משלוח") || cleanText.includes("משלוחים")) {
      return "אנו מבצעים משלוחים מהיום להיום בהזמנות שמתקבלות עד השעה 14:00.";
    }
        if (cleanText.includes("סניף") || cleanText.includes("סניפים")|| cleanText.includes("כתובת")|| cleanText.includes("כתובות")) {
      return "כתובות הסניפים שלנו: סניף מרכזי - רחוב הראשי 123, תל אביב. סניף נוסף - רחוב השוק 45, ירושלים. סניף חדש - רחוב הים 78, חיפה.";
    }
        if (cleanText.includes("שירות") || cleanText.includes("לקוחות")|| cleanText.includes("שירות לקוחות")|| cleanText.includes("טלפון")) {
      return "ניתן לפנות אלינו בטלפון 03-1234567, או.mail@newdeli.co.il";
    }
        if (cleanText.includes("תודה") || cleanText.includes("מודה")|| cleanText.includes(" אדיב")|| cleanText.includes("עוזר")|| cleanText.includes("עזרה")|| cleanText.includes("עזרת")) {
      return "תודה רבה! שמחתי לתת שירות! אני כאן תמיד לעזור לך. אם יש לך שאלות נוספות, אל תהסס לפנות אליי.";
    }




    return "מתנצל, לא הבנתי את השאלה. ניתן לפנות אלינו בטלפון של החנות לקבלת מענה נוסף.";
  };

  const handleSend = (): void => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, isBot: false };
    const botAnswer: Message = { text: getBotResponse(input), isBot: true };

    setMessages((prev) => [...prev, userMsg, botAnswer]);
    setInput("");
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          💬 צ'אט שירות
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>ניו דלי - עוזר דיגיטלי</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="messages-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.isBot ? "msg-bot" : "msg-user"}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
              placeholder="שאל אותי כל שאלה..."
            />
            <button onClick={handleSend}>שלח</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;