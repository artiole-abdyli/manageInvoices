"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Space, Tooltip } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  ClearOutlined,
} from "@ant-design/icons";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

function exec(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

const RichEditor: React.FC<Props> = ({ value, onChange, placeholder = "Write here...", minHeight = 180 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && typeof value === "string" && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    const html = ref.current?.innerHTML || "";
    onChange?.(html);
  };

  const addLink = () => {
    const url = prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const clearFormatting = () => {
    exec("removeFormat");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <Tooltip title="Bold"><Button size="small" icon={<BoldOutlined />} onClick={() => exec("bold")} /></Tooltip>
        <Tooltip title="Italic"><Button size="small" icon={<ItalicOutlined />} onClick={() => exec("italic")} /></Tooltip>
        <Tooltip title="Underline"><Button size="small" icon={<UnderlineOutlined />} onClick={() => exec("underline")} /></Tooltip>
        <Tooltip title="Bulleted list"><Button size="small" icon={<UnorderedListOutlined />} onClick={() => exec("insertUnorderedList")} /></Tooltip>
        <Tooltip title="Numbered list"><Button size="small" icon={<OrderedListOutlined />} onClick={() => exec("insertOrderedList")} /></Tooltip>
        <Tooltip title="Insert link"><Button size="small" icon={<LinkOutlined />} onClick={addLink} /></Tooltip>
        <Tooltip title="Clear formatting"><Button size="small" icon={<ClearOutlined />} onClick={clearFormatting} /></Tooltip>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onFocus={() => setFocused(true)}
        onMouseDown={() => setFocused(true)}
        onKeyDown={() => setFocused(true)}
        style={{
          minHeight,
          padding: 10,
          border: "1px solid #1f2937",
          borderRadius: 8,
          color: "#e5e7eb",
          outline: focused ? "1px solid #7c3aed" : "none",
        }}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;

