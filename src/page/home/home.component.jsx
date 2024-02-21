import AddAudio from '../../components/add-audio/add-audio.component';
import AudioList from '../../components/audio-list/audio-list.component';
import AudioPlayer from '../../components/audio-play/audio-play.component';
import './home.component.css';

const Home = () => {
  return (
    <div className="home">
      <div className="view">
        <AudioList />
        <AddAudio />
      </div>
      <AudioPlayer/>
    </div>
  );
};

export default Home;
