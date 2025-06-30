
import "../css/Home.css"
import Menu from "./Menu.tsx";

function HomeView(){
    return(
        <div className="bg">
            <div className="text">
            <h1>「Portfolio」 français
                <br/>
                Détente pour vous</h1>
                <h2>〜このサイトはテストサイトです〜</h2>
            </div>
            <Menu/>
        </div>
    );
}
export default HomeView;