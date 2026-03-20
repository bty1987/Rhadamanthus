package com.fanglin.quotation.vo;

import com.fanglin.core.vo.BaseVO;
import com.fanglin.personel.po.UserPO;

/**
 * 装修单预算分配记录表 VO
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignRecordVO extends BaseVO {

    /**
     * 分配记录ID
     */
    private Long qasrid;

    /**
     * 装修单号
     */
    private String orderId;

    /**
     * 预算员用户对象
     */
    private UserPO user;

    /**
     * 分配类型：1-正向自动，2-手动，3-反向自动
     */
    private Short assignType;

    /**
     * 分配结果：0-失败，1-成功
     */
    private Byte assignResult;

    /**
     * 分配人用户对象
     */
    private UserPO assignUser;

    /**
     * 分配时间
     */
    private String assignTime;

    /**
     * 失败原因
     */
    private String failReason;

    /**
     * 装修类型
     */
    private Short decorationType;

    // ==================== Getter & Setter ====================

    public Long getQasrid() {
        return qasrid;
    }

    public void setQasrid(Long qasrid) {
        this.qasrid = qasrid;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public UserPO getUser() {
        return user;
    }

    public void setUser(UserPO user) {
        this.user = user;
    }

    public Short getAssignType() {
        return assignType;
    }

    public void setAssignType(Short assignType) {
        this.assignType = assignType;
    }

    public Byte getAssignResult() {
        return assignResult;
    }

    public void setAssignResult(Byte assignResult) {
        this.assignResult = assignResult;
    }

    public UserPO getAssignUser() {
        return assignUser;
    }

    public void setAssignUser(UserPO assignUser) {
        this.assignUser = assignUser;
    }

    public String getAssignTime() {
        return assignTime;
    }

    public void setAssignTime(String assignTime) {
        this.assignTime = assignTime;
    }

    public String getFailReason() {
        return failReason;
    }

    public void setFailReason(String failReason) {
        this.failReason = failReason;
    }

    public Short getDecorationType() {
        return decorationType;
    }

    public void setDecorationType(Short decorationType) {
        this.decorationType = decorationType;
    }
}
