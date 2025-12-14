import type { IProjectDetails, ParentAccountDetails } from "@/api/types/common"
import type { SOCKET_DATA_TYPES } from "@/constants"
import type { ValueOf } from "next/dist/shared/lib/constants"
import { ReactNode } from "react"

import type { Slug } from "./nextTypes"

export type UserDetail = {
  user: {
    id: number
    version: string
    fullName: string
    name: string
    surname: string
    email: string
    credit: number | string
    phone: string | null
    phone2: string | null
    fax: string | null
    address: string | null
    oldUsername: string
    oldPassword: string
    lastLoginDate: string | null
    parentAccountId: string
    pricingSchemeId: string
    tempAccess: boolean
    tempDate: string | null
    paymentTypeId: string
    paymentCurrencyId: string
    lastPasswordChangeDate: string | null
    isEmailRecipient: string
    active: string
    ssoId: string
    createdOn: string | null
    lastModifiedOn: string | null
    externalId: string | null
    distributor: ISelectWithSearch
    pricing: ISelectWithSearch
    language: ISelectWithSearch
    languageId: number | null
    language: ISelectWithSearch
    accountId: number | null
    accountName: string
    distributorId: number | null
    tempDate: string | null
    tempAccess: boolean
    creatorId: number | null
    lastModifierId: number | null
    organizationName: string | null
    showOnReport: boolean
    salesforceId: string | null
    logoOnReport: boolean
    isAgreedTermOfUse: boolean
    basicInfoOnly: boolean
    firstLastName: boolean
    isTpProject: boolean
    role: Role
    notificationCount: number
    amount: string | number | null
    freeCredit: number
    defaultLang: ISelectWithSearch
    parentAccount: ParentAccountDetails
    pendingReqFreeCredits: number
    pendingReqRegularCredits: number
  }
  additionalData: {
    id: string
    lastName: string
    firstName: string
    salutation: string
    name: string
    mailingStreet: string
    email: string
    title: string
    department: any
    certifications: ISelectWithSearch[]
    region: string
    countryCode: string
    eQMiniDescription: any
    language: ISelectWithSearch[]
    mapAddress: any
    certUsage: string
    additionalNeedsAndNotes: any
    mailingCountry: string
    allyMembership: boolean
    certProfilePhotoURL: string
    company: string
    country: string
    state: any
    certProfileVisibility: string
    certRole: string
    referrerFirstName: any
    certProfileURL: any
    certMiniBio: string
    certLinkedInURL: string
    certAllowEmailContact: boolean
    certCognitoExists: boolean
    certWalletURL: string
    certSsoUuid: string
    certKeywords: string
    certRenewalAdmin: string
    certStatus: string | null
    certRenewalDate: string
    certMapAddress: string
    certCorrectionsRequested: any
    certBio: string
    certLanguages: string
    certAreasOfWork: ISelectWithSearch[]
    certMembership: string
    latitude: string
    certCurrentAceUnits: number
    certReach: any
    certOfferToHelp: string
    certNetworkLeaderInterest: string
    certEQCoachingHours: number
    certICFStatus: string
    certProfileLastConfirmed: string
    longitude: string
    peopleSupport: number
    donation: any
    certLanguageId: string
    certLastLogin: string
    thiAcCredibleCertifications: string
    thiCancelCertifications: boolean
    thiCertExpiry: string
    thiCourseIncomplete: any
    thiIncompleteCertCount: any
    thiCertStatus: string
    userprofile: string
    interFaceLang: string
    uiInterFaceLang: string
  }
  permissions: UserPermissions
}

export type UserPermissions = {
  options: {
    canSearchReceivedRequest: boolean
    canApproveCreditTransfer: boolean
    canViewEditProjects: boolean
    canCreateNewEditProfilers: boolean
    canViewPeopleTracker: boolean
    canDownloadFastData: boolean
    canDownloadFullData: boolean
    canEditResources: boolean
    canManageAdminFunctions: boolean
    canViewEditProjectsMasterAccess: boolean
    canViewManageReportsMasterAccess: boolean
    canCreateNewEditProfilersMasterAccess: boolean
    canCreateNewEditCoachesReferentsMasterAccess: boolean
    canViewPeopleTrackerMasterAccess: boolean
    canViewTransactionCreditHistoryMasterAccess: boolean
    canOverrideInconsistentBlock: boolean
    canDownloadSimpleList: boolean
    canAddEditDistributorMasterAccess: boolean
    canApproveFreeProject: boolean
    canGrantRefunds: boolean
    canApproveExtendFreeProjects: boolean
    canEditProjectOwner: boolean
    canMasterAddRemoveCredits: boolean
  }
  routes: {
    canViewManageReports: boolean
    canViewTransactionCreditHistory: boolean
    canViewConfigReport: boolean
    // canViewConfigArea: boolean
    canEditNorms: boolean
    addEditPricing: boolean
    canEditLangAndTrans: boolean
    canEditEmailTemplates: boolean
    canEditItemsTemplates: boolean
    canEditAssessmentEditor: boolean
    canCreateNewEditCoachesReferents: boolean
    canAddEditDistributor: boolean
    canSeiProjects: boolean
    canSeiGroup: boolean
    canYvProject: boolean
    canYvGroup: boolean
    canProject360: boolean
    canTvsProject: boolean
    canOvsProject: boolean
    canEvsProject: boolean
    canLvsProject: boolean
  }
}

export type Token = {
  accessToken: string
}

export type Role = "Master" | "Distributor" | "Coach" | "Referent"
export type ProjectType =
  | "SEI_ADULT"
  | "SEI_YOUTH"
  | "SEI_360"
  | "VS_LVS"
  | "VS_OVS"
  | "VS_TVS"
  | "BOOK"
  | "SEI_PROFILER"
  | "SEI_PROFILER_YV"
  | "SEI_ADULT_V4"
  | "SEI_PROFILER_V4"
  | "SEI_P_YOUTH"
  | "SEI_ADULT_NUS"
  | "SEQ_ADULT"
  | "SEI_TSI"

export type PaginationData = {
  currentPage: number
  firstPageUrl: string
  from: number
  lastPage: number
  lastPageUrl: string
  nextPageUrl: string
  path: string
  // perPage: number
  prevPageUrl: string | null
  to: number
  total: number
}

// interfaces definition
export interface IChildrenProps {
  children: ReactNode
}
export interface ISelectWithSearch {
  id?: number | string | null
  value: string | number
  label: string
}

export interface ITableBaseState<T> {
  pagination?: PaginationData
  rows?: T[]
  selectAllTableEntries?: boolean
  pagination?: PaginationData
  filters?: Filters
}

export type DateRange = {
  startDate: Date | string
  endDate: Date | string
  key: string
}

export type t = (e: string) => string

export type Filters = {
  page?: number
  search?: string | Slug
  pagePerItm?: number
  date?: DateRange[]
  flag1?: boolean
  selectFilter?: ISelectWithSearch
  isSelectedAll?: boolean
  selectedAll?: number[]
  [key: string]: any
}

export interface GeneratedReportDetails {
  type?: ValueOf<typeof SOCKET_DATA_TYPES>
  projectId: number
  projectDetails?: IProjectDetails
  status: boolean
  isError: boolean
  reports: {
    id: string
    version: string
    filePath: string
    reportName: string
    reportTypeId: string
  }[]
}
