import type { Response } from "express";

interface FileResponseOptions {
  type: "file";
  filename: string;
  mimeType: string;
  fileBuffer: Buffer;
}

interface JsonResponseOptions {
  type?: "json";
}

type ResponseOptions = FileResponseOptions | JsonResponseOptions;

export const sendResponseUtil = <T>(
  res: Response,
  status: number,
  message: string,
  data: T | null = null,
  opts: ResponseOptions = { type: "json" },
): Response => {
  if (opts.type === "file") {
    res.setHeader("Content-Type", opts.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${opts.filename}"`,
    );
    return res.status(status).send(opts.fileBuffer);
  }

  return res.status(status).json({
    status,
    message,
    data,
  });
};
