from datetime import timezone
from django.db import models


class Exam(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    duration = models.DurationField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    max_grade = models.PositiveIntegerField(default=100)
    last_modified = models.DateTimeField(auto_now=True)
    additional_info = models.TextField(null=True, blank=True)
    course = models.ForeignKey('courses.Subject', on_delete=models.CASCADE)
    student = models.ManyToManyField('student.Student', related_name='exams', blank=True)
    teacher = models.ForeignKey('teacher.Teacher', on_delete=models.CASCADE)


    @property
    def is_active(self):
        now = timezone.now()
        if self.end_date <= now:
            return False
        elif self.start_date > now:
            return False
        else:
            return True



    def __str__(self):
        return self.title




class BasedQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question_type = models.CharField(max_length=30, null=True, blank=True)
    last_modified = models.DateTimeField(auto_now=True)
    additional_info = models.TextField(null=True, blank=True)
    question_number = models.PositiveIntegerField(default=1)
    

    class Meta:
        abstract = True

class Question(models.Model):
    question = models.TextField(null=True, blank=True)



    def __str__(self):
        return self.question
    


class ShortAnswerQuestion(BasedQuestion):
    question = models.ManyToManyField(Question, related_name='short_answer_question', blank=True)


class LongAnswerQuestion(BasedQuestion):
    question = models.ManyToManyField(Question , related_name='long_answer_question', blank=True)


    



class ShortAnswerModel(models.Model):
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    short_answer_question = models.ForeignKey(ShortAnswerQuestion, on_delete=models.CASCADE)
    answer = models.TextField(null=True, blank=True)
    submitted_datetime = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.answer
    



class LongAnswerModel(models.Model):
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    long_answer_question = models.ForeignKey(LongAnswerQuestion, on_delete=models.CASCADE)
    answer = models.TextField(null=True, blank=True)
    submitted_datetime = models.DateTimeField(auto_now=True)




    def __str__(self):
        return self.answer






    


