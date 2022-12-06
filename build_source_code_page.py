import os
from pathlib import Path

path_from = './src/components'
path_to = './src'

final_path_to = f"{path_to}/source_code_page"
Path(final_path_to).mkdir(parents=True, exist_ok=True)

TEMPLATE_REACT_COMPONENT = """const SourceCodePage = () => (
  <div className="p-5 d-flex flex-column">%s</div>
)

export default SourceCodePage;
"""

TEMPLATE_REACT_FILE = """
<h1>%s</h1>
<code dangerouslySetInnerHTML={{__html: `%s`}} />
<br />
"""

# TEMPLATE_REACT_FILE = """
# <h1>%s</h1>
# <code>
# %s
# </code>
# <br />
# """

TEMPLATE_ESCAPE = ['\'', '\"', '`', '$']
HTML_TAGS = ['div', 'span']
REACT_TAGS = ['Button', 'Col', 'Container', 'Controller', 'Element', 'FontAwesomeIcon', 'Form', 'Input', 'Palette', 'Row', 'Square']
TAGS =  [*HTML_TAGS, *REACT_TAGS]

def set_escape(s):
  for c in TEMPLATE_ESCAPE:
    s = s.replace(c, f"\\{c}")
  for tag in TAGS:
    s = s.replace(f"<{tag}", f"&lt;{tag}")
  s = s.replace('</', '&lt;/')
  s = s.replace('/>', '/&gt;')
  s = s.replace('\n', '<br>')
  s = s.replace(' ', '&nbsp;')
  
  return s

with open(f"{final_path_to}/index.tsx", 'w') as fh:
  s = ""
  pathlist = Path(path_from).rglob('*.tsx')
  for path in pathlist:
    # because path is object not string
    path_in_str = str(path)
    with open(path_in_str) as fh_file:
      code = set_escape(fh_file.read())
      s += TEMPLATE_REACT_FILE%(path_in_str, code)

  fh.write(TEMPLATE_REACT_COMPONENT%s)