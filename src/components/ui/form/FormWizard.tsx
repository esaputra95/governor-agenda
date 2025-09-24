"use client";
import React, { useImperativeHandle, useState, forwardRef } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

/**
 * Generic Wizard component (Bootstrap-like stepper style)
 * - Reusable multi-step flow
 * - Bring your own form inside each step
 * - Sky color theme
 */

export type WizardHandle = {
  next: () => Promise<void> | void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  getCurrent: () => number;
  isLast: () => boolean;
};

export type WizardStep = {
  label: string;
  content: React.ReactNode;
  /** Optional validation handler before moving next */
  onNext?: () => boolean | Promise<boolean>;
  /** Optional react-icons component */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
};

type WizardProps = {
  steps: WizardStep[];
  onFinish?: () => void | Promise<void>;
  current?: number; // controlled current step
  initial?: number; // uncontrolled initial step (default 0)
  onStepChange?: (i: number) => void; // notify parent on step change
  withButton?: boolean;
};

const Wizard = forwardRef<WizardHandle, WizardProps>(function Wizard(
  { steps, onFinish, current, initial = 0, onStepChange, withButton = true },
  ref
) {
  const [internal, setInternal] = useState(initial);
  const controlled = typeof current === "number";
  const idx = controlled ? (current as number) : internal;
  const last = idx === steps.length - 1;

  function goto(next: number) {
    if (next < 0 || next > steps.length - 1) return;
    if (!controlled) setInternal(next);
    onStepChange?.(next);
  }

  const next = async () => {
    const handler = steps[idx]?.onNext;
    if (handler) {
      const ok = await handler();
      if (ok === false) return;
    }
    if (!last) goto(idx + 1);
    else await onFinish?.();
  };

  const prev = () => {
    if (idx === 0) return;
    goto(idx - 1);
  };

  useImperativeHandle(ref, () => ({
    next,
    prev,
    goTo: goto,
    reset: () => goto(0),
    getCurrent: () => idx,
    isLast: () => last,
  }));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Stepper steps={steps} current={idx} onPick={(i) => goto(i)} />

      <div className="mt-6">{steps[idx].content}</div>
      {withButton && (
        <div className="flex gap-2 justify-between pt-4">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="btn btn-ghost"
          >
            Kembali
          </button>
          {last ? (
            <button type="button" onClick={onFinish} className="btn btn-sky">
              Selesai
            </button>
          ) : (
            <button type="button" onClick={next} className="btn btn-sky">
              Lanjut
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .btn {
          @apply inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50;
        }
        .btn-sky {
          @apply bg-sky-600 text-white border-sky-600 hover:bg-sky-700;
        }
        .btn-ghost {
          @apply border-transparent text-gray-600 hover:bg-gray-100;
        }
      `}</style>
    </div>
  );
});

function Stepper({
  steps,
  current,
}: {
  steps: WizardStep[];
  current: number;
  onPick?: (i: number) => void;
}) {
  return (
    <div className="relative flex justify-center">
      <ol className="relative z-[1] flex justify-between w-full max-w-3xl">
        {steps.map((s, i) => {
          const Icon = s.icon ?? FaRegCircle;
          const isActive = i === current;
          const isDone = i < current;

          return (
            <li
              key={s.label}
              className="flex flex-1 flex-col items-center gap-2 select-none cursor-pointer"
              // onClick={() => onPick?.(i)}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-[22px] h-[2px] transition-colors ${
                    isDone ? "bg-sky-600" : "bg-sky-200"
                  }`}
                  style={{
                    left: `${(i / (steps.length - 1)) * 100}%`,
                    width: `${100 / (steps.length - 1)}%`,
                  }}
                />
              )}

              <div
                className={`flex items-center justify-center rounded-full border transition-colors size-10 mx-auto z-10 ${
                  isActive
                    ? "bg-sky-600 text-white border-sky-600"
                    : isDone
                    ? "bg-white text-sky-700 border-sky-600"
                    : "bg-white text-sky-600 border-sky-300"
                }`}
              >
                {isDone ? <FaCheckCircle size={18} /> : <Icon size={18} />}
              </div>
              <span
                className={`text-xs sm:text-sm text-center ${
                  isActive ? "text-sky-700 font-medium" : "text-gray-600"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Wizard;
