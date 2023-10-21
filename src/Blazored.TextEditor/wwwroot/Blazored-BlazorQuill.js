﻿(function () {
    window.QuillFunctions = {     
        dotNetObjReferences: {},
        createQuill: function (
            quillElement, toolBar, readOnly,
            placeholder, theme, formats, debugLevel, dotNetObjRef) {  

            Quill.register('modules/blotFormatter', QuillBlotFormatter.default);

            var options = {
                debug: debugLevel,
                modules: {
                    toolbar: toolBar,
                    blotFormatter: {}
                },
                placeholder: placeholder,
                readOnly: readOnly,
                theme: theme
            };

            if (formats) {
                options.formats = formats;
            }

            new Quill(quillElement, options);

            // calls C# [JSInvokable] OnBlur when clicking outside of quill
            if (dotNetObjRef) {
                this.dotNetObjReferences[quillElement.id] = dotNetObjRef;
                document.getElementById(quillElement.id).firstChild.onblur = (event) => {
                    if (Object.keys(this.dotNetObjReferences).length === 0 || !this.dotNetObjReferences.hasOwnProperty(quillElement.id)) {
                        return;
                    }
                    if (event.relatedTarget === null || event.relatedTarget.type === "submit" || document.getElementById(quillElement.id).parentElement.contains(event.relatedTarget)===false ) {
                        this.dotNetObjReferences[quillElement.id].invokeMethodAsync('OnBlur', quillElement.__quill.root.innerHTML);
                    }
                }
            }
        },
        getQuillContent: function(quillElement) {
            return JSON.stringify(quillElement.__quill.getContents());
        },
        getQuillText: function(quillElement) {
            return quillElement.__quill.getText();
        },
        getQuillHTML: function(quillElement) {
            return quillElement.__quill.root.innerHTML;
        },
        loadQuillContent: function(quillElement, quillContent) {
            content = JSON.parse(quillContent);
            return quillElement.__quill.setContents(content, 'api');
        },
        loadQuillHTMLContent: function (quillElement, quillHTMLContent) {
            return quillElement.__quill.root.innerHTML = quillHTMLContent;
        },
        enableQuillEditor: function (quillElement, mode) {
            quillElement.__quill.enable(mode);
        },
        insertQuillImage: function (quillElement, imageURL) {
            var Delta = Quill.import('delta');
            editorIndex = 0;

            if (quillElement.__quill.getSelection() !== null) {
                editorIndex = quillElement.__quill.getSelection().index;
            }

            return quillElement.__quill.updateContents(
                new Delta()
                    .retain(editorIndex)
                    .insert({ image: imageURL },
                        { alt: imageURL }));
        },
        insertQuillText: function (quillElement, text) {
            editorIndex = 0;
            selectionLength = 0;

            if (quillElement.__quill.getSelection() !== null) {
                selection = quillElement.__quill.getSelection();
                editorIndex = selection.index;
                selectionLength = selection.length;
            }

            return quillElement.__quill.deleteText(editorIndex, selectionLength)
                .concat(quillElement.__quill.insertText(editorIndex, text));
        }
    };
})();