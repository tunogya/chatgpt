import {OpenAIStream} from "@/utils/OpenAIStream";
import {NextApiRequest} from "next";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextApiRequest): Promise<Response> => {
  const {prompt} = req.body;

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
    presence_penalty: 0, // Number between -2.0 and 2.0. The value of 0.0 is the default.
    max_tokens: 200,
    stream: true,
    n: 1,
    best_of: 1, // 1 is default
    user: '',
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;