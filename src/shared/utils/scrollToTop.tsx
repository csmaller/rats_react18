import React, {useState,useEffect} from 'react';
import { Button } from '@mui/material';

const ScrollToTop: React.FC = () => {
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const main = document.getElementById('main');
    useEffect(() => {
        
        if(main){
            main?.addEventListener('scroll',()=>{
                if(main.scrollTop  > 300){
                    setShowScrollTopButton(true);
                } else {
                    setShowScrollTopButton(false);
                }
            })
    }}, []);

    const scrollTop =() => {
        if(main){
            main.scrollTo({top:0, behavior:'smooth'});
        }
    };  

    return (
        <div>
            {showScrollTopButton &&
                <Button onClick={scrollTop}>
                    Scroll to Top
                </Button>
            }
        </div>
    );

}

export default ScrollToTop;