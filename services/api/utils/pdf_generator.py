from reportlab.lib.pagesizes import letter
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from html.parser import HTMLParser
import textwrap
from django.conf import settings

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.text = []

    def handle_data(self, d):
        self.text.append(d)

    def get_data(self):
        return ''.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

class PDFGenerator:
    FONT_NAME = 'NotoSansJP'
    FONT_SIZE_HEADER = 12
    FONT_SIZE_TEXT = 10
    LINE_HEIGHT = 15
    PAGE_MARGIN = 50 

    def __init__(self, filename, title, student_name, date, student_id):
        self.canvas = Canvas(filename, pagesize=letter)
        self.title = title
        self.student_name = student_name
        self.date = date
        self.student_id = student_id
        self.width, self.height = letter
        pdfmetrics.registerFont(TTFont(self.FONT_NAME, settings.FONT_PATH))

        self.y_position = self.height - self.PAGE_MARGIN

    def pdf_header(self):
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_HEADER)
        self.canvas.drawString(self.width - 2 * inch, self.height - 30, f"氏名: {self.student_name}")
        self.canvas.drawString(self.width - 2 * inch, self.height - 45, f"学籍番号: {self.student_id}")
        self.canvas.drawString(self.width - 2 * inch, self.height - 60, f"課題: {self.title}")
        self.canvas.drawString(self.width - 2 * inch, self.height - 75, f"提出日: {self.date}")

    def add_text(self, text):
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_TEXT)
        text = strip_tags(text)
        wrapped_text = textwrap.wrap(text, width=80)

        for line in wrapped_text:
            self.canvas.drawString(self.PAGE_MARGIN, self.y_position, line) 
            self.y_position -= self.LINE_HEIGHT

        self.y_position -= self.LINE_HEIGHT

        if self.y_position < self.PAGE_MARGIN:
            self.canvas.showPage()
            self.pdf_header()
            self.y_position = self.height - self.PAGE_MARGIN

    def save(self):
        self.canvas.save()
