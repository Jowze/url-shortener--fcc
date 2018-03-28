url-shortener--fcc
url "shortener" service as part of the freecodecamp.org curriculum

User stories: -I can pass a URL as a parameter and I will receive a "shortened" URL in the JSON response. When I visit that "shortened" URL, it will redirect me to my original link. -If I pass a URL with an incorrect format, I'll receive an error. If I try to visit a url that isn't in the database, I'll receive an error as well

Example creation usage: https://url-shortener--fcc.glitch.me//new/https://www.google.com https://url-shortener--fcc.glitch.me//new/http://foo.com:80

Example creation output { "original_url":"http://foo.com:80", "shortened":"http://url-shortener--fcc.glitch.me/51a3be67f5" } Usage: http://url-shortener--fcc.glitch.me/fe0fc78025 Will redirect to: https://www.google.com/
