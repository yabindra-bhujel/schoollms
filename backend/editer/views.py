from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
import subprocess
import json
import ast
from .code_check import check_user_code
from.models import CodeProblem, UserProblemCompletion
from.serializers import CodeProblemSerializer
from django.contrib.auth import get_user_model
User = get_user_model()
import pytest


import pylint.lint


# Define the pylint_score function
def pylint_score(code):
    # Run pylint and collect the score
    pylint_output = pylint.lint.Run([code], do_exit=False)
    score = pylint_output.linter.stats['global_note']
    return score


import difflib

def code_similarity(code1, code2):
    # Calculate code similarity using difflib
    seq_matcher = difflib.SequenceMatcher(None, code1, code2)
    similarity_score = seq_matcher.ratio()
    return similarity_score

# @api_view(['POST'])
# def get_code(request):
#     try:
#         data = json.loads(request.body.decode('utf-8'))
#         code = data.get("code", "")
#         user_id = data.get("user", "")
#         problem_id = data.get("problem_id", "")

#         try:
#             user = get_object_or_404(User, id=user_id)
#             problem = get_object_or_404(CodeProblem, id=problem_id)
#         except Exception as e:
#             return Response({"error": str(e)}, status=500)

#         student_code = code
#         teacher_code = problem.exactped_code
#         test_case_data = problem.test_case

#         # Parse the test_case data as JSON
#         test_cases = json.loads(test_case_data)

#         # Store unique test inputs and their results
#         unique_results = {}

#         for idx, test_case in enumerate(test_cases):
#             test_input = test_case["input"]
#             expected_output = test_case["expected_output"]
#             student_result = None
#             teacher_result = None

#             try:
#                 student_namespace = {}
#                 exec(student_code, student_namespace)
#                 if 'find_max' in student_namespace:
#                     student_result = student_namespace['find_max'](test_input)
#                 else:
#                     student_result = "Function find_max not defined in student's code"
#             except Exception as e:
#                 print(e)
#                 student_result = str(e)

#             try:
#                 teacher_namespace = {}
#                 exec(teacher_code, teacher_namespace)
#                 if 'find_max' in teacher_namespace:
#                     teacher_result = teacher_namespace['find_max'](test_input)
#                 else:
#                     teacher_result = "Function find_max not defined in teacher's code"
#             except Exception as e:
#                 print(e)
#                 teacher_result = str(e)

#             # Compare student and teacher results
#             test_passed = student_result == expected_output and teacher_result == expected_output

#             # Create a unique key based on test input
#             input_key = tuple(test_input)

#             # Check if the input key is already in unique_results
#             if input_key not in unique_results:
#                 unique_results[input_key] = {
#                     "input": test_input,
#                     "expected_output": expected_output,
#                     "results": [],
#                 }

#             # Append the test results to the unique_results
#             unique_results[input_key]["results"].append({
#                 "student_result": student_result,
#                 # "teacher_result": teacher_result,
#                 "passed": test_passed,
#             })

#         # Convert the dictionary values to a list
#         results = list(unique_results.values())
#         for i in results:
#             print(i)


#         return Response({"results": results})

#     except Exception as e:
#         print(e)
#         return Response({"error": str(e)}, status=500)



@api_view(['POST'])
def get_code(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        code = data.get("code", "")
        user_id = data.get("user", "")
        problem_ids = data.get("problem_ids", [])  # List of problem IDs

        results = []  # Store results for all problems

        for problem_id in problem_ids:
            try:
                user = get_object_or_404(User, id=user_id)
                problem = get_object_or_404(CodeProblem, id=problem_id)
            except Exception as e:
                results.append({"error": str(e)})
                continue

            student_code = code
            teacher_code = problem.exactped_code
            test_case_data = problem.test_case

            # Parse the test_case data as JSON
            test_cases = json.loads(test_case_data)

            # Store unique test inputs and their results for the current problem
            unique_results = {}

            for idx, test_case in enumerate(test_cases):
                test_input = test_case["input"]
                expected_output = test_case["expected_output"]
                student_result = None
                teacher_result = None

                try:
                    student_namespace = {}
                    exec(student_code, student_namespace)
                    if 'find_max' in student_namespace:
                        student_result = student_namespace['find_max'](test_input)
                    else:
                        student_result = "Function find_max not defined in student's code"
                except Exception as e:
                    print(e)
                    student_result = str(e)

                try:
                    teacher_namespace = {}
                    exec(teacher_code, teacher_namespace)
                    if 'find_max' in teacher_namespace:
                        teacher_result = teacher_namespace['find_max'](test_input)
                    else:
                        teacher_result = "Function find_max not defined in teacher's code"
                except Exception as e:
                    print(e)
                    teacher_result = str(e)

                # Compare student and teacher results
                test_passed = student_result == expected_output and teacher_result == expected_output

                # Create a unique key based on test input
                input_key = tuple(test_input)

                # Check if the input key is already in unique_results
                if input_key not in unique_results:
                    unique_results[input_key] = {
                        "input": test_input,
                        "expected_output": expected_output,
                        "results": [],
                    }

                # Append the test results to the unique_results
                unique_results[input_key]["results"].append({
                    "student_result": student_result,
                    "teacher_result": teacher_result,
                    "passed": test_passed,
                })

            # Convert the dictionary values to a list for the current problem
            problem_results = list(unique_results.values())

            # Append the results for the current problem to the overall results
            results.append({"problem_id": problem_id, "results": problem_results})

        return Response({"results": results})

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)





@api_view(["POST"])
def check_problem_complate(request, user_id, problem_id):

    try:
        user = get_object_or_404(User, id = user_id)
        problem = get_object_or_404(CodeProblem, id = problem_id)

    except Exception as e:
        return Response({"error": "can not find given data"})

    # Check if the user has completed problem_id

    try:
        user_has_complate = UserProblemCompletion.objects.filter(user = user, problem = problem, iscomplate = True ).exists()

        if user_has_complate:
            return Response({"message": "user can have access"})
        else:
            return Response({"message": "user can not access another problem"})
        
    except Exception as e:
        print("Error:",str(e),status = 500)





@api_view(['POST'])
def add_new_problem(request):
    try:
        data = request.data
        serializer = CodeProblemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "problem added successfully"})
        else:
            return Response({"error": serializer.errors}, status=500)
        
    except Exception as e:
        print(e)
        return Response({"output": str(e)}, status=500)
    

@api_view(['GET'])
def get_all_problems(request):
    try:
        problems = CodeProblem.objects.all()
        serializer = CodeProblemSerializer(problems, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)

        
        return Response({"output": str(e)}, status=500)
    





def getNmae():
    return "Hello World"
