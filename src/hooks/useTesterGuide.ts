import { useDispatch, useSelector } from "react-redux";
import type { TesterGuideDispatch, TesterGuideRootState } from "@/store/testerGuide";

export const useTesterGuideDispatch = useDispatch.withTypes<TesterGuideDispatch>();
export const useTesterGuideSelector = useSelector.withTypes<TesterGuideRootState>();
