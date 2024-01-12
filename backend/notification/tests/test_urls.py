from django.test import SimpleTestCase
from django.urls import reverse, resolve
from notification.views import addNotes, getNotes, deleteNotes, getNotesByID, updateNotes, updateNotesTitle


class TestUrls(SimpleTestCase):
    
    def test_add_notes_url_is_resolved(self):
        url = reverse('addNotes')
        self.assertEqual(resolve(url).func, addNotes)
    
    def test_get_notes_url_is_resolved(self):
        url = reverse('getNotes', args=[1])
        self.assertEqual(resolve(url).func, getNotes)
    
    def test_delete_notes_url_is_resolved(self):
        url = reverse('deleteNotes', args=[1])
        self.assertEqual(resolve(url).func, deleteNotes)
    
    def test_get_notes_by_id_url_is_resolved(self):
        url = reverse('getNotesByID', args=[1, 2])
        self.assertEqual(resolve(url).func, getNotesByID)
    
    def test_update_notes_url_is_resolved(self):
        url = reverse('updateNotes', args=[1])
        self.assertEqual(resolve(url).func, updateNotes)
    
    def test_update_notes_title_url_is_resolved(self):
        url = reverse('updateNotesTitle', args=[1])
        self.assertEqual(resolve(url).func, updateNotesTitle)