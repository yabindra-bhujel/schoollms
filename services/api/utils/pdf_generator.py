from reportlab.lib.pagesizes import letter
from reportlab.pdfgen.canvas import Canvas
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
    FONT_SIZE_TITLE = 16
    FONT_SIZE_HEADER = 12
    FONT_SIZE_QUESTION = 12
    FONT_SIZE_ANSWER = 10
    LINE_HEIGHT = 14
    PAGE_MARGIN = 50
    SPACING_BETWEEN_QA = 20

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
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_TITLE)
        self.canvas.drawCentredString(self.width / 2, self.height - self.PAGE_MARGIN, self.title)

        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_HEADER)
        self.canvas.drawString(self.PAGE_MARGIN, self.height - self.PAGE_MARGIN - 30, f"氏名: {self.student_name}")
        self.canvas.drawString(self.PAGE_MARGIN, self.height - self.PAGE_MARGIN - 45, f"学籍番号: {self.student_id}")
        self.canvas.drawString(self.PAGE_MARGIN, self.height - self.PAGE_MARGIN - 60, f"提出日: {self.date}")

        # Add a line below the header for separation
        self.canvas.line(self.PAGE_MARGIN, self.height - self.PAGE_MARGIN - 70, self.width - self.PAGE_MARGIN, self.height - self.PAGE_MARGIN - 70)

        # Adjust y_position for the body content
        self.y_position = self.height - self.PAGE_MARGIN - 85

    def add_question_and_answer(self, question, answer):
        # Draw the question in bold and larger font
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_QUESTION)
        wrapped_question = textwrap.wrap(strip_tags(question), width=80)
        for line in wrapped_question:
            self.canvas.drawString(self.PAGE_MARGIN, self.y_position, line)
            self.y_position -= self.LINE_HEIGHT

        # Draw the answer in normal font
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_ANSWER)
        wrapped_answer = textwrap.wrap(strip_tags(answer), width=80)
        for line in wrapped_answer:
            self.canvas.drawString(self.PAGE_MARGIN, self.y_position, line)
            self.y_position -= self.LINE_HEIGHT

        # Add space after each Q&A set for better readability
        self.y_position -= self.SPACING_BETWEEN_QA

        # Check if we need to move to the next page
        if self.y_position < self.PAGE_MARGIN:
            self._add_footer()
            self.canvas.showPage()
            self.pdf_header()
            self.y_position = self.height - self.PAGE_MARGIN - 85

    def _add_footer(self):
        # Add page numbers or other footer details
        page_number = self.canvas.getPageNumber()
        self.canvas.setFont(self.FONT_NAME, self.FONT_SIZE_ANSWER)
        self.canvas.drawCentredString(self.width / 2, self.PAGE_MARGIN / 2, f"Page {page_number}")

    def save(self):
        self._add_footer()
        self.canvas.save()
