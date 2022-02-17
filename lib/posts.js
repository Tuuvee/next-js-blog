import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
const postsDirectory = path.join(process.cwd(), 'posts')
import { remark } from 'remark'
import html from 'remark-html'

export function getSortedPostsData() {
	// Fetches filenames under /posts directory
	const fileNames = fs.readdirSync(postsDirectory)
	const allPostsData = fileNames.map(fileName => {
		
		//Remove .md from the end of the filename to assign as ID
		const id = fileName.replace(/\.md$/, '')
		
		// Reads markdwon file as a string
		const fullPath = path.join(postsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')
		
		// We parse the post metadata section using gray-matter
		 const matterResult = matter(fileContents)
		 
		 return{
			 id,
			 ...matterResult.data
		 }
	})
	//Sorts posts by Date
	return allPostsData.sort(({ date: a }, { date: b }) => {
		if (a < b) {
			return 1
		} else if (a > b) {
			return -1
		} else {
			return 0
		}	
	})
	
}
	
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
	//Returns an array of objects
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

	// Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
	//Use remark to convert markdown into a html string
	const processedContent = await remark()
	.use(html)
	.process(matterResult.content)
	const contentHtml = processedContent.toString()
	// Combine the data with the id and contentHtml
  return {
    id,
	contentHtml,
    ...matterResult.data
  }
}