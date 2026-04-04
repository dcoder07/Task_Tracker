"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdDelete, MdEdit, MdCheck, MdClose, MdArrowBack } from "react-icons/md";
import {
  updateTicketStatus,
  updateTicketDetails,
  deleteTicket,
  addComment,
  getComments,
  deleteComment,
} from "@/db/actions";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

const STATUS_OPTIONS = [
  { value: "backlog", label: "Backlog", color: "from-slate-500" },
  { value: "in_progress", label: "In Progress", color: "from-blue-500" },
  { value: "in_review", label: "In Review", color: "from-amber-500" },
  { value: "done", label: "Done", color: "from-emerald-500" },
];

export function TicketDetailClient({ ticket: initialTicket, initialComments, currentUser }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(ticket.body);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(ticket.title);
  const [isLoadingComment, setIsLoadingComment] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    
    try {
      setTicket({ ...ticket, status: newStatus });
      await updateTicketStatus(ticket.id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      setTicket(initialTicket);
    }
  };

  const handleSaveTitle = async () => {
    if (editedTitle.trim() === "" || editedTitle === ticket.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      setTicket({ ...ticket, title: editedTitle });
      await updateTicketDetails(ticket.id, { title: editedTitle });
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      setEditedTitle(ticket.title);
    }
  };

  const handleSaveDescription = async () => {
    if (editedDescription.trim() === "" || editedDescription === ticket.body) {
      setIsEditingDescription(false);
      return;
    }

    try {
      setTicket({ ...ticket, body: editedDescription });
      await updateTicketDetails(ticket.id, { body: editedDescription });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update description:", error);
      setEditedDescription(ticket.body);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoadingComment(true);
    try {
      const author = currentUser || "Anonymous";
      setComments([
        ...comments,
        {
          id: Date.now(),
          author,
          content: newComment,
          created_at: new Date(),
        },
      ]);
      setNewComment("");
      await addComment(ticket.id, author, newComment);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsLoadingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
    try {
      await deleteComment(commentId, ticket.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setComments(initialComments);
    }
  };

  const handleDeleteTicket = async () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteTicket(ticket.id);
        router.push("/tickets");
      } catch (error) {
        console.error("Failed to delete ticket:", error);
      }
    }
  };

  const isDued = dayjs(ticket.due_date).isBefore(dayjs());
  const statusObj = STATUS_OPTIONS.find((s) => s.value === ticket.status);

  return (
    <div className='max-w-screen-2xl mx-auto px-4 py-8'>
      {/* Header / Navigation */}
      <Link
        href='/tickets'
        className='inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 mb-6 transition'
      >
        <MdArrowBack /> Back to Board
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Title Section */}
          <div className='glass-card p-6 rounded-3xl border border-white/10'>
            {isEditingTitle ? (
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className='flex-1 glass-panel px-4 py-2 rounded-lg text-white border border-cyan-400/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className='bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-lg hover:bg-emerald-500/30 transition'
                >
                  <MdCheck />
                </button>
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setEditedTitle(ticket.title);
                  }}
                  className='bg-red-500/20 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition'
                >
                  <MdClose />
                </button>
              </div>
            ) : (
              <div className='flex items-start justify-between gap-4'>
                <h1 className='text-3xl md:text-4xl font-bold text-white flex-1'>
                  {ticket.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className='bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition'
                >
                  <MdEdit />
                </button>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className='glass-card p-6 rounded-3xl border border-white/10'>
            <h2 className='text-lg font-bold text-cyan-100 mb-4'>Description</h2>
            {isEditingDescription ? (
              <div className='flex flex-col gap-2'>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={6}
                  className='glass-panel px-4 py-3 rounded-lg text-white border border-cyan-400/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 resize-none'
                  autoFocus
                />
                <div className='flex gap-2'>
                  <button
                    onClick={handleSaveDescription}
                    className='bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition font-semibold flex items-center gap-2'
                  >
                    <MdCheck /> Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingDescription(false);
                      setEditedDescription(ticket.body);
                    }}
                    className='bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition font-semibold flex items-center gap-2'
                  >
                    <MdClose /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className='text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap'>
                  {ticket.body}
                </p>
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className='bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition font-semibold flex items-center gap-2'
                >
                  <MdEdit /> Edit Description
                </button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className='glass-card p-6 rounded-3xl border border-white/10'>
            <h2 className='text-lg font-bold text-cyan-100 mb-6'>Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className='mb-6 pb-6 border-b border-white/10'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Add a comment...'
                rows={3}
                className='w-full glass-panel px-4 py-3 rounded-lg text-white border border-cyan-400/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 placeholder-slate-400 resize-none mb-3'
              />
              <button
                type='submit'
                disabled={!newComment.trim() || isLoadingComment}
                className='primary-btn px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoadingComment ? "Adding..." : "Post Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className='space-y-4'>
              {comments.length === 0 ? (
                <p className='text-slate-400 text-center py-8'>No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className='glass-panel p-4 rounded-xl border border-white/10'>
                    <div className='flex items-start justify-between gap-3 mb-2'>
                      <div>
                        <p className='font-semibold text-cyan-100'>{comment.author}</p>
                        <p className='text-xs text-slate-400'>{dayjs(comment.created_at).fromNow()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className='text-red-300 hover:text-red-200 transition'
                      >
                        <MdDelete />
                      </button>
                    </div>
                    <p className='text-slate-200 text-sm whitespace-pre-wrap'>{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Status */}
          <div className='glass-card p-5 rounded-2xl border border-white/10'>
            <h3 className='text-sm font-bold text-slate-300 uppercase tracking-wide mb-3'>Status</h3>
            <div className='space-y-2'>
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                    ticket.status === status.value
                      ? `bg-gradient-to-r ${status.color} to-transparent text-white shadow-lg`
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className='glass-card p-5 rounded-2xl border border-white/10'>
            <h3 className='text-sm font-bold text-slate-300 uppercase tracking-wide mb-3'>Priority</h3>
            <div
              className={`px-4 py-3 rounded-lg font-bold text-center pill-${ticket.priority}`}
            >
              {ticket.priority.toUpperCase()}
            </div>
          </div>

          {/* Assignee */}
          <div className='glass-card p-5 rounded-2xl border border-white/10'>
            <h3 className='text-sm font-bold text-slate-300 uppercase tracking-wide mb-3'>Assigned To</h3>
            <div className='flex items-center gap-3'>
              <Image
                src={ticket.imgSrc}
                width={48}
                height={48}
                alt='Assignee'
                className='rounded-full ring-2 ring-cyan-300/40'
              />
              <div className='flex-1'>
                <p className='font-semibold text-white text-sm'>{ticket.user_email}</p>
                <p className='text-xs text-slate-400'>Assignee</p>
              </div>
            </div>
          </div>

          {/* Reporter */}
          <div className='glass-card p-5 rounded-2xl border border-white/10'>
            <h3 className='text-sm font-bold text-slate-300 uppercase tracking-wide mb-3'>Reported By</h3>
            <p className='text-white font-semibold'>{ticket.reported_by}</p>
            <p className='text-xs text-slate-400'>{dayjs(ticket.created_at).format("DD MMM YYYY, HH:mm")}</p>
          </div>

          {/* Dates */}
          <div className='glass-card p-5 rounded-2xl border border-white/10'>
            <h3 className='text-sm font-bold text-slate-300 uppercase tracking-wide mb-3'>Timeline</h3>
            <div className='space-y-3'>
              <div>
                <p className='text-xs text-slate-400 mb-1'>Created</p>
                <p className={`text-sm font-semibold ${isDued ? "text-red-300" : "text-cyan-200"}`}>
                  {dayjs(ticket.created_at).format("DD MMM YYYY")}
                </p>
              </div>
              <div>
                <p className='text-xs text-slate-400 mb-1'>Due Date</p>
                <p className={`text-sm font-semibold ${isDued ? "text-red-300" : "text-cyan-200"}`}>
                  {dayjs(ticket.due_date).format("DD MMM YYYY")}
                  {isDued && " (Overdue)"}
                </p>
              </div>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={handleDeleteTicket}
            className='w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
          >
            <MdDelete /> Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
