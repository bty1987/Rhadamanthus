/**
 * @File Name		: QuotationAssignConfigDaoImpl.java
 * @Package  	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 DAO 实现类
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 DAO 实现类
 *
 * <p>职责：实现预算配置的数据库访问操作</p>
 *
 * @author bty1987
 * @version 1.0
 */
@Repository("quotationAssignConfigDao")
public class QuotationAssignConfigDaoImpl extends DaoImpl<QuotationAssignConfigPO> implements QuotationAssignConfigDao {

	/**
	 * 构造函数
	 */
	public QuotationAssignConfigDaoImpl() {
		super(QuotationAssignConfigPO.class);
	}

	@Override
	public List<QuotationAssignConfigPO> pageQuotationAssignConfig(Paging paging, Integer company) {
		PagingQuery<QuotationAssignConfigPO> query = pagingQuery(paging, QuotationAssignConfigPO.class);

		// 按公司筛选
		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		// 按创建时间倒序排序
		query.addOrder(Order.desc("createTime"));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public QuotationAssignConfigPO queryQuotationAssignConfigByCompanyAndDepartment(int company, Integer department) {
		return (QuotationAssignConfigPO) createCriteria(QuotationAssignConfigPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("department", department))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfigByCompany(int company) {
		return createCriteria(QuotationAssignConfigPO.class)
				.add(Restrictions.eq("company", company))
				.addOrder(Order.asc("department"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryEnabledQuotationAssignConfig(int company, Integer department) {
		return createCriteria(QuotationAssignConfigPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT))
				.add(Restrictions.or(
						Restrictions.eq("department", department),
						Restrictions.isNull("department")
				))
				.addOrder(Order.asc("department"))
				.list();
	}

	@Override
	public boolean hasEnabledAutoAssignConfig(int company) {
		Number count = (Number) createCriteria(QuotationAssignConfigPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT))
				.add(Restrictions.eq("autoAssign", QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT))
				.setProjection(Projections.rowCount())
				.uniqueResult();

		return count != null && count.intValue() > 0;
	}

	@Override
	public int deleteQuotationAssignConfig(long qacid) {
		String hql = "delete from QuotationAssignConfigPO where qacid = :qacid";
		return session().createQuery(hql)
				.setLong("qacid", qacid)
				.executeUpdate();
	}

	@Override
	public int updateQuotationAssignConfigForStatus(long qacid, short enabled) {
		String hql = "update QuotationAssignConfigPO set enabled = :enabled where qacid = :qacid";
		return session().createQuery(hql)
				.setShort("enabled", enabled)
				.setLong("qacid", qacid)
				.executeUpdate();
	}

	@Override
	public int updateQuotationAssignConfigForAssign(long qacid, short autoAssign) {
		String hql = "update QuotationAssignConfigPO set autoAssign = :autoAssign where qacid = :qacid";
		return session().createQuery(hql)
				.setShort("autoAssign", autoAssign)
				.setLong("qacid", qacid)
				.executeUpdate();
	}
}
