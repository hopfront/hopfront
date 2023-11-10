import {Problem} from "@/app/lib/dto/Problem";
import {NextResponse} from "next/server";

export const problemResponse = (problem: Problem): NextResponse<Problem> => {
    return NextResponse.json(problem, {
        status: problem.status
    })
}