import json
src=open('animation_src.html').read()
lines=json.load(open('lines.json'))
open('animation.html','w').write(src.replace('/*__LINES__*/',json.dumps(lines)))
print('ok')
