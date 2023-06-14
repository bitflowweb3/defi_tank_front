import React from "react";
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Grid, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { restApi } from "provider/restApi";
import { useGlobalContext } from "provider";
import { ActionButton2 } from "components/buttons";
import { ellipsis, textCopy, tips } from "utils/util";
import { Layouts } from "components/layouts/layouts";

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

export const ReferralPage = () => {
  const [state] = useGlobalContext();
  const [requestUpdate, setRequestUpdate] = useState(0)
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
    (async () => {
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

        setTimeout(() => {
          setRequestUpdate(requestUpdate + 1)
        }, 5000)
      } else {
        updateStatus({
          error: "Could not found referral data",
          referralCode: "",
          referrer: "",
          referralReward: 0,
          referrallers: []
        })
      }
    })()
  }, [state.account, requestUpdate])


  const getReward = async () => {
    const res = await restApi.claimReward(state.account)

    if (res.status !== 200) {
      tips("error", "Claim request failed")
    } else {
      tips("success", "Claim request success")
    }
  }

  const copyRefCode = () => {
    textCopy("https://app.defitankland.com/refcode/" + status.referralCode);
  }

  return (
    <Layouts>
      <div className="flex flex-row items-center">
        <div style={{
          width: 'auto',
          padding: '1rem',
          minWidth: "200px",
          borderRadius: '12px',
          margin: '0 2rem 0 0',
          backgroundColor: '#060200b5',
          border: '0px solid #f55b00',
        }}>
          <h2 style={{ color: 'white', margin: '10px' }}>
            Referral code
          </h2>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: '10px' }}>
              {status.referralCode ? (
                ellipsis(status.referralCode, 10)
              ) : (
                <Link to="/my-tanks"
                  style={{
                    textDecoration: 'none',
                    color: '#f2fff2',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    backgroundColor: '#f55b00'
                  }}>
                  Create profile
                </Link>
              )}
            </h3>

            {status.referralCode && (
              <div onClick={copyRefCode}>
                <ContentCopyIcon style={{
                  color: 'white',
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{
          width: 'auto',
          padding: '1rem',
          minWidth: "200px",
          margin: '0 2rem 0 0',
          borderRadius: '12px',
          backgroundColor: '#060200b5',
          border: '0px solid #f55b00',
        }}>
          <h2 style={{ color: 'white', margin: '10px' }}>Referrer</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: '10px' }}>
              {status.referrer ? (
                ellipsis(status.referrer, 10)
              ) : (
                <span style={{ color: 'white' }}>No referrer</span>
              )}
            </h3>

            {status.referrer && (
              <div onClick={() => { textCopy(status.referrer) }}>
                <ContentCopyIcon style={{ color: 'white', cursor: 'pointer', marginLeft: '1rem' }} />
              </div>
            )}
          </div>
        </div>

        <div style={{
          width: 'auto',
          padding: '1rem',
          minWidth: "200px",
          margin: '0 2rem 0 0',
          borderRadius: '12px',
          backgroundColor: '#060200b5',
          border: '0px solid #f55b00',
        }}>
          <h2 style={{ color: 'white', margin: '10px' }}>
            Reward Amount
          </h2>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: '10px' }}>
              {status.referralReward || 0} DFTL
            </h3>

            {status.referralReward > 0 && (
              <div>
                <ActionButton2 onClick={getReward}
                  style={{ marginLeft: '1rem' }}
                >
                  Claim
                </ActionButton2>
              </div>
            )}
          </div>
        </div>
      </div>

      <br />

      <h1 className="text-white my-20">
        Referees : {status.referrallers.length}
      </h1>

      <br />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Search"
            variant="outlined"
            value={status.filter}
            onChange={(e: any) => updateStatus({ filter: e.target.value })}
            sx={{
              width: "100%",
              background: "#00000075",
              borderRadius: '5px'
            }}
          />
        </Grid>
      </Grid>

      <br />

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.address}
          rowsPerPageOptions={[10]}
          rowHeight={70}
          style={{
            backgroundColor: '#00000094',
            borderRadius: '10px'
          }}
        />
      </Box>
    </Layouts>
  )
}
