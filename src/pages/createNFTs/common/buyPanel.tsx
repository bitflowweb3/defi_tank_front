import { useMemo, useState } from "react";
import { Box, Stack, Typography, Select, SelectChangeEvent, MenuItem } from "@mui/material";

import buyOption from "./buyOption.json";
import { tips } from "../../../utils/util";
import { useGlobalContext } from "../../../provider";
import { ActionLoadingButton1 } from "../../../components/buttons";

interface ParamObject {
  item: TankClassObject
  onClose: any
}

export const BuyPanel = ({ item, onClose }: ParamObject) => {
  const [state, { mintTank }] = useGlobalContext()
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
      setLoading(true);
      let tx = await mintTank(item?.id, item?.price);

      await tx.wait();
      tips("success", (tx.hash)?.slice(0, 5) + "..." + (tx.hash)?.slice(-5));
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      console.log("error", err.message);

      if (err.code === "ACTION_REJECTED") {
        tips("error", "User Denied ACTION");
      } else if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
        tips("error", "Please check DFTL Balance");
      } else {
        tips("error", "NFT Buy failed!");
      }
    }
  }

  return (
    <Box sx={style} style={{ borderRadius: '12px' }}>
      <Stack spacing={2} gap={1} justifyContent="center">
        <div className="flex flex-row gap-10 justify-between items-center">
          <Typography> Name</Typography>
          <Typography> {item?.name}</Typography>
        </div>

        <div className="flex flex-row gap-10 justify-between items-center">
          <Typography>Payment</Typography>
          <Select onChange={handleChange}
            value={paymentToken.project}
            labelId="demo-simple-select-standard-label"
          >
            {buyOption.map((token, key: number) => (
              <MenuItem value={token.project} key={key}>
                {token.project}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-row gap-10 justify-between items-center">
          <Typography>Price ({paymentToken?.project})</Typography>
          <Typography>{price}</Typography>
        </div>

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