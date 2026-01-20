import React from 'react';
import '../sass/footer.scss';


const Footer = ({version, year}) => (
    <footer className="footer">
        <div className="copyright">Pot o' Goals &copy; {year} <a href="mailto:xian@nevergoesto.work" className="footer__link">Xian Brock</a></div>
        <div className="version">v{version}</div>
    </footer>
);

export default Footer;