
def check_user_code(student_code, teacher_code, test_case):
    try:
         # Compile the teacher's code and student's code
        teacher_code_compiled = compile(teacher_code, '<string>', 'exec')
        student_code_compiled = compile(student_code, '<string>', 'exec')


        # Execute the teacher's code
        teacher_namespace = {}
        exec(teacher_code_compiled, teacher_namespace)

        # Execute the student's code
        student_namespace = {}
        exec(student_code_compiled, student_namespace)

        # Find the teacher-defined function (it's assumed to be the first function defined)
        teacher_function = None
        for name in teacher_namespace:
            if callable(teacher_namespace[name]):
                teacher_function = teacher_namespace[name]
                break

        # Find the student-defined function (it's assumed to be the first function defined)
        student_function = None
        for name in student_namespace:
            if callable(student_namespace[name]):
                student_function = student_namespace[name]
                break

        # Check if the student's function is defined
        if teacher_function is not None and student_function is not None:
            # Call the teacher-defined function and the student-defined function with the test case input
            teacher_output = teacher_function(*test_case["input"])
            student_output = student_function(*test_case["input"])
            # If both functions return the same output, then they are correct. Otherwise, they are incorrect.
            if teacher_output == student_output:
                print("Pass!")
                return "Pass"
            else:
                print("Incorrect!")
                return f"Fail: Expected {teacher_output}, but got {student_output}"

        

    except Exception as e:
        print(e)

