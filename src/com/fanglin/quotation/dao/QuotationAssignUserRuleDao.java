package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.core.dao.Page;
import com.fanglin.core.dao.Filter;

import java.util.List;

/**
 * 预算员规则表 DAO 接口
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignUserRuleDao extends Dao<QuotationAssignUserRulePO> {

    /**
     * 分页查询预算员规则列表
     * @param page 分页对象
     * @param filters 过滤条件
     * @throws FLException 业务异常
     */
    void pageQuotationAssignUserRule(Page page, List<Filter> filters) throws FLException;

    /**
     * 根据ID查询预算员规则
     * @param qaurid 预算员规则ID
     * @return 预算员规则PO
     * @throws FLException 业务异常
     */
    QuotationAssignUserRulePO get(long qaurid) throws FLException;

    /**
     * 根据用户ID和公司ID查询预算员规则
     * @param uid 用户ID
     * @param company 公司ID
     * @return 预算员规则PO
     * @throws FLException 业务异常
     */
    QuotationAssignUserRulePO getByUidAndCompany(int uid, int company) throws FLException;

    /**
     * 查询所有待分配的预算员（status=1，按最后完成时间排序）
     * @param company 公司ID
     * @param department 部门ID（可选，NULL表示查询所有部门）
     * @return 预算员规则列表
     * @throws FLException 业务异常
     */
    List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException;

    /**
     * 新增预算员规则
     * @param quotationAssignUserRule 预算员规则PO
     * @return 影响行数
     * @throws FLException 业务异常
     */
    int addQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException;

    /**
     * 更新预算员规则
     * @param quotationAssignUserRule 预算员规则PO
     * @return 影响行数
     * @throws FLException 业务异常
     */
    int updateQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException;

    /**
     * 删除预算员规则
     * @param qaurid 预算员规则ID
     * @return 影响行数
     * @throws FLException 业务异常
     */
    int deleteQuotationAssignUserRule(long qaurid) throws FLException;

    /**
     * 更新预算员状态
     * @param qaurid 预算员规则ID
     * @param status 状态（1-待分配，2-制作中，3-停止）
     * @return 影响行数
     * @throws FLException 业务异常
     */
    int updateQuotationAssignUserRuleStatus(long qaurid, short status) throws FLException;

    /**
     * 更新最后完成时间
     * @param qaurid 预算员规则ID
     * @param lastFinishTime 最后完成时间
     * @return 影响行数
     * @throws FLException 业务异常
     */
    int updateLastFinishTime(long qaurid, java.sql.Timestamp lastFinishTime) throws FLException;
}
