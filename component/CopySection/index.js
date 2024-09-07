import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "lucide-react";

import styles from "@/component/CopySection/index.module.css";
import { useState } from "react";

const CopySection = ({ roomId }) => {
  console.log( "In the copy to clipboard section=",roomId);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  return (
    <div className={styles.copyContainer}>
      <div className={styles.copyHeading}>Copy Room ID:</div>
      <hr />
      <div className={styles.copyDescription}>
        
        <CopyToClipboard text={roomId}>
          <div onClick={handleCopy}>
            {
              copied ? <span className="ml-3 text-green-500 p-5">Copied!</span> :
              ( <>
              <span>{roomId}</span>
              <Copy className="ml-3 cursor-pointer" />
              </>)
            }
            
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default CopySection;