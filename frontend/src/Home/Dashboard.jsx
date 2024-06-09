import {Card, Container, Text, Group, Button, Modal, SimpleGrid, Loader, Center, Flex, Input, TypographyStylesProvider } from '@mantine/core'
import { useEffect, useState} from 'react';
import {IconEdit, IconTrash, IconRefresh} from '@tabler/icons-react';
import {DateTime} from 'luxon';
import { useDisclosure } from '@mantine/hooks';
import TextEditor from '../Components/TextEditor';
import {useNavigate} from 'react-router-dom';


function Dashboard(){
    const navigate = useNavigate();

    //GET All post and refresh post
    const [postData, setpostData] = useState(null);
    const [refresh, setRefresh] = useState(false);

    //To toggle createPost Modal
    const [opened, handlers] = useDisclosure(false);

    //To Toggle editPost Modal
    const [editOpened, editHandlers] = useDisclosure(false);
    const [editPostId, setEditPostId] = useState('');

    //Storing values for post creation
    const [content, setContent] = useState('');
    const [heading, setHeading] = useState('');

   
    //Creating a new post
    async function createPost(){
        console.log("Content" + content)
        console.log("headign: " + heading)
        const data = {
            heading: heading,
            content: content,
            authorId: '665cb511ec01adca2d1d6763',
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            handlers.close();
            await setRefresh(!refresh);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }


    //Feteching post data based on postId to populate Update Post Modal
    async function fetchPostData(postId){   
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`)
            const data = await response.json();

            setHeading(data.heading);
            setContent(data.content);
        }catch(err){
            console.log(err);
        }
        
        
    }

    //Update the contentes of the post according to the modal
    async function updatePost(){
        const data = {
            heading: heading,
            content: content,
            authorId: '665cb511ec01adca2d1d6763',
        }
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
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
            editHandlers.close();
            await setRefresh(!refresh);
        }catch(err){
            console.log(err);
        }
    }

    //To delete a post using postId
    async function deletePost(postId){
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`,
                {
                    method: 'DELETE',

                })
            if(!response.ok){
                console.log(`Response not OK for DLETE ${response.status}`)
            }
            await setRefresh(!refresh);
        }catch(err){
            console.log(err);
        }
    }

    // To get specific Post
    function handleCardClick(postId){
        navigate(`/posts/${postId}`);
    }

    //Get All Posts upon loading
    useEffect(()=>{
        // console.log('Hello ' + import.meta.env.VITE_API_URL + '/posts')
        fetch(import.meta.env.VITE_API_URL + '/posts')
        .then(data=>data.json())
        .then(data=>setpostData(data))
        console.log(postData);
    }, [refresh])



    return (
        <>
            <Container size='responsive' mb='sm'>
                <Button variant='subtle' onClick={handlers.open} onClose={close} w='90%'> Create Post</Button>
                <Button w='10%' variant='subtle' onClick={()=>setRefresh(!refresh)}>
                    <IconRefresh me='sm'/>  Refresh
                </Button>
                
                <Modal opened={opened} onClose={handlers.close} title='Create Post' closeOnClickOutside={false}  size='auto' centered>
                    <h1 style={{margin: 0}}>
                        <Input 
                            variant='unstyled' 
                            size='lg' 
                            radius='md' 
                            ms='sm' 
                            placeholder='Heading'
                            value={heading}
                            onChange={(event)=>setHeading(event.currentTarget.value)}>
                            
                        </Input>
                    </h1>
                    <TextEditor setContent={setContent} content={content}/>
                    <Center>
                        <Button variant='transparent' size='md' mt='sm' onClick={createPost}> Create Post </Button>
                    </Center>
                    
                </Modal>

                <Modal opened={editOpened} onClose={editHandlers.close} title='Update Post' closeOnClickOutside={false}  size='auto' centered>
                    <h1 style={{margin: 0}}>
                            <Input 
                                variant='unstyled' 
                                size='lg' 
                                radius='md' 
                                ms='sm' 
                                placeholder='Heading'
                                value={heading}
                                onChange={(event)=>setHeading(event.currentTarget.value)}>
                                
                            </Input>
                        </h1>
                        <TextEditor setContent={setContent} content={content}/>
                        <Center>
                            <Button variant='transparent' size='md' mt='sm' onClick={()=>{
                                updatePost();
                                
                            }}> Update Post </Button>
                        </Center>
                </Modal>
            </Container>
            
            <SimpleGrid cols={1}>
                {!postData &&
                <Center>
                    <Loader color='blue'/>
                </Center>}
                {postData && postData.map((data)=>(
                    <Card key={data.postId} shadow="sm" padding='lg' radius='md' withBorder 
                    onClick={()=>{
                        handleCardClick(data.postId)}}>
                        <Text fw={500}>{data.heading}</Text>
                        <TypographyStylesProvider size="sm" c="dimmed" mt='sm'>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />
                        </TypographyStylesProvider>
                        
                        <Flex  justify='space-between' align='center' mt='sm' mb='0'>
                            <Group>
                                <Text size='xs' >
                                        {DateTime.fromObject(data.createdAt).toFormat('DD')}
                                </Text>
                                <Button variant='subtle' size='xs'>
                                    {data.author.name}
                                </Button>
                            </Group>

                            <Group>
                                <Button variant='subtle' onClick={async()=>{
                                    await fetchPostData(data.postId);
                                    setEditPostId(data.postId);
                                    editHandlers.open();
                                }}>
                                    <IconEdit/>
                                </Button>
                                <Button variant='subtle' onClick={()=>{

                                    deletePost(data.postId);
                                }}>
                                    <IconTrash color='#d76060'/>
                                </Button>
                            </Group>
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    )
}

export default Dashboard;