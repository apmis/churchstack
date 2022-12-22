import { useState } from 'react';
import {Stack,Box,Typography,Card,CardMedia,CardContent,CardActions,Paper,Grid} from '@mui/material'
import Input from '../../../../components/inputs/basic/Input'
import Product from './product'
import { productData} from './data'

export default function Products(){
    const [products] = useState(productData)
    const [searchFeild, setSearchFeild] = useState("");

    const filterProduct =
    products?.length > 0 &&
    products?.filter((data) => {
       if (searchFeild === "") {
          return data;
       } else if (data.name.toLowerCase().includes(searchFeild.toLowerCase())) {
          return data;
       }
    });

    return(
        <Stack  p="2rem">
            <Stack>
                <Typography variant="h6" color="text.secondary">MarketPlace</Typography>
            </Stack>
            <Box py="1.5rem" width="30%">
            <Input 
            type="search" 
            placeholder="Search..."
               onChange={(event) => setSearchFeild(event.target.value)}/>
            </Box>
            <Grid container gap={4}> 
            {filterProduct.map(product => (
            <Product product={product} key={product.id} />
          ))}
            </Grid>
        </Stack>
    )
}