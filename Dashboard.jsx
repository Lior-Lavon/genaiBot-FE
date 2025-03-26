import React from "react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { TopBar } from ".";

const Dashboard = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      {/* <TopBar /> */}

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-gray-200 transition-all duration-300 ease-in-out h-full ${
            leftOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <div className="h-full p-4">Left Sidebar</div>
        </aside>

        <div className="w-full flex flex-col">
          <div className="flex justify-between py-4 ">
            <button onClick={() => setLeftOpen(!leftOpen)} size="sm">
              <Menu className="w-8 h-8 mr-2" />
            </button>
            <button onClick={() => setRightOpen(!rightOpen)} size="sm">
              <Menu className="w-8 h-8 mr-2" />
            </button>
          </div>

          {/* Content Area */}
          <main className="flex-1 bg-white overflow-auto">
            <div className="text-center px-2">
              <h1 className="text-2xl font-semibold mb-4">Content Area</h1>
              <p className="text-xl mb-4">
                This area expands between the sidebars and under the top bar.
              </p>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
              <div className="w-full bg-amber-100 my-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates voluptatibus temporibus, tempore alias omnis
                  inventore fugiat deleniti minus perspiciatis, soluta obcaecati
                  eum porro impedit saepe error quibusdam vero cupiditate
                  aspernatur distinctio sequi. Vero dolore ipsam quod. Labore
                  debitis esse modi repudiandae quia, vel soluta provident
                  perspiciatis similique aliquam asperiores eligendi
                  necessitatibus. Tempora esse odio sit ea, reiciendis sed quas
                  ullam labore quidem consequatur dolore ipsa soluta numquam
                  deserunt earum, laboriosam repudiandae aliquid! Porro quidem,
                  ipsa quos, facere eaque voluptates non ullam dolorum explicabo
                  eius nam libero possimus voluptatem dolorem vero sint fugiat
                  magni inventore earum! Quia minima delectus obcaecati odit.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside
          className={`bg-gray-200 transition-all duration-300 ease-in-out h-full ${
            rightOpen ? "w-50" : "w-0"
          } overflow-hidden`}
        >
          <div className="h-full p-4">Right Sidebar</div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
