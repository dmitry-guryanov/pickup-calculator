

all: article.html

article.html: article.md
	pandoc --to=html --css=style.css  --latexmathml --mathjax --smart -o article.html article.md
