import {Card, Image, Text, Badge, Button, Group, SimpleGrid, Loader, Center, Flex} from '@mantine/core'
import { useEffect, useState} from 'react';
import {DateTime} from 'luxon';


function Dashboard(){
    const [postData, setpostData] = useState(null);
    useEffect(()=>{
        fetch('http://192.168.1.6:3000/posts')
        .then(data=>data.json())
        .then(data=>setpostData(data))

        console.log(postData);
    },[])


    return (
        <SimpleGrid cols={1}>
            {!postData &&
            <Center>
                 <Loader color='blue'/>
            </Center>}
            {postData && postData.map((data)=>(
                <Card key={data.postId} shadow="sm" padding='lg' radius='md' withBorder >
                    <Text fw={500}>{data.heading}</Text>
                    <Text size="sm" c="dimmed">
                        {data.content}
                    </Text>
                    
                    <Flex  justify='space-between' align='center' mt='sm'>
                        <Text size='xs' >
                                {DateTime.fromObject(data.createdAt).toFormat('DD')}
                        </Text>
                        <Badge color='green'  size='sm' mt='sm'>
                            {data.author.name}
                        </Badge>
                        
                    </Flex>
                </Card>
            ))}
        </SimpleGrid>
    )
}

export default Dashboard;