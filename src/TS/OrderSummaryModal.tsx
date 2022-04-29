import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useUpdatePositionMutation } from '../app/services/MarketBuddy'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import { useUpdatePositionMutation } from '../app/services/MarketBuddy';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface OrderSummaryModalProps {
    symbol: string,
    transactionType: string,
    transactionDetails: any
    position: any,
    cost: number
}

function OrderSummaryModal({ symbol, transactionType, transactionDetails, position, cost }: OrderSummaryModalProps) {
    const [open, setOpen] = useState(false);
    const { auth } = useSelector((state: any) => state)
    const [updatePosition] = useUpdatePositionMutation()
    const history = useHistory()
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // const [updatePostition] = useUpdatePositionMutation()

    const submitHandler = (e: any) => {
        e.preventDefault()
        updatePosition({id: auth.user, positionId: position._id, updatedPosition: {adjustment: Number(transactionDetails.shares), price: -Math.abs(cost)}})
        history.push("/home")
    }

    return (
        <div>
            <span style={{cursor: "pointer"}} onClick={handleOpen}>Review Order</span>
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
                            You’re placing an order to {transactionType} {transactionDetails.s} share of {symbol} that will be converted to a limit order with a 5% collar. If your order cannot be executed within the collar, it won’t be filled. Your order will be placed after the market opens
                        </Typography>
                        <button type='submit'>Place order</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default OrderSummaryModal;