"use client";

import { useDispatch } from "react-redux";
import { openLogin } from "../Redux/AuthenticationModalSlice";

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export default function LoginButton({ className, children }: Props) {
    const dispatch = useDispatch();

    return (
        <button type="button" className={className} onClick={() => dispatch(openLogin())}>
            Login
            {children}
        </button>
    );
}