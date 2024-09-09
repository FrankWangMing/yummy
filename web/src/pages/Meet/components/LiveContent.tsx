import { observer } from "mobx-react-lite";
import "./LiveContent.less";
export default observer(() => {
  return (
    <div className="content">
      <video className="content-video" autoPlay controls>
        <source
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          type="video/mp4"
        />
        <source src="movie.ogg" type="video/ogg" />
      </video>
    </div>
  );
});
