package com.fanglin.quotation.vo;

import java.util.List;

import com.fanglin.core.vo.BaseVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.communion.po.CompanyPO;
import com.fanglin.communion.po.DepartmentPO;

/**
 * 预算员规则表 VO
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public class QuotationAssignUserRuleVO extends BaseVO {

    /**
     * 预算员规则ID
     */
    private Long qaurid;

    /**
     * 预算员用户对象
     */
    private UserPO user;

    /**
     * 公司对象
     */
    private CompanyPO company;

    /**
     * 部门对象
     */
    private DepartmentPO department;

    /**
     * 状态: 1-待分配，2-制作中，3-停止
     */
    private Short status;

    /**
     * 支持的类型（单选）：-1通用，0半包，1整装
     */
    private Integer supportedType;

    /**
     * 最后完成时间
     */
    private String lastFinishTime;

    /**
     * 当前任务数量
     */
    private Integer currentTaskCount;

    /**
     * 创建时间
     */
    private String createTime;

    /**
     * 更新时间
     */
    private String updateTime;

    // ==================== Getter & Setter ====================

    public Long getQaurid() {
        return qaurid;
    }

    public void setQaurid(Long qaurid) {
        this.qaurid = qaurid;
    }

    public UserPO getUser() {
        return user;
    }

    public void setUser(UserPO user) {
        this.user = user;
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

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public Integer getSupportedType() {
        return supportedType;
    }

    public void setSupportedType(Integer supportedType) {
        this.supportedType = supportedType;
    }

    public String getLastFinishTime() {
        return lastFinishTime;
    }

    public void setLastFinishTime(String lastFinishTime) {
        this.lastFinishTime = lastFinishTime;
    }

    public Integer getCurrentTaskCount() {
        return currentTaskCount;
    }

    public void setCurrentTaskCount(Integer currentTaskCount) {
        this.currentTaskCount = currentTaskCount;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }
}
