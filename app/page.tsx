"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width-lg text-center">
          <main className="space-y-12">
            <div className="logo-container">
              <Image
                src="/icons/app-logo.svg"
                alt="Lucky Numbers"
                width={120}
                height={120}
                priority
              />
            </div>
            <div className="card-glass p-6 mb-8">
              <h1 className="page-title">Lucky Numbers</h1>
              <p className="page-subtitle">
                행운의 로또 번호를 생성해보세요!<br />
                로그인하여 더 많은 기능을 이용하세요.
              </p>
            </div>

            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {user ? (
              // 로그인된 상태
              <div className="space-y-8">
                {/* 사용자 정보 표시 */}
                <div className="user-profile">
                  <div className="user-avatar">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{user.firstName} {user.lastName}님</h3>
                  <p className="text-white/80">{user.email}</p>
                </div>

                {/* 메뉴 버튼들 */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/lotto" className="btn btn-primary btn-large">
                    🎰 로또 생성기
                  </Link>
                  <Link href="/roulette" className="btn btn-primary btn-large">
                    🎯 룰렛 추첨
                  </Link>
                  <button onClick={logout} className="btn btn-danger">
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              // 로그인되지 않은 상태
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/lotto" className="btn btn-primary btn-large">
                  🎰 로또 생성기
                </Link>
                <Link href="/roulette" className="btn btn-primary btn-large">
                  🎯 룰렛 추첨
                </Link>
                <Link href="/login" className="btn btn-outline">
                  로그인
                </Link>
                <Link href="/signup" className="btn btn-secondary">
                  회원가입
                </Link>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2024 Lucky Numbers. 모든 권리 보유.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                로또 생성기는 재미를 위한 것이며, 당첨을 보장하지 않습니다.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
