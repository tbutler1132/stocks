import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useUpdatePositionMutation, useCreatePositionMutation } from '../app/services/MarketBuddy'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button'
import { useGetUserQuery } from "../app/services/MarketBuddy";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/CloseIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: "white",
    backgroundColor: "black",
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface OrderSummaryModalProps {
    symbol: string,
    transactionType: string,
    transactionDetails: any
    positionId: string,
    cost: number
}

function OrderSummaryModal({ symbol, transactionType, transactionDetails, positionId, cost }: OrderSummaryModalProps) {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { auth } = useSelector((state: any) => state)
    const [updatePosition, results] = useUpdatePositionMutation()
    const [createPosition] = useCreatePositionMutation()
    const history = useHistory()
    const { shares } = transactionDetails 
    const { data: currentUser, isLoading: currentUserIsLoading } = useGetUserQuery(auth.user)
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const submitHandler = (e: any) => {
        e.preventDefault()
        
        if(Math.abs(cost) > currentUser.cash && transactionType === "Buy"){
            if(transactionType === "Buy"){
                alert("You don't have the necessary funds to make this transaction")
                return
            }
        }
        if(positionId){
            updatePosition({
                id: auth.user, 
                positionId: positionId, 
                updatedPosition: 
                    {
                        adjustment: transactionType === "Buy" ? Number(shares) : -Math.abs(Number(shares)), 
                        price: cost
                    }
            })
            .then((payload: any) => {
                if(payload.error){
                    setSnackbarOpen(true)
                    setOpen(false)
                    return
                }else{
                    history.push("/home")
                }
            })
            .catch((error) => console.error('rejected', error))
        }else{
            createPosition({
                id: auth.user,
                newPosition:
                {
                    ticker: symbol.toUpperCase(),
                    shares: Number(shares),
                    cost: cost
                }
            })
        }
    }

    const handleSnackbarClose = (event: any) => {
        console.log("HIt")
        setSnackbarOpen(false);
      };

    const action = (
        <>
          <Button color="secondary" size="small" onClick={handleSnackbarClose}>
            UNDO
          </Button>
          <Button
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            Close
          </Button>
        </>
      );

    return (
        <div className='order-summary-container'>
            <div className="order-summary-button">
                <Button variant='outlined' color='warning' style={{cursor: "pointer"}} onClick={handleOpen}>Review Order</Button>
            </div>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={submitHandler}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Order Summary
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            You're placing an order to {transactionType} {transactionDetails.s} share of {symbol} that will be converted to a limit order with a 5% collar. If your order cannot be executed within the collar, it won’t be filled. Your order will be placed after the market opens
                        </Typography>
                        <Button variant='contained' type='submit'>Place order</Button>
                    </form>
                </Box>
            </Modal>
            <Snackbar
            open={snackbarOpen}
            autoHideDuration={2500}
            onClose={handleSnackbarClose}
            message="Error"
            action={action}
            />
        </div>
    );
}

export default OrderSummaryModal;