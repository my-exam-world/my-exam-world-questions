import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to My Exam World</h1>
        <p className={styles.subtitle}>
          Where students can give exams and teachers can create tests
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Link href="https://www.myexamworld.com/alltest"className={styles.secondaryButton} >
          View All Tests
        </Link>

        <Link href="https://www.myexamworld.com/allcreators" className={styles.secondaryButton}>
          View All Creators
        </Link>

        <Link href="https://www.myexamworld.com/signin" className={styles.primaryButton}>
          Sign In as Student / Creator
        </Link>
        <Link href="www.myexamworld.com/signup" className={styles.primaryButton}>
          Sign Up as Student / Creator
        </Link>

      </div>
    </main>
  );
}