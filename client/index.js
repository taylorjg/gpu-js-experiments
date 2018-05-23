import { runBasicExample } from "./basicExample";
import { generateRandomCode } from "./mastermindCommon";
import { mastermindWithoutGpu } from "./mastermindWithoutGpu";
import { mastermindWithGpu } from "./mastermindWithGpu";

runBasicExample();

const secret = generateRandomCode();
mastermindWithoutGpu(secret);
mastermindWithGpu(secret);
