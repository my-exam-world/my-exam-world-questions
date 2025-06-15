import { getQuestionBySlug } from '@/models/test';
import './QuestionPage.css';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { id, slug } = params; 
  const data = await getQuestionBySlug(id, slug);

  return {
    title: `${data?.questionText?.substring(0, 60) || 'Practice Question'} | My Exam World`,
    description: data?.correctAnswer.text
      ? `Learn why "${data.correctAnswer.text.substring(0, 120)}" is the correct answer`
      : 'Practice question with detailed explanation',
    alternates: {
      canonical: `https://www.myexamworld.com/test/${id}/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    openGraph: {
      title: `${data?.testName || 'Test Question'} | My Exam World`,
      description: `Practice question from ${data?.testName || 'our test bank'}`,
      url: `https://www.myexamworld.com/test/${id}/${slug}`,
      type: 'article',
      publishedTime: data?.createdAt || new Date().toISOString(),
      images: [
        {
          url: 'https://www.myexamworld.com/default-question-image.jpg',
          alt: 'My Exam World Practice Question',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data?.testName || 'Test Question'} | My Exam World`,
      description: `Practice question from ${data?.testName || 'our test bank'}`,
      images: ['https://www.myexamworld.com/default-question-image.jpg'],
    },
  };
}
export default async function TestQuestionPage({ params }) {
  const { id, slug } = await params;

  try {
    const data = await getQuestionBySlug(id, slug);

    if (!data) {
      return (
        <main className="error-container">
          <article>
            <h1>Question not found</h1>
            <p>The requested question could not be located.</p>
            <Link href="https://www.myexamworld.com/alltest" className="btn btn-primary">
              Browse Available Tests
            </Link>
          </article>
        </main>
      );
    }

    // Structured Data for SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Quiz",
      "name": data.testName,
      "description": `Practice question from ${data.testName}`,
      "educationalAlignment": {
        "@type": "AlignmentObject",
        "alignmentType": "educationalSubject",
        "targetName": data.category
      },
      "hasPart": {
        "@type": "Question",
        "name": `Question ${data.questionNumber}`,
        "text": data.questionText.replace(/<[^>]*>/g, ''), // Strip HTML tags
        "acceptedAnswer": {
          "@type": "Answer",
          "text": data.correctAnswer.text,
          "comment": data.explanation?.replace(/<[^>]*>/g, '') || "Detailed explanation available"
        },
        "potentialAction": {
          "@type": "CommentAction",
          "handler": {
            "@type": "HttpActionHandler",
            "url": `https://www.myexamworld.com/test/${id}/${slug}`
          }
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "My Exam World",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.myexamworld.com/logo.png"
        }
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main className="question-page">
          <article className="question-container">
            {/* Test Header */}
            <header className="test-header">
              <h1>{data.testName}</h1>
              <div className="test-meta">
                <span>Category: {data.category}</span>
                <span>Total Marks: {data.totalMarks}</span>
              </div>
            </header>

            {/* Question Content */}
            <section aria-labelledby="question-heading">
              <h2 id="question-heading">Question {data.questionNumber}</h2>

              <p
                className="question-text"
                dangerouslySetInnerHTML={{ __html: data.questionText }}
              />
              {/* Options Grid */}
              <div className="options-grid" role="list">
                {data.options.map((option, index) => (
                  <div
                    key={index}
                    className={`option-item ${index === data.correctAnswer.index ? 'correct-answer' : ''
                      }`}
                    role="listitem"
                  >
                    <span className="option-letter" aria-hidden="true">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: option }} />
                    {index === data.correctAnswer.index && (
                      <span className="correct-badge" aria-label="Correct answer">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Answer Explanation */}
            <section aria-labelledby="explanation-heading">
              <h3 id="explanation-heading">Explanation</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.explanation || `The correct answer is ${data.correctAnswer.text} because...`
                }}
              />
            </section>

            {/* Action Buttons */}
            <footer className="action-buttons">
              <Link
                href={`https://www.myexamworld.com/test/${id}/${slug}`}
                className="btn btn-primary"
                aria-label="Sign in to take the full test"
                prefetch={false}
              >
                Give Full Test
              </Link>

            </footer>
          </article>
        </main>
      </>
    );
  } catch (error) {
    console.error('Error fetching question:', error);
    return (
      <main className="error-container">
        <article>
          <h1>Error loading question</h1>
          <p>Please try again later.</p>
          <Link href="https://www.myexamworld.com/alltest" className="btn btn-primary">
            Browse Tests
          </Link>
        </article>
      </main>
    );
  }
}