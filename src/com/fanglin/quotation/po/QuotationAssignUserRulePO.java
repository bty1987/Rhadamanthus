package com.fanglin.quotation.po;

import java.sql.Timestamp;
import com.fanglin.core.po.BasePO;

/**
 * 预算员规则表 PO
 *
 * 表名: quotation.quotationassignuserrule
 * 说明: 定义预算员的基本信息和状态
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignUserRulePO extends BasePO {

    private static final long serialVersionUID = 1L;

    /**
     * 预算员规则ID (主键)
     */
    private long qaurid;

    /**
     * 用户ID (预算员工号，该用户会被分配为装修单的报价员)
     */
    private int uid;

    /**
     * 关联公司ID
     */
    private int company;

    /**
     * 部门ID (NULL表示该公司所有部门)
     */
    private Integer department;

    /**
     * 状态: 1-待分配(可接收新任务)，2-制作中(正在处理任务)，3-停止(不再接收任务)
     */
    private short status;

    /**
     * 最后完成时间 (用于自动分配排序，最早完成的优先)
     */
    private Timestamp lastFinishTime;

    /**
     * 当前任务数量 (缓存字段，基于quotationassignrequest统计)
     */
    private Integer currentTaskCount;

    /**
     * 任务数量统计时间 (用于判断缓存是否过期)
     */
    private Timestamp taskCountUpdateTime;

    /**
     * 创建时间
     */
    private Timestamp createTime;

    /**
     * 更新时间
     */
    private Timestamp updateTime;

    // ==================== Getter & Setter ====================

    public long getQaurid() {
        return qaurid;
    }

    public void setQaurid(long qaurid) {
        this.qaurid = qaurid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getCompany() {
        return company;
    }

    public void setCompany(int company) {
        this.company = company;
    }

    public Integer getDepartment() {
        return department;
    }

    public void setDepartment(Integer department) {
        this.department = department;
    }

    public short getStatus() {
        return status;
    }

    public void setStatus(short status) {
        this.status = status;
    }

    public Timestamp getLastFinishTime() {
        return lastFinishTime;
    }

    public void setLastFinishTime(Timestamp lastFinishTime) {
        this.lastFinishTime = lastFinishTime;
    }

    public Integer getCurrentTaskCount() {
        return currentTaskCount;
    }

    public void setCurrentTaskCount(Integer currentTaskCount) {
        this.currentTaskCount = currentTaskCount;
    }

    public Timestamp getTaskCountUpdateTime() {
        return taskCountUpdateTime;
    }

    public void setTaskCountUpdateTime(Timestamp taskCountUpdateTime) {
        this.taskCountUpdateTime = taskCountUpdateTime;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }
}
