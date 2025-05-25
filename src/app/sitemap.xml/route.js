// app/sitemap-tests.xml/route.js
import { getServerSideSitemap } from 'next-sitemap';
import { slug as slugify } from "github-slugger";
import { NextResponse } from 'next/server';
import { getAllTests } from '@/models/test'; // Adjust the import path as necessary
export async function GET() {
  const fields = [
    {
      loc: `${process.env.SITEMAP_URL}`, // Tests listing page
      lastmod: new Date().toISOString(),
      changefreq: 'always',
      priority: '1.0',
    },
  ];


// Helper function to extract text from HTML and truncate if needed
const prepareSlugText = (html, maxLength = 60) => {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>?/gm, '');
  
  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
    // Don't cut words in middle - find last space
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      text = text.substring(0, lastSpace);
    }
    text = text + '...';
  }
  
  return text;
};


  // Add all tests and their questions
  const allTests = await getAllTests();
  
  allTests.forEach((test) => {
// Determine the most recent date between created and updated
    const testLastMod = new Date(
      Math.max(
        new Date(test.updatedAt).getTime(),
        new Date(test.createdAt).getTime()
      )
    ).toISOString();

    // Add individual questions
    test.questions.forEach((question) => {
      const slugText = prepareSlugText(question.questionText);

      fields.push({
        loc: `${process.env.SITEMAP_URL}/test/${test._id}/${slugify(slugText).replace(/-+$/, '')}`,
        lastmod: testLastMod,
        changefreq: 'weekly',
        priority: '0.9',
      });
    });
  });

  // Generate the sitemap XML
  const sitemap = await getServerSideSitemap(fields);

  return new NextResponse(sitemap.body, {
    status: sitemap.status,
    headers: sitemap.headers,
  });
}