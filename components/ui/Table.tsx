"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

function TableRoot({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) { return <div className="overflow-x-auto"><table className={cn("w-full min-w-[680px] text-left text-sm", className)} {...props}>{children}</table></div>; }
function Header({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead className={cn("bg-bg-weak-50 text-xs font-medium text-text-sub-600", className)} {...props}>{children}</thead>; }
function Body({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody className={cn("divide-y divide-stroke-soft-200", className)} {...props}>{children}</tbody>; }
function Row({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn("transition-colors hover:bg-bg-weak-50", className)} {...props}>{children}</tr>; }
function Head({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn("h-10 px-4 py-2 font-medium", className)} {...props}>{children}</th>; }
function Cell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn("px-4 py-3 align-middle", className)} {...props}>{children}</td>; }

export const Table = Object.assign(TableRoot, { Header, Body, Row, Head, Cell });
