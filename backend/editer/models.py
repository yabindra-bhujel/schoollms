from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CodeProblem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    hint = models.TextField()
    excepted_answere_descriotion = models.TextField()
    exacty_answer = models.TextField(max_length=255)
    exactped_code = models.TextField()
    test_case = models.TextField()
    iscomplate = models.BooleanField(default=False)



    def __str__(self):
        return self.title
    

class UserProblemAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(CodeProblem, on_delete=models.CASCADE)
    aswer_code = models.TextField()

    def __str__(self):
        return f"{self.user} {self.problem}"

class UserProblemCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(CodeProblem, on_delete=models.CASCADE)
    iscomplate = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.user} {self.problem}"
