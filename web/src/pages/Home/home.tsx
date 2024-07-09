import { LoginForm } from "./LoginForm";

export default function Example() {
    return (
        <div className={"flex h-screen w-screen justify-center items-center bg-[#ffffff]"}>
            <div className={"flex flex-row bg-custom-gray rounded-4xl"}>
                <div className={"flex flex-col justify-center p-5 pl-20  sm:w-[10rem] lg:w-[20rem]" }>
                    <div
                        className={"font-thin text-[2rem] text-white leading-[2.5rem] tracking-[2px] text-left"}>
                            Just wanted to say thank you. Helped me get my focus and my confidence back.
                    </div>
                    <div className={"mt-9 rounded-tr-[120px] rounded-br-[120px] bg-custom-blue rounded-tr-120 rounded-br-120"}>
                        <div className={"text-center font-normal text-white text-[8rem] font-alibaba leading-30 tracking-wide"}>
                            Z
                        </div>
                    </div>
                </div>
                <div className={"z-10 sm:w-[10rem] lg:w-[50rem] shadow-2xl lg:h-[40rem] transform translate-x-8 -translate-y-8  bg-white rounded-3xl"}>
                    <div className="h-full flex flex-col justify-center items-center">
                        <div>
                            <div className={"items-start font-alibaba text-[30px] font-light"}>Sign-in</div>
                            <LoginForm />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}