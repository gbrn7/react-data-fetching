"use client";

import {
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
  useFetchProducts,
} from "@/features/product";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";

//chakra ui -> css framework
//formik ->handle forms
//yup -> validate
//axios -> API calls
//react-query/tanstack -> Running API call (caching, state dll)

// Dry -> Do not repest yourself
export default function Home() {
  const {
    data,
    isLoading: productsIsLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: () => {
      toast({
        title: "Ada Kesalahaan terjadi",
        status: "error",
      });
    },
  });

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      id: 0,
    },
    onSubmit: () => {
      const { name, price, description, image, id } = formik.values;

      if (id) {
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        });

        toast({
          title: "Product edited",
          status: "success",
        });
      } else {
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        formik.setFieldValue("name", "");
        formik.setFieldValue("price", 0);
        formik.setFieldValue("description", "");
        formik.setFieldValue("image", "");
        formik.setFieldValue("id", 0);

        toast({
          title: "Product added",
          status: "success",
        });
      }
    },
  });

  const clearFields = () => {
    formik.setFieldValue("name", "");
    formik.setFieldValue("price", 0);
    formik.setFieldValue("description", "");
    formik.setFieldValue("image", "");
    formik.setFieldValue("id", 0);
  };

  const { mutate: editProduct, isLoading: editProductIsLoading } =
    useEditProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  const { mutate: createProduct, isLoading: createProductIsLoading } =
    useCreateProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("image", product.image);
  };

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const confirmastionDelete = (productId) => {
    const shouldDelete = confirm("Are you sure?");

    if (shouldDelete) {
      deleteProduct(productId);
      toast({
        title: "Deleted Product",
        status: "info",
      });
    }
  };

  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.name}</Td>
          <Td>{product.price}</Td>
          <Td>{product.description}</Td>
          <Td>
            <Button onClick={() => onEditClick(product)} colorScheme="cyan">
              Edit
            </Button>
          </Td>
          <Td>
            <Button
              onClick={() => confirmastionDelete(product.id)}
              colorScheme="red"
            >
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <main>
      <Container>
        <Heading color="blue.400">Products Page</Heading>
        <div>
          <Table variant="simple">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th isNumeric>Price</Th>
                <Th>Description</Th>
                <Th colSpan={2}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderProducts()}
              {productsIsLoading && <Spinner />}
            </Tbody>
          </Table>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Product Id</FormLabel>
              <Input
                onChange={handleFormInput}
                name="id"
                value={formik.values.id}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                onChange={handleFormInput}
                name="name"
                value={formik.values.name}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                onChange={handleFormInput}
                name="price"
                value={formik.values.price}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                onChange={handleFormInput}
                name="description"
                value={formik.values.description}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                onChange={handleFormInput}
                name="image"
                value={formik.values.image}
              ></Input>
            </FormControl>
            {createProductIsLoading || editProductIsLoading ? (
              <Spinner />
            ) : (
              <Button type="submit">Submit Product</Button>
            )}
          </VStack>
        </form>
      </Container>
    </main>
  );
}
