"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  Logo,
  Button,
  Input,
  SocialLoginSection
} from "@/components";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width">
          <Card className="p-8">
            <Logo size="medium" />
            <h2 className="page-title">
              계정에 로그인
            </h2>
            <p className="page-subtitle">
              또는{" "}
              <Link href="/signup" className="navigation-link">
                새 계정 만들기
              </Link>
            </p>

            <SocialLoginSection onSocialLogin={handleSocialLogin} />

            <form className="form-section" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-section">
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  label="이메일 주소"
                  placeholder="이메일 주소를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  label="비밀번호"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="checkbox-group">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label htmlFor="remember-me" className="text-sm text-gray-700">
                    로그인 상태 유지
                  </label>
                </div>

                <Link href="#" className="navigation-link text-sm">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                isLoading={isLoading}
                className="w-full"
              >
                로그인
              </Button>

              <div className="text-center">
                <Link href="/" className="navigation-link">
                  ← 홈으로 돌아가기
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}