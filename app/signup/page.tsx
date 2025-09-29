"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt:", formData);
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`${provider} signup clicked`);
  };

  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width">
          <div className="card p-8">
            <div className="logo-container">
              <Image
                src="/icons/app-logo.svg"
                alt="Lucky Numbers"
                width={80}
                height={80}
                priority
              />
            </div>
            <h2 className="page-title">
              계정 만들기
            </h2>
            <p className="page-subtitle">
              또는{" "}
              <Link href="/login" className="navigation-link">
                기존 계정으로 로그인
              </Link>
            </p>

            {/* Social Login Section */}
            <div className="divider-section">
              <div className="divider-text">
                <span>또는 다음으로 계속</span>
              </div>
            </div>

            <div className="social-grid">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("GitHub")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                />
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Kakao")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <Image
                  src="/icons/kakao.svg"
                  alt="카카오"
                  width={20}
                  height={20}
                />
                <span>카카오</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Naver")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <Image
                  src="/icons/naver.svg"
                  alt="네이버"
                  width={20}
                  height={20}
                />
                <span>네이버</span>
              </button>
            </div>

            <form className="form-section" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label htmlFor="first-name" className="form-label">
                      성
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="input-field"
                      placeholder="성을 입력하세요"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name" className="form-label">
                      이름
                    </label>
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="input-field"
                      placeholder="이름을 입력하세요"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email-address" className="form-label">
                    이메일 주소
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field"
                    placeholder="이메일 주소를 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-field"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    비밀번호 확인
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-field"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="checkbox"
                />
                <label htmlFor="agree-terms" className="text-sm text-gray-700">
                  다음에 동의합니다{" "}
                  <Link href="#" className="navigation-link">
                    서비스 약관
                  </Link>{" "}
                  및{" "}
                  <Link href="#" className="navigation-link">
                    개인정보 처리방침
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                계정 만들기
              </button>

              <div className="text-center">
                <Link href="/" className="navigation-link">
                  ← 홈으로 돌아가기
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}