
$.extend(api.index, {
    messageIndex: {url: "/views/information/messageMng.html"},
    moreNoticesIndex: {url: "/views/information/moreNotices.html"},
    noticeIndex: {url: "/views/information/noticeMng.html"},
    activityIndex: {url: "/views/information/activity.html"},
    activityItemIndex: {url: "/views/information/activityItem.html"},
    phoneCallIndex: {url: "/views/information/phoneCall.html"}
});

$.extend(api, {information: {
    pageMessage: {url: "pageMessage.do", demo: true},
    queryMessageForUnRead: {url: "queryMessageForUnRead.do"},
    countMessage: {url: "countMessage.do", demo: true},
    queryMessageByMid : {url:"queryMessageByMid.do",demo:true},
    sendMessage: {url: "sendMessage.do"},
    updateMessageForRead: {url: "updateMessageForRead.do"},
    deleteMessageById: {url: "deleteMessageById.do"},
    deleteMessageByIds: {url: "deleteMessageByIds.do"},

    pageNotice: {url: "pageNotice.do", demo: true},
    pageNoticeForSeenByType: {url: "pageNoticeForSeenByType.do", demo: true},
    queryNoticeByNid: {url: "queryNoticeByNid.do"},
    addNotice: {url: "addNotice.do"},
    updateNotice: {url: "updateNotice.do"},
    deleteNotice: {url: "deleteNotice.do"},
    updateNoticeDepartments:{url:"updateNoticeDepartments.do"},
    queryNoticeDepartment: {url: "queryNoticeDepartment.do"},
    updateNoticeDepartment:{url: "updateNoticeDepartment.do"},
    
    pageActivity: {url: "pageActivity.do", demo: true},
    queryActivityForValid: {url: "queryActivityForValid.do", demo: true},
    queryActivityItemByAId: {url: "queryActivityItemByAId.do", demo: true},
    addActivity: {url: "addActivity.do"},
    addActivityItem: {url: "addActivityItem.do"},
    updateActivity: {url: "updateActivity.do"},
    updateActivityItem: {url: "updateActivityItem.do"},
    deleteActivityItemByAiId: {url: "deleteActivityItemByAiId.do"},
 

    queryEvent: {url: "queryEvent.do", demo:true},
    addEvent: {url: "addEvent.do"},
    deleteEvent: {url: "deleteEvent.do"},

    pagePhoneCall:{url:"pagePhoneCall.do"},
    phoneCall:{url:"phoneCall.do"},
    updatePhoneCallForInfo:{url:"updatePhoneCallForInfo.do"},
    updatePhoneCallForRecord:{url:"updatePhoneCallForRecord.do"},
    
    pageVticket: {url: "pageVticket.do"},
    pageVticketForBelonger: {url: "pageVticketForBelonger.do"},
    countVticket:{url:"countVticket.do"},
    createVticket:{url:"createVticket.do"},
    updateVticket:{url:"updateVticket.do"},
    
    //大活动—活动款
    pageVpayment:{url:"pageVpayment.do"},
    countVpayment:{url:"countVpayment.do"},
    createVpayment:{url:"createVpayment.do"},
    deleteVpaymentId:{url:"deleteVpaymentId.do"},
}});
