import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "lucide-react";

import styles from "@/component/CopySection/index.module.css";
import { useEffect, useState } from "react";

const CopySection = ({ roomId }) => {
  console.log("In the copy to clipboard section=", roomId);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [truncateValue, setTruncateValue] = useState("");

  useEffect(() => {
    if (roomId) {
      setTruncateValue(roomId.toString().substring(0, 7) + "...");
    }
  }, [roomId]);

  const handleCopy1 = () => {
    setCopied1(true);
    setTimeout(() => setCopied1(false), 2000);
  };

  const handleCopy2 = () => {
    setCopied2(true);
    setTimeout(() => setCopied2(false), 2000);
  };

  return (
    <div className={styles.copyContainer}>
      <div className="flex">
        <div>
          <div className={styles.copyHeading}>Share Room Link</div>
          <hr />
          <div className={styles.copyDescription}>
            <CopyToClipboard text={"https://buddytalks.onrender.com/" + roomId}>
              <div onClick={handleCopy1}>
                {copied1 ? (
                  <span className="ml-3 text-green-500 p-5">Copied!</span>
                ) : (
                  <>
                    <span>
                      {"https://buddytalks.onrender.com/".substring(0, 10) +
                        "..."}
                    </span>
                    <Copy className="ml-3 cursor-pointer" />
                  </>
                )}
              </div>
            </CopyToClipboard>
          </div>
        </div>
        
        <div>
          <div className={styles.copyHeading}> Share Room ID</div>
          <hr />
          <div className={styles.copyDescription}>
            <CopyToClipboard text={roomId}>
              <div onClick={handleCopy2}>
                {copied2 ? (
                  <span className="ml-3 text-green-500 p-5">Copied!</span>
                ) : (
                  <>
                    <span>{truncateValue}</span>
                    <Copy className="ml-3 cursor-pointer" />
                  </>
                )}
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopySection;
