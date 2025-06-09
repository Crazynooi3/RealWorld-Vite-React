import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({ isOpen, onClose, deleteArticle }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return ReactDOM.createPortal(
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Warning !!!</h5>
            {/* <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button> */}
          </div>
          <div className="modal-body">
            <p>Are you sure about DELETE this article ?</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => {
                deleteArticle(), onClose(), navigate("/");
              }}
              type="button"
              className="btn btn-danger"
            >
              DELETE article !!!
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#modal")
  );
}
