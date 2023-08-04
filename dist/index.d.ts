import React from 'react';
export { default as styles } from './index.css';

interface ButtonProps {
    label: string;
}
declare const Button: ({ label }: ButtonProps) => React.JSX.Element;

declare const Collapse: ({ setToggle, toggle }: any) => React.JSX.Element;

declare const ChatListing: ({ showChatList, pinnedChatsDetails, listingChats, snoozeChatsDetails, allChannelItem, showChat, showPinnedChatsList, showSnoozeChatsList, updateChannel, setShowList, setShowPinnedChatsList, setShowSnoozeChatsList, activeUser, setActiveUser, setAllChannelItem, setPinnedChatsItem, updateChannelDateTime, }: any) => React.JSX.Element;

declare const MemberListing: (allChannelItem: any) => React.JSX.Element;

declare const AddMembers: ({ allChannelItem, showAddMemberModel, setShowAddMemberModel, setHideMemberModel, userDataList, }: any) => React.JSX.Element;

declare const Header: ({ setToggle }: any) => React.JSX.Element;

declare const PinAccordian: ({ icon, label, isCollapsible, search, dataFalse, LastPinnedGroups, setDataFalse, }: any) => React.JSX.Element;

declare const Accordion: ({ icon, label, isCollapsible, search, data, LastPinnedGroups, LastSnoozeGroups, setData, readCount, }: any) => React.JSX.Element;

declare const Tile: ({ search, data, LastPinnedGroups, LastSnoozeGroups, setData, channelIdData, }: any) => React.JSX.Element;

declare const SnoozeGroupDetails: ({ data, LastSnoozeGroups, setData }: any) => React.JSX.Element;

declare const UpTabs: () => React.JSX.Element;

declare const PinChatDetails: ({ dataFalse, LastPinnedGroups, setDataFalse }: any) => React.JSX.Element;

export { Accordion, AddMembers, Button, ChatListing, Collapse, Header, MemberListing, PinAccordian, PinChatDetails, SnoozeGroupDetails, Tile, UpTabs };
