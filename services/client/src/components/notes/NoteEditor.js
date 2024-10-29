import React from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';

const NoteEditor = ({ noteContent, handleEditorChange, isEditMode }) => {
    const content = typeof noteContent === 'string' ? noteContent : '';

    return (
        <>
            {isEditMode ? (
                <div data-color-mode="light">
                    <MarkdownEditor
                        height="100vh"
                        value={content}
                        onChange={handleEditorChange}
                        visible={true}
                    />
                </div>
            ) : (
                <div data-color-mode="light">
                    <MarkdownEditor.Markdown
                        source={content}
                        height="auto"
                    />
                </div>
            )}
        </>
    );
};

export default NoteEditor;
