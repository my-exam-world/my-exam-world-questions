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

  // Add all tests and their questions
  const allTests = await getAllTests();
  
  allTests.forEach((test) => {

    // Add individual questions
    test.questions.forEach((question) => {
      fields.push({
        loc: `${process.env.SITEMAP_URL}/test/${test._id}/${slugify(question.questionText).replace(/-+$/, '')}`,
        lastmod: new Date().toISOString(),
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