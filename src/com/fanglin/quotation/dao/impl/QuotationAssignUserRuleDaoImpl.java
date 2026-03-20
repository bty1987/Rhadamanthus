package com.fanglin.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.BaseDaoImpl;
import com.fanglin.core.dao.Page;
import com.fanglin.core.dao.Filter;
import com.fanglin.core.exception.FLException;
import com.fanglin.quotation.dao.QuotationAssignUserRuleDao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;

/**
 * 预算员规则表 DAO 实现类
 *
 * @author Claude AI
 * @date 2026-03-20
 */
@Repository("quotationAssignUserRuleDao")
public class QuotationAssignUserRuleDaoImpl extends DaoImpl<QuotationAssignUserRulePO> implements QuotationAssignUserRuleDao {

    @Override
    public void pageQuotationAssignUserRule(Page page, List<Filter> filters) throws FLException {
        pageQuotationAssignUserRule(page, filters, null, null);
    }

    @Override
    public QuotationAssignUserRulePO get(long qaurid) throws FLException {
        return get(QuotationAssignUserRulePO.class, qaurid);
    }

    @Override
    public QuotationAssignUserRulePO getByUidAndCompany(int uid, int company) throws FLException {
        String hql = "FROM QuotationAssignUserRulePO WHERE uid = :uid AND company = :company";
        Query query = getSession().createQuery(hql);
        query.setParameter("uid", uid);
        query.setParameter("company", company);
        query.setMaxResults(1);
        List<QuotationAssignUserRulePO> list = query.list();
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException {
        String hql = "FROM QuotationAssignUserRulePO WHERE company = :company AND status = 1";

        if (department != null) {
            hql += " AND department = :department";
            return list(QuotationAssignUserRulePO.class, hql, "department", department, "company", company);
        } else {
            hql += " AND department IS NULL";
            return list(QuotationAssignUserRulePO.class, hql, "company", company);
        }
    }

    @Override
    public int addQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException {
        save(quotationAssignUserRule);
        return 1;
    }

    @Override
    public int updateQuotationAssignUserRule(QuotationAssignUserRulePO quotationAssignUserRule) throws FLException {
        update(quotationAssignUserRule);
        return 1;
    }

    @Override
    public int deleteQuotationAssignUserRule(long qaurid) throws FLException {
        delete(QuotationAssignUserRulePO.class, qaurid);
        return 1;
    }

    @Override
    public int updateQuotationAssignUserRuleStatus(long qaurid, short status) throws FLException {
        String hql = "UPDATE QuotationAssignUserRulePO SET status = :status WHERE qaurid = :qaurid";
        Query query = getSession().createQuery(hql);
        query.setParameter("status", status);
        query.setParameter("qaurid", qaurid);
        return query.executeUpdate();
    }

    @Override
    public int updateLastFinishTime(long qaurid, Timestamp lastFinishTime) throws FLException {
        String hql = "UPDATE QuotationAssignUserRulePO SET lastFinishTime = :lastFinishTime WHERE qaurid = :qaurid";
        Query query = getSession().createQuery(hql);
        query.setParameter("lastFinishTime", lastFinishTime);
        query.setParameter("qaurid", qaurid);
        return query.executeUpdate();
    }

    /**
     * 分页查询（内部方法）
     */
    private void pageQuotationAssignUserRule(Page page, List<Filter> filters, String hql, String orderBy) {
        List<Object> params = new ArrayList<Object>();
        StringBuilder sql = new StringBuilder();
        StringBuilder whereSql = new StringBuilder();

        sql.append("SELECT qaurid FROM quotation.quotationassignuserrule WHERE 1=1");

        // 构建查询条件
        if (filters != null && !filters.isEmpty()) {
            for (Filter filter : filters) {
                if ("uid".equals(filter.getName())) {
                    whereSql.append(" AND uid = :uid");
                    params.add(filter.getValue());
                } else if ("company".equals(filter.getName())) {
                    whereSql.append(" AND company = :company");
                    params.add(filter.getValue());
                } else if ("department".equals(filter.getName())) {
                    if (filter.getValue() != null && !"".equals(filter.getValue())) {
                        whereSql.append(" AND department = :department");
                        params.add(filter.getValue());
                    } else {
                        whereSql.append(" AND department IS NULL");
                    }
                } else if ("status".equals(filter.getName())) {
                    whereSql.append(" AND status = :status");
                    params.add(filter.getValue());
                }
            }
        }

        sql.append(whereSql);

        // 排序
        if (orderBy == null) {
            sql.append(" ORDER BY qaurid DESC");
        } else {
            sql.append(orderBy);
        }

        // 执行分页查询
        pageBySql(page, sql.toString(), params, "qaurid");
    }
}
