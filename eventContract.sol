//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;


contract EventContract {
    address payable private owner;

    constructor() public{
        owner = payable(msg.sender);
    }

 struct Event{
   address organizer;
   string name;
   uint date;
   uint price;
   uint ticketCount; 
   uint ticketRemain;
 }


 mapping(uint=>Event) public events;
 mapping(address=>mapping(uint=>uint)) public tickets;
 uint public nextId;

 function showOwner() public view returns(address){
     return owner;
 }

 function createEvent(string memory name,uint date,uint price,uint ticketCount) external{
   require(msg.sender == owner, "Access denied. Function can only be called by the owner.");
   require(date>block.timestamp,"You can organize event for future date");
   require(ticketCount>0,"You can organize event only if you create more than 0 tickets");


   events[nextId++] = Event(msg.sender,name,date,price,ticketCount,ticketCount);
 }


 function buyTicket(uint id,uint quantity) external payable{
   require(events[id].date!=0,"Event does not exist");
   require(events[id].date>block.timestamp,"Event has already occured");
   Event storage _event = events[id];
   require(msg.value>=(_event.price*quantity),"Ethere is not enough");
   require(_event.ticketRemain>=quantity,"Not enough tickets");
   _event.ticketRemain-=quantity;
   tickets[msg.sender][id]+=quantity;


 }


 function transferTicket(uint id,uint quantity,address to) external{
   require(events[id].date!=0,"Event does not exist");
   require(events[id].date>block.timestamp,"Event has already occured");
   require(tickets[msg.sender][id]>=quantity,"You do not have enough tickets");
   tickets[msg.sender][id]-=quantity;
   tickets[to][id]+=quantity;
 }

 function eventOver(uint id) external payable {
   require(msg.sender == owner, "Access denied. Function can only be called by the owner.");
   events[id] = Event(0x0000000000000000000000000000000000000000,"0",0,0,0,0);
   owner.transfer(address(this).balance);
 }

}

 



