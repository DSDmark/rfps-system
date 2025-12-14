import urlcat from "urlcat";
import { request } from ".";

export const createRFPAPI = async (description: string) => {
  const res = await request({
    url: "/rfps/create",
    method: "POST",
    data: { description },
  });

  if (res.remote === "success") {
    return {
      remote: "success",
      data: res?.data,
    };
  }

  return res;
};

export const pollEmailAPI = async () => {
  return request({
    url: "/poll-email",
    method: "POST",
  });
};

export const getRFPProposalsAPI = async (rfpId: string) => {
  const res = await request({
    url: urlcat("/rfps/:id/proposals", { id: rfpId }),
    method: "GET",
  });

  if (res.remote === "success") {
    return {
      remote: "success",
      data: res?.data || [],
    };
  }

  return res;
};

export const getRFPsAPI = async () => {
  const res = await request({
    url: "/rfps",
    method: "GET",
  });

  if (res.remote === "success") {
    return {
      remote: "success" as const,
      data: res.data || [],
    };
  }

  return res;
};

export const getVendorsAPI = async () => {
  const res = await request({
    url: "/vendors",
    method: "GET",
  });

  if (res.remote === "success") {
    return {
      remote: "success" as const,
      data: res.data || [],
    };
  }

  return res;
};

export const getProposalsAPI = async () => {
  const res = await request({
    url: "/proposals",
    method: "GET",
  });

  if (res.remote === "success") {
    return {
      remote: "success" as const,
      data: res.data || [],
    };
  }

  return res;
};

export const getRFPByIdAPI = async (rfpId: string) => {
  const res = await request({
    url: urlcat("/rfps/:id", { id: rfpId }),
    method: "GET",
  });

  if (res.remote === "success") {
    return {
      remote: "success" as const,
      data: res.data?.data || null,
    };
  }

  return res;
};

export const sendRFPAPI = async (rfpId: string, vendorIds: string[]) => {
  const res = await request({
    url: urlcat("/rfps/:id/send", { id: rfpId }),
    method: "POST",
    data: { vendorIds },
  });

  return res;
};

export const createVendorAPI = async (payload: {
  name: string;
  email: string;
  contactInfo?: string;
}) => {
  const res = await request({
    url: "/vendors",
    method: "POST",
    data: payload,
  });

  return res;
};

export const deleteVendorAPI = async (vendorId: string) => {
  const res = await request({
    url: urlcat("/vendors/:id", { id: vendorId }),
    method: "DELETE",
  });

  return res;
};
