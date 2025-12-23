import React, { useCallback, useContext, useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Collapse, IconButton, Typography, useTheme, Box, CircularProgress, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Toolbar,
    Container
} from '@mui/material';
import { Edit, Delete } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api from '../../axiosConfig';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppContext } from '../../AppProvider';

const AddDiamondBundle = () => {
    const {AddNotif, setPopUpContent} = useContext(AppContext);
    const [diamondBundle, setDiamondBundle] = useState([]);
    const [isLoaalLoading, setLocalLoadingCondition] = useState(true); 
    const [open, setOpen] = useState(false);
    const [addDiamond, setAddDiamond] = useState(false);
    const [removeDiamond, setRemoveDiamond] = useState(false);
    const theme = useTheme();
    const [formData, setFormData] = useState({
        bundle_name: '',
        price: '',
        quantity: '',
      });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }; 

    const GetMainDataFromApi = useCallback(async () => {
        setLocalLoadingCondition(true);
        try {
            const response = await api.get('api/get-diamonds-bundle');
            setDiamondBundle(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLocalLoadingCondition(false);
        }
    }, []);
    
    useEffect(() => {
        GetMainDataFromApi();
    }, [GetMainDataFromApi]);

    const handleToggle = () => {
        setOpen(!open);

        if (!open === false) {
            cancelHandle();
        }
    };

    const addDiamondHandle = () => {
        setOpen(true);
        setAddDiamond(true);
    };

    const removeDiamondHandle = () => {
        setOpen(true);
        setRemoveDiamond(true);
    };

    const cancelHandle= () => {
        setAddDiamond(false);
        setRemoveDiamond(false);
        setFormData({bundle_name: '', price: '', quantity: ''});
    }

    const handlePost = async (event) => {
        event.preventDefault();
        try {
            setLocalLoadingCondition(true);
            const response = await api.post('api/add-diamond-bundle/ ', formData);
            setDiamondBundle([...diamondBundle, response.data]);
            setFormData({ bundle_name: '', price: '', quantity: null });
            GetMainDataFromApi();
            setAddDiamond(false);
            AddNotif("Berhasil menambah bundle", true);
        } catch (error) {
            AddNotif(`Error saat mengirim data: ${error}`, false);
        }
        setLocalLoadingCondition(false);
    };

    const handleDelete = async (id) => {
        setLocalLoadingCondition(true);
        try {
            await api.delete(`api/delete-diamonds-bundle/?id=${id}`);
            GetMainDataFromApi();
            setRemoveDiamond(false);
            AddNotif("Berhasil menghapus bundle", true);
        } catch (error) {
            AddNotif(`Gagal menghapus bundle, error: ${error}`, true);
        }
        setLocalLoadingCondition(false);
    }

    const DeletePopUp = (data) => {
        setPopUpContent([{data:data, content_name:"DeleteConfirm"}, handleDelete])
    }

    if (isLoaalLoading) {
        return(
            <>
                <CircularProgress />
            </>
        )
    }

    return (
        <Container maxWidth='xl'  sx={{display: 'flex', alignItems: 'center' }}>
            <List sx={{ width: '100%' }}>
                <ListItem
                    onClick={handleToggle}
                    button='true'
                    sx={{ borderBottom: '0.1rem solid black' }}
                >
                    <ListItemText primary="Selled Diamond Bundles" />
                    <Box>
                        <Typography color={theme.palette.text.dark}>
                            {diamondBundle.length}
                        </Typography>
                    </Box>
                    <IconButton>
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 1rem',
                                backgroundColor: theme.palette.background.default,
                            }}
                        >
                            <Typography sx={{ flex: 0.5, textAlign: 'center' }}>No.</Typography>
                            <Typography sx={{ flex: 1, textAlign: 'center' }}>Item Name</Typography>
                            <Typography sx={{ flex: 1, textAlign: 'center' }}>Price</Typography>
                            <Typography sx={{ flex: 1, textAlign: 'center' }}>Quantity</Typography>
                            {removeDiamond && <Typography sx={{ flex: 0.2, textAlign: 'center' }}>Delete</Typography>}
                        </ListItem>
                        {addDiamond && (
                            <form onSubmit={handlePost}>
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.8rem',
                                        backgroundColor: 'background.default2',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    <Typography sx={{ flex: 0.5, textAlign: 'center' }}>{diamondBundle.length + 1}.</Typography>
                                    <TextField
                                        name="bundle_name"
                                        value={formData.bundle_name || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        required
                                        variant="filled"
                                        size="small"
                                        slotProps={{
                                            input: { sx: { height: '2.4rem' } },
                                        }}
                                        sx={{ flex: 1, marginRight: '0.2rem' }}
                                    />
                                    <TextField
                                        name="price"
                                        value={formData.price || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        required
                                        variant="filled"
                                        size="small"
                                        slotProps={{
                                            input: { sx: { height: '2.4rem' } },
                                        }}
                                        sx={{ flex: 1, marginRight: '0.2rem' }}
                                    />
                                    <TextField
                                        name="quantity"
                                        value={formData.quantity || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        required
                                        variant="filled"
                                        size="small"
                                        slotProps={{
                                            input: { sx: { height: '2.4rem' } },
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type='submit'
                                        sx={{
                                            marginLeft: '0.5rem',
                                            height: '2.4rem',
                                            textTransform: 'none', 
                                        }}
                                    >
                                        Post
                                    </Button>
                                </ListItem>
                            </form>
                        )}
                        {diamondBundle &&
                            diamondBundle.map((item, index) => (
                                <List component="div" disablePadding key={index}>
                                    <ListItem
                                        button='true'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 1rem',
                                        }}
                                    >
                                        <Typography sx={{ flex: 0.5, textAlign: 'center' }}>{index + 1}.</Typography>
                                        <Typography sx={{ flex: 1, textAlign: 'center' }}>{item.bundle_name}</Typography>
                                        <Typography sx={{ flex: 1, textAlign: 'center' }}>Rp.{item.price}</Typography>
                                        <Typography sx={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Typography>
                                        { removeDiamond && <IconButton  sx={{ flex: 0.2, textAlign: 'center' }} onClick={() => DeletePopUp(item)}>
                                            <Delete sx={{color: theme.palette.error.main}} />
                                        </IconButton>}
                                    </ListItem>
                                </List>
                            ))}
                    </List>
                </Collapse>
                {(addDiamond || removeDiamond) && <Button variant='contained' sx={{mt: 2}} onClick={cancelHandle}>Batal</Button>}
            </List>

            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {!(addDiamond || removeDiamond) &&
                 <>
                    <IconButton sx={{ color: theme.palette.text.dark}} onClick={addDiamondHandle}>
                        <Edit />
                    </IconButton>
                    <IconButton sx={{color: theme.palette.text.dark}} onClick={removeDiamondHandle}>
                        <Delete />
                    </IconButton>
                 </>}
            </Box>
        </Container>
    )
}

const TransactionsSection = () => { 
    const [transactions, setTransactions] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const theme = useTheme();

    const getDataTransaction = async () => {
        setLocalLoading(true);
        try {
            const response = await api.get('payment-gateway/get-transactions/');
            setTransactions(response.data);
            setFilteredTransactions(response.data);
        } catch (err) {
            console.log(err);
        }
        setLocalLoading(false);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = transactions.filter((transaction) => 
            transaction.order_id.toLowerCase().includes(query) ||
            transaction.product_name.toLowerCase().includes(query) ||
            transaction.customer_name.toLowerCase().includes(query)
        );
        setFilteredTransactions(filteredData);
    };

    useEffect(() => {
        getDataTransaction();
    }, []);

    return (
        <Container maxWidth='xl'>
            <Typography variant="h6" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
                Transactions Table
            </Typography>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.background.default, 
                    boxShadow: 3 
                }}
            >
                <IconButton 
                    variant="contained" 
                    onClick={getDataTransaction} 
                    sx={{
                        color: theme.palette.text.primary, 
                        '&:hover': { 
                            color: theme.palette.primary.main, 
                            transform: 'scale(1.1)' 
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <RefreshIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField 
                        size="small" 
                        placeholder="Search by Order ID, Product Name, or Customer Name..." 
                        value={searchQuery}
                        onChange={handleSearch}
                        sx={{
                            '& .MuiInputBase-root': { 
                                borderRadius: 50, 
                                backgroundColor: theme.palette.background.default, 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                                pr: 2 
                            }
                        }} 
                    />
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{bgcolor: theme.palette.background.default}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Gross Amount</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Transaction Status</TableCell>
                            <TableCell>Payment Type</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!localLoading ? filteredTransactions.map((transaction, index) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{transaction.order_id}</TableCell>
                                <TableCell>{transaction.product_name}</TableCell>
                                <TableCell>Rp.{transaction.gross_amount}</TableCell>
                                <TableCell>{transaction.quantity}</TableCell>
                                <TableCell>{transaction.customer_name}</TableCell>
                                <TableCell>{transaction.transaction_status}</TableCell>
                                <TableCell>{transaction.payment_type}</TableCell>
                                <TableCell>
                                    {new Date(transaction.created_at).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        )):(
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

const DiamondHandle = () => {
    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
            <Toolbar sx={{display: {xs: 'block', md: 'none'}}}/>
            <Box>
                <AddDiamondBundle />
            </Box>
                <br />
                <br />
            <Box>
                <TransactionsSection />
            </Box>
        </Box>
    );
}

export default DiamondHandle;