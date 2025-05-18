'use client';
import './Navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import logopng from "../../public/logo.webp";
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

export default function Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navbarRef = useRef(null);
    const toggleRef = useRef(null);

    const toggleNavbar = (e) => {
        e.stopPropagation();
        setIsNavbarOpen(prev => !prev);
    };

    const closeNavbar = () => setIsNavbarOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`mmexams-navbar ${visible ? 'mmexams-navbar-visible' : 'mmexams-navbar-hidden'}`} ref={navbarRef}>
            <div className="mmexams-navbar-container">
                <Link className="mmexams-navbar-brand" href="/" onClick={closeNavbar}>
                    <img src={logopng.src} alt="Make My Exam" className='mmexams-navbar-logo' />
                    <div className="mmexams-navbar-brandtext">
                        <strong className='mmexams-navbar-brandtitle'>My Exam World</strong>
                        <span className='mmexams-navbar-brandsubtitle'>Test Series | Live Exam</span>
                    </div>
                </Link>

                <div className={`mmexams-navbar-links ${isNavbarOpen ? 'show' : ''}`}>
                    <div className="mmexams-navbar-main-links">
                        <Link className="mmexams-nav-link" href="/" onClick={closeNavbar}>Home</Link>
                        <Link className="mmexams-nav-link" href="https://www.myexamworld.com/alltest" >All Exams</Link>
     
                        <Link className="mmexams-nav-link" href="https://www.myexamworld.com/allcreators" >All Creators</Link>
                    </div>

                    <div className="mmexams-navbar-auth-buttons">
                        <Link
                            className="mmexams-auth-button signin-btn"
                            href="https://www.myexamworld.com/signin"
                            onClick={closeNavbar}
                        >
                            Sign In
                        </Link>
                        <Link
                            className="mmexams-auth-button signup-btn"
                            href="https://www.myexamworld.com/signup"
                            onClick={closeNavbar}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                <button
                    ref={toggleRef}
                    className="mmexams-navbar-toggler"
                    onClick={toggleNavbar}
                    aria-label="Toggle navigation"
                    aria-expanded={isNavbarOpen}
                >
                    {isNavbarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
        </nav>
    );
}