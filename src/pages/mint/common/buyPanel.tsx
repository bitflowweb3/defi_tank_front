import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography, Select, SelectChangeEvent, MenuItem } from "@mui/material";

import buyOption from "./buyOption.json";
import { tips } from "../../../utils/util";
import { useGlobalContext } from "../../../provider";
import { ActionLoadingButton1 } from "../../../components/buttons";

interface ParamObject {
  item: ClassesObject
  onClose: any
}

export const BuyPanel = ({ item, onClose }: ParamObject) => {
  const [state, { mintNFT }] = useGlobalContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [paymentToken, setPaymentToken] = useState<any>(buyOption[0])

  const price = useMemo(() => {
    let dftlPrice = item?.price ? item?.price : 0;
    return dftlPrice * paymentToken.price / 1000000
  }, [paymentToken, item])

  const handleChange = (event: SelectChangeEvent) => {
    let paymentToken = buyOption.find((partnerInfo) => (
      partnerInfo.project === event.target.value
    ))

    setPaymentToken(paymentToken);
  }

  const handleBuy = async () => {
    try {
      setLoading(true)
      let tx = await mintNFT(item?.id, item?.price)
      await tx.wait()

      onClose()
      tips("success", tx.hash)

      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log("error", err.message);

      if (err.code === "ACTION_REJECTED") {
        tips("error", "User Denied ACTION")
      } else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        tips("error", "Please check DFTL Balance")
      } else {
        tips("error", err.message)
      }
    }
  }

  return (
    <Box sx={style} style={{ borderRadius: '12px' }}>
      <Stack spacing={2} justifyContent="center">
        <Row>
          <Typography> Name</Typography>
          <Typography> {item?.name}</Typography>
        </Row>

        <Row>
          <Typography>Payment</Typography>
          <Select onChange={handleChange}
            value={paymentToken.project}
            labelId="demo-simple-select-standard-label"
          >
            {buyOption.map(token => (
              <MenuItem value={token.project}>{token.project}</MenuItem>
            ))}
          </Select>
        </Row>

        <Row>
          <Typography>Price ({paymentToken?.project})</Typography>
          <Typography>{price}</Typography>
        </Row>

        <ActionLoadingButton1 loading={loading} onClick={handleBuy}>
          Buy
        </ActionLoadingButton1>
      </Stack>
    </Box>
  )
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "230px", sm: "300px", md: "300px" },
  bgcolor: "#060200",
  border: "2px solid background.paper",
  boxShadow: "0 3px 10px #000",
  p: 4,
  borderRadius: "5px",
  // height: "80%",
  overflow: "auto",
  bordreRadius: '10px'
}

const Row = styled((props: any) => (
  <Stack direction="row"
    justifyContent="space-between"
    alignItems="center"
    {...props}
  />
))(({ theme }) => ({
  paddingBottom: "7px"
}))