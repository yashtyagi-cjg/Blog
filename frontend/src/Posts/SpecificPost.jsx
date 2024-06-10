import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {Text, Container, Title, Loader, Modal, Input, Center, Button, Flex, TypographyStylesProvider, Group, Card, Divider} from '@mantine/core';
import {DateTime} from 'luxon'
import {IconEdit, IconTrash, IconChevronsLeft} from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom';
import { useDisclosure } from "@mantine/hooks";
import TextEditor from "../Components/TextEditor";


function SpecificPost(){

    //Post Data
    const [postData, setPostData] = useState('');
    let {postId} = useParams();


    //Storing heading and content for update operations
    const[heading, setHeading] = useState('');
    const [content, setContent] = useState('');
    
    // For tracking modal visibility and refresh status
    const [opened, handlers] = useDisclosure(false);
    const [refresh, setRefresh] = useState(false);

    const navigate = useNavigate();

    async function updatePost(){
        const data = {
            heading: heading,
            content: content,
            authorId: '665cb511ec01adca2d1d6763',
        }
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            )
            
            if(!response.ok){
                console.log(`HTTP ERROR: STATUS CODE ${response.status}`)
            }
            handlers.close();
            await setRefresh(!refresh);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`)
        .then(data=>data.json())
        .then(data=>{
            setPostData(data);
            setContent(data.content);
            setHeading(data.heading);
        })
        .catch((err)=>console.log(err));

        console.log(postData);
    }, [refresh])

    

    function handleDelete(){
        fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`,
            {
                method: 'DELETE'
            }
        ).then(()=>{
            navigate(`/dashboard`)
        }).catch((err)=>{
            console.log(err);
        })
    }


    //COMMENT FUNCTIONS, STATES, ETC

    const [commentData, setCommentData] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [refreshComments, setRefreshComments] = useState(true);

    //Fetching comments associated with this post
    useEffect(()=>{
        fetch(`${import.meta.env.VITE_API_URL}/comments/post/${postId}`)
        .then((data)=>data.json())
        .then((data)=>setCommentData(data))
        .catch((err)=>{
            console.log(err);
        })

        console.log('COMMENTS: ', commentData)
    }, [refreshComments])

    //Function to create comments
    async function createComment(){
        const data = {
            comment: commentContent,
            authorId: '665cb511ec01adca2d1d6763',
            postId: postId,
        }

        try
        {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
            )

            if(!response.ok){
                console.log('HTTP ERROR CODE: ' + response.status + response.statusText);
            }
            setRefreshComments(!refreshComments);
        }catch(err){
            console.log('ERROR: ',  err)
        }
    }

    //Function to delete comments
    async function deleteComment(commentId){
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}`,
                {
                    method: 'DELETE',
                }
            )

            if(!response.ok){
                console.log('HTTP ERROR CODE: ', response.status, response.statusText);
            }
            await setCommentContent('');
            await setRefreshComments(!refreshComments);
            
        }catch(err){
            console.log('ERROR while deleting', commentId, err)
        }
    }
    
    return (
        <>
            <Button variant='transparent' mb='sm' onClick={() => {
                navigate('/dashboard')
            }}>
                <IconChevronsLeft /> Back
            </Button>


            {!postData &&
                <Center>
                    <Loader />
                </Center>
            }


            {postData &&
                <Container>
                    <Title order={2}>{postData.heading}</Title>
                
                    <TypographyStylesProvider>
                        <div
                            dangerouslySetInnerHTML={{ __html: postData.content }}
                        />
                    </TypographyStylesProvider>
                    <Text size='xs' align='right'>
                        {DateTime.fromObject(postData.createdAt).toFormat('DD')}
                    </Text>
    
                    <Group display='flex' justify="space-around">
                        <Button size='xs' onClick={handlers.open} w='20%' variant="transparent">
                            <IconEdit />
                        </Button>
                        <Button size='xs' w='20%' variant="transparent"
                            onClick={handleDelete}>
                            <IconTrash />
                        </Button>
                    </Group>
                </Container>
            }


            <Modal opened={opened} onClose={handlers.close} title='Update Post' closeOnClickOutside={false} size='auto' centered>
                <h1 style={{ margin: 0 }}>
                    <Input
                        variant='unstyled'
                        size='lg'
                        radius='md'
                        ms='sm'
                        placeholder='Heading'
                        value={heading}
                        onChange={(event) => setHeading(event.currentTarget.value)}>
                    </Input>
                </h1>
                <TextEditor setContent={setContent} content={content} />
                <Center>
                    <Button variant='transparent' size='md' mt='sm' onClick={updatePost}>
                        Update Post
                    </Button>
                </Center>
            </Modal>
    
            <Divider label='Comments' labelPosition="center" size='md' my='md' />
    
            <Group justify='center'>
                <TextEditor content={commentContent} setContent={setCommentContent} />
                <Button variant='subtle' justify='center' size='sm' w='60%' onClick={()=>{
                        if(commentContent !== ''){
                            createComment();
                        }
                    }}>
                    Create
                </Button>
            </Group>
    
            <Flex align='center' direction='column' mt='md'>
                <Divider w='60%' mb='md' />
                {commentData && commentData.map((data) => (
                    <Card key={data._id} shadow="xs" padding='xs' ms='md' w='60%' mb='sm' radius='md' withBorder>
                        <TypographyStylesProvider size="sm" c="dimmed" mt='sm'>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.comment.comment }}
                            />
                        </TypographyStylesProvider>
    
                        <Flex justify='space-between' align='center' mt='sm' mb='sm'>
                            <Group>
                                <Text size='xs'>
                                    {DateTime.fromObject(data.createdAt).toFormat('DD')}
                                </Text>
                                <Button variant='subtle' size='xs'>
                                    {data.authorId.name}
                                </Button>
                            </Group>
    
                            <Group>
                                <Button variant='subtle' onClick={async () => { }}>
                                    <IconEdit />
                                </Button>
                                <Button variant='subtle' onClick={() => {deleteComment(data.comment._id)}}>
                                    <IconTrash color='#d76060' />
                                </Button>
                            </Group>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </>
    );
    
}


export default SpecificPost;