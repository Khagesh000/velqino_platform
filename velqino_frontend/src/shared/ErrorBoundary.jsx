"use client";

import React from 'react';
import { AlertCircle, RefreshCw } from '@/utils/icons';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-[320px] bg-white rounded-2xl border border-rose-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 shadow-2xs">
            <AlertCircle size={26} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {this.props.title || "Temporary Display Interruption"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {this.props.description || "An unexpected rendering event occurred. Your data and account remain completely safe."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <RefreshCw size={14} />
            <span>Reload Section</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
