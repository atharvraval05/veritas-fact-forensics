import json
import re
from urllib.parse import quote, urlparse
from typing import Optional
import httpx

def get_base64_str(source_url: str) -> dict:
    try:
        url = urlparse(source_url)
        path = url.path.split("/")
        if (
            url.hostname == "news.google.com"
            and len(path) > 1
            and path[-2] in ["articles", "read"]
        ):
            return {"status": True, "base64_str": path[-1]}
        return {"status": False, "message": "Invalid Google News URL format."}
    except Exception as e:
        return {"status": False, "message": f"Error in get_base64_str: {str(e)}"}

async def get_decoding_params_async(client: httpx.AsyncClient, base64_str: str) -> dict:
    # Try the articles URL first, then fall back to rss/articles URL
    for url_pattern in [
        f"https://news.google.com/articles/{base64_str}",
        f"https://news.google.com/rss/articles/{base64_str}"
    ]:
        try:
            # DO NOT pass custom User-Agent headers to avoid triggering Google's bot detection 429 page
            response = await client.get(url_pattern, follow_redirects=True, timeout=5.0)
            if response.status_code == 200:
                html = response.text
                sg_match = re.search(r'data-n-a-sg="([^"]+)"', html)
                ts_match = re.search(r'data-n-a-ts="([^"]+)"', html)
                if sg_match and ts_match:
                    return {
                        "status": True,
                        "signature": sg_match.group(1),
                        "timestamp": ts_match.group(1),
                        "base64_str": base64_str,
                    }
        except Exception:
            continue

    return {
        "status": False,
        "message": "Failed to fetch data attributes from Google News."
    }

async def decode_url_async(client: httpx.AsyncClient, signature: str, timestamp: str, base64_str: str) -> dict:
    try:
        url = "https://news.google.com/_/DotsSplashUi/data/batchexecute"
        payload = [
            "Fbv4je",
            f'["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"{base64_str}",{timestamp},"{signature}"]',
        ]
        
        # Form data matches requests.post parameters
        response = await client.post(
            url,
            data={"f.req": json.dumps([[payload]])},
            timeout=5.0
        )
        if response.status_code == 200:
            parsed_data = json.loads(response.text.split("\n\n")[1])[:-2]
            decoded_url = json.loads(parsed_data[0][2])[1]
            return {"status": True, "decoded_url": decoded_url}
        return {"status": False, "message": f"HTTP error {response.status_code} from batchexecute"}
    except Exception as e:
        return {"status": False, "message": f"Error in decode_url: {str(e)}"}

async def decode_google_news_url_async(client: httpx.AsyncClient, source_url: str) -> Optional[str]:
    try:
        base64_response = get_base64_str(source_url)
        if not base64_response["status"]:
            return None

        decoding_params_response = await get_decoding_params_async(client, base64_response["base64_str"])
        if not decoding_params_response["status"]:
            return None

        decoded_url_response = await decode_url_async(
            client,
            decoding_params_response["signature"],
            decoding_params_response["timestamp"],
            decoding_params_response["base64_str"],
        )
        if decoded_url_response["status"]:
            return decoded_url_response["decoded_url"]
    except Exception:
        pass
    return None
