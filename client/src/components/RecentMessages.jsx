import React, { useEffect, useState } from "react";
import { dummyRecentMessagesData } from "../assets/assets";
import { Link } from "react-router-dom";
import moment from "moment";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-xs mt-4 min-h-20 text-slate-800 bg-white text-xs p-4 rounded-md shadow">
      <h3 className="font-semibold text-slate-8 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            key={index}
            to={`/messages/${message.from_user_id._id}`}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt={message.from_user_id.profile_picture}
              className="w-8 h-8 rounded-full"
            />
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-slate-400 text-[10px]">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white h-4 w-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
