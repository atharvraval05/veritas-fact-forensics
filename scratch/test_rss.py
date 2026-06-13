import httpx
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
import re
import random

async def test_parser():
    url = "https://news.google.com/rss/search?q=India&hl=en-IN&gl=IN&ceid=IN:en"
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        resp = await client.get(url)
        print("Status:", resp.status_code)
        
        # Parse XML from content bytes
        root = ET.fromstring(resp.content)
        items = root.findall(".//item")
        print("Total items parsed:", len(items))
        
        for item in items[:3]:
            title = item.find("title").text
            desc = item.find("description").text or ""
            pub_date = item.find("pubDate").text
            
            img_url = None
            img_match = re.search(r'<img[^>]+src=["\'](.*?)["\']', desc)
            if img_match:
                img_url = img_match.group(1)
                if img_url.startswith("//"):
                    img_url = "https:" + img_url
                    
            print("- Title:", title)
            print("  Date:", pub_date)
            print("  Raw Description:", desc)
            print("  Extracted Image:", img_url)

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_parser())
