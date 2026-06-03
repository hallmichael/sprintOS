import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import './IndiWysiwygInput.css';
import { IndiText } from './text';

// Platform check - only import ReactQuill on web
const isWeb = Platform.OS === 'web';

// Import ReactQuill CSS for web platform
if (isWeb) {
  import('react-quill-new/dist/quill.snow.css');
}

interface IndiWysiwygInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  readOnly?: boolean;
  onBlur?: (value: string) => void;
}

export interface IndiWysiwygInputRef {
  save: () => Promise<any>;
  clear: () => void;
  render: (data: any) => void;
}

const IndiWysiwygInput = forwardRef<IndiWysiwygInputRef, IndiWysiwygInputProps>(
  ({ value, onChange, placeholder, label, error, readOnly = false, onBlur }, ref) => {
    const quillRef = useRef<any>(null);
    const isInitializedRef = useRef(false);
    const lastValueRef = useRef<string>(value || '');
    const pendingValueRef = useRef<string | null>(null);
    const [quillValue, setQuillValue] = useState<string>('');
    const [ReactQuillComponent, setReactQuillComponent] = useState<any>(null);
    const isUserTypingRef = useRef<boolean>(false);

    // Convert HTML to plain text
    const convertToPlainText = (html: string): string => {
      if (!html) return '';

      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Get text content and normalize whitespace
      return tempDiv.textContent || tempDiv.innerText || '';
    };

    // Convert plain text to HTML
    const convertFromPlainText = (text: string): string => {
      if (!text) return '';

      // Simple conversion - you can enhance this based on your needs
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) return '';

      const htmlLines = lines.map(line => {
        const trimmedLine = line.trim();

        // Check if it's a header
        if (trimmedLine.startsWith('#')) {
          const level = trimmedLine.match(/^#+/)?.[0].length || 3;
          const text = trimmedLine.replace(/^#+\s*/, '');
          return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`;
        }

        // Check if it's a list item
        if (trimmedLine.match(/^[•\-\*]\s/)) {
          return `<li>${trimmedLine.replace(/^[•\-\*]\s/, '')}</li>`;
        }

        // Check if it's an ordered list item
        if (trimmedLine.match(/^\d+\.\s/)) {
          return `<li>${trimmedLine.replace(/^\d+\.\s/, '')}</li>`;
        }

        // Default to paragraph
        return `<p>${trimmedLine}</p>`;
      });

      return htmlLines.join('');
    };

    // Initialize component state and load ReactQuill
    useEffect(() => {
      if (!isWeb) return;

      // Load ReactQuill dynamically
      const loadReactQuill = async () => {
        try {
          const { default: ReactQuill } = await import('react-quill-new');
          setReactQuillComponent(() => ReactQuill);
        } catch (error) {
          console.error('Error loading ReactQuill:', error);
        }
      };

      loadReactQuill();

      // Use pending value if available, otherwise use current value
      const valueToUse = pendingValueRef.current !== null ? pendingValueRef.current : value;
      const initialHtml = valueToUse ? convertFromPlainText(valueToUse) : '';

      setQuillValue(initialHtml);
      lastValueRef.current = valueToUse || '';
      isInitializedRef.current = true;
      pendingValueRef.current = null; // Clear pending value
      console.log('ReactQuill initialized successfully with value:', valueToUse);
    }, []); // Only run once on mount

    // Handle value prop changes (for controlled component behavior)
    useEffect(() => {
      if (!isWeb) return;

      // If not initialized yet, store the value as pending and wait for initialization
      if (!isInitializedRef.current) {
        if (value !== lastValueRef.current) {
          pendingValueRef.current = value || '';
          console.log('ReactQuill: Value changed before initialization, storing as pending:', value);
        }
        return;
      }

      // Skip if value hasn't changed
      if (lastValueRef.current === (value || '')) return;

      // Skip if user is actively typing to prevent content deletion
      if (isUserTypingRef.current) return;

      // Update quill content only if the change is from external source (not user typing)
      const updateContent = () => {
        try {
          // If value is HTML content, use it directly; if it's plain text, convert it
          const html = value ? (value.includes('<') ? value : convertFromPlainText(value)) : '';

          // Only update if the HTML content is actually different
          if (quillValue !== html) {
            setQuillValue(html);
            lastValueRef.current = value || '';
            console.log('ReactQuill content updated from external source');
          }
        } catch (error) {
          console.error('Error updating ReactQuill content:', error);
        }
      };

      // Debounce updates to prevent rapid changes
      const timeoutId = setTimeout(updateContent, 100);

      return () => clearTimeout(timeoutId);
    }, [value, quillValue]);

    // Handle Quill value changes
    const handleQuillChange = (content: string, delta: any, source: any, editor: any) => {
      if (onChange && source === 'user') {
        // Set typing flag to prevent external updates
        isUserTypingRef.current = true;

        // Update local state immediately to prevent content loss
        setQuillValue(content);

        // Pass the HTML content directly to onChange to preserve formatting
        if (lastValueRef.current !== content) {
          lastValueRef.current = content;
          onChange(content); // Pass HTML content, not plain text
        }

        // Clear typing flag after a short delay
        setTimeout(() => (isUserTypingRef.current = false), 100);
      }
    };

    // Handle Quill blur
    const handleQuillBlur = (previousRange: any, source: any, editor: any) => {
      if (onBlur) {
        const content = editor.getHTML();
        onBlur(content);
      }
      // Reset typing flag when editor loses focus
      isUserTypingRef.current = false;
    };

    // Handle Quill focus
    const handleQuillFocus = (range: any, source: any, editor: any) => {
      // Reset typing flag when editor gains focus
      isUserTypingRef.current = false;
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      save: async () => {
        if (!isWeb || !quillRef.current) {
          return null;
        }
        // Return the HTML content
        const html = quillRef.current.getHTML();
        return {
          html,
          text: convertToPlainText(html),
        };
      },
      clear: () => {
        if (!isWeb || !quillRef.current) {
          return;
        }
        // Use Quill's setText method to clear content
        quillRef.current.setText('');
        setQuillValue('');
        lastValueRef.current = '';
      },
      render: async (data: any) => {
        if (!isWeb || !quillRef.current) {
          return;
        }
        // Handle both HTML and plain text data
        if (typeof data === 'string') {
          // If it's a string, assume it's HTML
          quillRef.current.setHTML(data);
          setQuillValue(data);
          lastValueRef.current = data;
        } else if (data && data.html) {
          // If it has html property
          quillRef.current.setHTML(data.html);
          setQuillValue(data.html);
          lastValueRef.current = data.html;
        } else if (data && data.text) {
          // If it has text property, convert to HTML
          const html = convertFromPlainText(data.text);
          quillRef.current.setHTML(html);
          setQuillValue(html);
          lastValueRef.current = html;
        }
      },
    }));

    // For non-web platforms, show a simple text input
    if (Platform.OS !== 'web') {
      return (
        <View style={{ width: '100%' }}>
          {label && (
            <IndiText mb={'$2'} color="$textNeutral">
              {label}
            </IndiText>
          )}

          <View
            style={{
              borderWidth: 1,
              borderColor: error ? '#ef4444' : '#d1d5db',
              borderRadius: 6,
              minHeight: 200,
              padding: 8,
              backgroundColor: readOnly ? '#f9fafb' : '#ffffff',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#6b7280', fontStyle: 'italic' }}>
              Rich text editor not available on this platform
            </Text>
          </View>

          {error && (
            <Text
              style={{
                color: '#ef4444',
                fontSize: 12,
                marginTop: 4,
              }}>
              {error}
            </Text>
          )}
        </View>
      );
    }

    // Web platform - render ReactQuill
    return (
      <View style={{ width: '100%' }}>
        {label && (
          <IndiText mb="$2" color="$textNeutral">
            {label}
          </IndiText>
        )}

        {isWeb && ReactQuillComponent && (
          <div
            style={{
              border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
              borderRadius: 6,
              minHeight: 200,
              padding: '8px',
              backgroundColor: readOnly ? '#f9fafb' : '#ffffff',
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'Inter, sans-serif',
            }}>
            <ReactQuillComponent
              ref={quillRef}
              theme="snow"
              value={quillValue}
              onChange={handleQuillChange}
              onBlur={handleQuillBlur}
              onFocus={handleQuillFocus}
              placeholder={placeholder || 'Start writing...'}
              readOnly={readOnly}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  ['link'],
                  ['clean'],
                ],
              }}
            />
          </div>
        )}

        {error && (
          <Text
            style={{
              color: '#ef4444',
              fontSize: 12,
              marginTop: 4,
            }}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

IndiWysiwygInput.displayName = 'IndiWysiwygInput';

export default IndiWysiwygInput;
