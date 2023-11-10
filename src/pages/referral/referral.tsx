import React from "react";
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Grid, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCallback, useMemo, useEffect } from 'react';

import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { ActionButton2 } from "components/buttons";
import { textEllipsis, textCopy, tips, toLanguageFormat } from "utils/util";
import { GlobalSpacing, Layouts } from "components/layouts/layouts";
import { config } from "config/config";
import { apiNotification } from "utils/services";

interface StatusObject {
  referralCode: string
  referrer: string
  referrallers: Array<string>
  referralReward: number
  filter: string
  error: string
}

const initStatus = {
  referralCode: "",
  referrer: "",
  referrallers: [],
  referralReward: 0,
  filter: "",
  error: ""
}

const ReferralPage = () => {
  const [state] = useGlobalContext();
  const [status, setStatus] = React.useState<StatusObject>(initStatus)

  const updateStatus = (params: { [key: string]: any }) => (
    setStatus({ ...status, ...params })
  )

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      headerAlign: "center",
      align: "center",
      sortable: false,
      minWidth: 130,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt=""
          sx={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: '5px'
          }}
        ></Box>
      )
    }, {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1 / 2,
    }, {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 1,
    }
  ]

  const RowsFilter = useCallback((item: any) => {
    const searchParams = ["name", "address"]

    return searchParams.some((newItem) => {
      try {
        const flag = item[newItem].toLowerCase().indexOf(status.filter.toLowerCase().trim())
        return flag > -1
      } catch (err) {
        return false
      }
    })
  }, [status.filter])

  const rows = useMemo(() => {
    if (status.referrallers && status.referrallers.length > 0) {
      return status.referrallers.sort((a: any, b: any) => (
        a.merit < b.merit ? 1 : -1
      )).map((item: any, index: number) => (
        { ...item, rank: index + 1 }
      )).filter(RowsFilter)
    } else {
      return []
    }
  }, [status.referrallers, status.filter])

  useEffect(() => {
    getReferrals();
    if (!state.account) return;

    let interval = setInterval(() => {
      getReferrals();
    }, 5000)

    return () => { clearInterval(interval) }
  }, [state.account])

  const getReferrals = async () => {
    if (state.account) {
      const tempAddr = state.account || ""
      const result = await restApi.getReferralData(tempAddr)

      if (!!result && Object.keys(result).length) {
        const referrers = await restApi.getReferrerInfo(result?.referrallers)

        updateStatus({
          referralCode: result?.referralCode,
          referrer: result?.referrer,
          referralReward: result?.referralReward,
          referrallers: referrers
        })
      } else {
        updateStatus({
          error: "Could not found referral data",
          referralCode: "",
          referrer: "",
          referralReward: 0,
          referrallers: []
        })
      }
    } else {
      updateStatus({
        error: "Could not found referral data",
        referralCode: "",
        referrer: "",
        referralReward: 0,
        referrallers: []
      })
    }
  }

  const getReward = async () => {
    try {
      await restApi.claimReward(state.account);
      await getReferrals();
      tips("success", "Claim request success");
    } catch (err) {
      apiNotification(err, "Claim request failed");
    }
  }

  const copyRefCode = () => {
    textCopy(config.FRONTEND_URL + '/refcode/' + status.referralCode);
  }

  return (
    <Layouts>
      <GlobalSpacing className="flex flex-col gap-10">
        <h1 className="text-white">
          Referees : {status.referrallers.length}
        </h1>

        <div className="flex flex-row gap-10 items-center flex-wrap">
          <div className="flex flex-col gap-10 sm:min-w-200 w-full sm:w-auto px-25 py-25 rounded-12 bg-boxBg">
            <h2 className="text-white">Referral code</h2>

            <div className="flex gap-5 items-center">
              <h3 className="text-white">
                {status.referralCode && (
                  textEllipsis(status.referralCode, 10)
                )}

                {(!status.referralCode && state.walletStatus === 2) && (
                  <Link to="/profile" className="px-20 py-10 rounded-6 bg-btnBg text-white no-underline">
                    Create profile
                  </Link>
                )}
              </h3>

              {status.referralCode && (
                <div onClick={copyRefCode}>
                  <ContentCopyIcon className="text-white cursor-pointer" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:min-w-200 w-full sm:w-auto px-25 py-25 rounded-12 bg-boxBg">
            <h2 className="text-white">Referrer</h2>

            <div className="flex items-center">
              <h3 className="text-white">
                {status.referrer ? (
                  textEllipsis(status.referrer, 10)
                ) : (
                  <span>No referrer</span>
                )}
              </h3>

              {status.referrer && (
                <div onClick={() => { textCopy(status.referrer) }}>
                  <ContentCopyIcon className="text-white cursor-pointer" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:min-w-200 w-full sm:w-auto px-25 py-25 rounded-12 bg-boxBg">
            <h2 className="text-white">Reward Amount</h2>

            <div className="flex items-center gap-15 flex-wrap">
              <h3 className="text-white">
                {toLanguageFormat(status.referralReward)} DFTL
              </h3>

              {status.referralReward > 0 && (
                <div className="flex flex-row">
                  <ActionButton2 onClick={getReward} className="cursor-pointer">
                    Claim
                  </ActionButton2>
                </div>
              )}
            </div>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Search"
              variant="outlined" value={status.filter}
              className="w-full bg-inputBg rounded-5"
              onChange={(e: any) => updateStatus({ filter: e.target.value })}
              style={{background: 'rgba(31,31,31,0.9)'}}
            />
          </Grid>
        </Grid>

        <div className="h-600 w-full">
          <DataGrid rows={rows}
            pageSize={10} columns={columns}
            getRowId={(row) => row.address}
            rowHeight={70} rowsPerPageOptions={[10]}
            style={{ borderRadius: '10px', backgroundColor: 'rgba(31,31,31,0.9)' }}
          />
        </div>
      </GlobalSpacing>
    </Layouts>
  )
}

export { ReferralPage }