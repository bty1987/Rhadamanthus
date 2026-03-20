package com.fanglin.quotation.vo;

import java.util.List;

import com.fanglin.core.vo.BaseVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.communion.po.CompanyPO;
import com.fanglin.communion.po.DepartmentPO;

/**
 * 装修单预算分配请求表 VO
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignRequestVO extends BaseVO {

    /**
     * 请求ID
     */
    private Long qarid;

    /**
     * 装修单号
     */
    private String orderId;

    /**
     * 公司对象
     */
    private CompanyPO company;

    /**
     * 部门对象
     */
    private DepartmentPO department;

    /**
     * 装修类型：1-半包，2-整装
     */
    private Short decorationType;

    /**
     * 优先级：1-最高，5-普通，9-最低
     */
    private Short priority;

    /**
     * 请求时间
     */
    private String requestTime;

    /**
     * 请求人用户对象
     */
    private UserPO requestUser;

    /**
     * 状态: 1-待分配，2-已分配
     */
    private Short status;

    /**
     * 分配时间
     */
    private String assignTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private String createTime;

    // ==================== Getter & Setter ====================

    public Long getQarid() {
        return qarid;
    }

    public void setQarid(Long qarid) {
        this.qarid = qarid;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public CompanyPO getCompany() {
        return company;
    }

    public void setCompany(CompanyPO company) {
        this.company = company;
    }

    public DepartmentPO getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentPO department) {
        this.department = department;
    }

    public Short getDecorationType() {
        return decorationType;
    }

    public void setDecorationType(Short decorationType) {
        this.decorationType = decorationType;
    }

    public Short getPriority() {
        return priority;
    }

    public void setPriority(Short priority) {
        this.priority = priority;
    }

    public String getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(String requestTime) {
        this.requestTime = requestTime;
    }

    public UserPO getRequestUser() {
        return requestUser;
    }

    public void setRequestUser(UserPO requestUser) {
        this.requestUser = requestUser;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public String getAssignTime() {
        return assignTime;
    }

    public void setAssignTime(String assignTime) {
        this.assignTime = assignTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
}
