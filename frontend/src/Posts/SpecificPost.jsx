import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {Text, Container, Title, Loader, Modal, Input, Center, Button, TypographyStylesProvider, Group} from '@mantine/core';
import {DateTime} from 'luxon'
import {IconEdit, IconTrash} from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom';
import { useDisclosure } from "@mantine/hooks";
import TextEditor from "../Components/TextEditor";


function SpecificPost(){

    const [postData, setPostData] = useState('');
    let {postId} = useParams();

    const[heading, setHeading] = useState('');
    const [content, setContent] = useState('');
    
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
    return(
            <>
            {!postData && 
                <Center>
                    <Loader/>
                </Center>
            }
            {postData && 
                <Container>
                    <Title order={2}>{postData.heading}</Title>
                    <TypographyStylesProvider >
                    <div 
                        dangerouslySetInnerHTML={{ __html: postData.content }}
                    />
                    </TypographyStylesProvider>
                    <Text size='xs' align='right'>
                        {DateTime.fromObject(postData.createdAt).toFormat('DD')}
                    </Text>

                    <Group display='flex' justify="space-around" >
                        <Button size='xs' onClick={handlers.open} w='20%' variant="transparent">
                            <IconEdit />
                        </Button>
                        <Button size='xs' w='20%' variant="transparent"
                        onClick={handleDelete}>
                            <IconTrash/>
                        </Button>
                    </Group>
                </Container>
                }
            <Modal opened={opened} onClose={handlers.close} title='Update Post' closeOnClickOutside={false}  size='auto' centered>
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
        </>
    )
}


export default SpecificPost;