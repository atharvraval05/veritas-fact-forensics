from utils.db import get_global_news, get_debunk_rumors

print("Global news from DB:")
news = get_global_news()
print(f"Count: {len(news)}")
if news:
    print("Sample:", news[0])

print("\nDebunk rumors from DB:")
rumors = get_debunk_rumors()
print(f"Count: {len(rumors)}")
if rumors:
    print("Sample:", rumors[0])
