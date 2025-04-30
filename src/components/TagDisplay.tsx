import React from 'react';
 import { Badge, BadgeText } from '@gluestack-ui/themed';

 interface TagDisplayProps {
     tag: string;
 }

 /** Renders a single tag using a themed Badge. (Stories 35, 47) */
 const TagDisplay: React.FC<TagDisplayProps> = ({ tag }) => (
     <Badge action="info" variant="solid" mr="$1.5" mb="$1.5">
         <BadgeText>{tag}</BadgeText>
     </Badge>
 );
 export default TagDisplay;