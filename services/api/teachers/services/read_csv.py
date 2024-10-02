import io
import csv

class ReadCSV:
    def __init__(self, file):
        self.file = file

    def read(self)->dict:
        try:
            data_set = self.file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)

            parsed_data = []

            reader = csv.DictReader(io_string, delimiter=',', quotechar='|')

            for row in reader:
                parsed_data.append({
                    'teacher_id': row.get('teacher_id'),
                    'first_name': row.get('first_name'),
                    'last_name': row.get('last_name'),
                    'email': row.get('email'),
                    'phone': row.get('phone'),
                    'gender': row.get('gender'),
                    'date_of_birth': row.get('date_of_birth'),
                    'address': row.get('address')
                })
            
            return parsed_data
        
        except Exception as e:
            return {'error': str(e)}

