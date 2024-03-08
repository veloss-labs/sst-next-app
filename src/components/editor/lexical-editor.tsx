import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  type InitialConfigType,
  LexicalComposer,
  type InitialEditorStateType,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {
  type EditorState,
  type Klass,
  type LexicalEditor as ReactLexicalEditor,
  type LexicalNode,
  type HTMLConfig,
} from 'lexical';
import React, { useCallback, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import MentionsPlugin from '~/components/editor/plugins/mentions-plugin';
import HashTagsPlugin from '~/components/editor/plugins/hashtags-plugin';
import LexicalAutoLinkPlugin from '~/components/editor/plugins/auto-link-plugin';
import LinkPlugin from '~/components/editor/plugins/hashtags-plugin';
import AutoLinkPlugin from '~/components/editor/plugins/auto-link-plugin';
import MentionNode from '~/components/editor/nodes/mention-node';
import HashTagNode from '~/components/editor/nodes/hashtag-node';
import LexicalOnBlurPlugin from '~/components/editor/plugins/blur-plugin';
import { AutoLinkNode, LinkNode } from '@lexical/link';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-0">
      <span className=" relative block min-w-0 max-w-full overflow-visible whitespace-pre-line break-words text-left text-slate-500 dark:placeholder:text-slate-400">
        스레드를 시작하세요...
      </span>
    </div>
  );
}

const EditorNodes: Array<Klass<LexicalNode>> = [
  MentionNode,
  HashTagNode,
  AutoLinkNode,
  LinkNode,
];

interface LexicalEditorProps {
  editable?: boolean;
  html?: HTMLConfig;
  editorState?: InitialEditorStateType;
  onChange?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    tags: Set<string>,
  ) => void;
  onBlur?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    event: FocusEvent,
  ) => void;
}
export default function LexicalEditor(props: LexicalEditorProps) {
  return <LexicalEditor.Root {...props} />;
}

LexicalEditor.Root = function LexicalEditorRoot({
  onChange,
  ...otherProps
}: LexicalEditorProps) {
  const [editorConfig, setEditorConfig] = useState<InitialConfigType>({
    namespace: 'ThreadEditor',
    nodes: [...EditorNodes],
    onError(error: Error) {
      throw error;
    },
    theme: {
      paragraph: 'm-0',
      text: {
        base: 'js-lexical-text',
      },
      link: 'js-lexical-link',
    },
    ...otherProps,
  });

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="col-start-2 row-start-2 row-end-2">
        <LexicalEditor.Editor onChange={onChange} />
      </div>
    </LexicalComposer>
  );
};

interface LexicalEditorEditorProps {
  onChange?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    tags: Set<string>,
  ) => void;
  onBlur?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    event: FocusEvent,
  ) => void;
}

LexicalEditor.Editor = function LexicalEditorEditor({
  onChange,
  onBlur,
}: LexicalEditorEditorProps) {
  const onEditorChange = useCallback(
    (
      editorState: EditorState,
      changedEditor: ReactLexicalEditor,
      tags: Set<string>,
    ) => {
      onChange?.(editorState, changedEditor, tags);
    },
    [onChange],
  );

  const onEditorBlur = useCallback(
    (
      editorState: EditorState,
      editor: ReactLexicalEditor,
      event: FocusEvent,
    ) => {
      onBlur?.(editorState, editor, event);
    },
    [onBlur],
  );

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="relative overflow-auto outline-none" />
        }
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <AutoLinkPlugin />
      <MentionsPlugin />
      <HashTagsPlugin />
      <LexicalAutoLinkPlugin />
      <LinkPlugin />
      <OnChangePlugin onChange={onEditorChange} />
      <LexicalOnBlurPlugin onBlur={onEditorBlur} />
    </div>
  );
};

LexicalEditor.Skeleton = function LexicalEditorSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[450px]" />
      <Skeleton className="h-4 w-[350px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[550px]" />
      <Skeleton className="h-4 w-[500px]" />
    </div>
  );
};
