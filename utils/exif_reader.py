import exifread
import io

def scan_image_metadata(file_bytes: bytes) -> dict:
    """
    Forensically scans an image's binary bytes to extract EXIF tags,
    identifying modification software, timestamps, and camera info.
    """
    try:
        f = io.BytesIO(file_bytes)
        tags = exifread.process_file(f, details=False)
        
        exif_info = {
            "has_exif": len(tags) > 0,
            "software": None,
            "camera_make": None,
            "camera_model": None,
            "date_time": None,
            "date_time_original": None,
            "all_tags": {}
        }
        
        if not tags:
            return exif_info
            
        # Extract specific useful tags
        for tag in tags.keys():
            val = str(tags[tag])
            # Save all tags in a clean string dictionary
            exif_info["all_tags"][tag] = val
            
            # Map key properties
            tag_lower = tag.lower()
            if "software" in tag_lower:
                exif_info["software"] = val
            elif "image make" in tag_lower:
                exif_info["camera_make"] = val
            elif "image model" in tag_lower:
                exif_info["camera_model"] = val
            elif "datetime" in tag_lower and "original" in tag_lower:
                exif_info["date_time_original"] = val
            elif "datetime" in tag_lower and not exif_info["date_time"]:
                exif_info["date_time"] = val
                
        # Clean up tags display
        # Highlight photoshop, canva, stable diffusion, gimp, etc.
        software_used = exif_info["software"]
        if software_used:
            software_used_lower = software_used.lower()
            if any(x in software_used_lower for x in ["photoshop", "adobe", "gimp", "canva", "midjourney", "stable"]):
                exif_info["software_alert"] = True
                exif_info["software_flag"] = f"Warning: Edited with '{software_used}'"
            else:
                exif_info["software_alert"] = False
                exif_info["software_flag"] = f"Software: {software_used}"
        else:
            exif_info["software_alert"] = False
            exif_info["software_flag"] = "No software metadata signature found (typical for raw cameras or social media screenshots that strip metadata)."

        return exif_info

    except Exception as e:
        return {
            "has_exif": False,
            "error": str(e),
            "software_flag": "Unable to read EXIF structure.",
            "all_tags": {}
        }
